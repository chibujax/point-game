const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

let sessions = {}; // To keep track of sessions in memory
const sessionsFilePath = path.join(__dirname, "sessions.json");

// Load sessions from file if it exists
const loadSessions = () => {
  if (fs.existsSync(sessionsFilePath)) {
    sessions = JSON.parse(fs.readFileSync(sessionsFilePath, "utf8"));
  } else {
    sessions = {};
  }
};

const sendCurrentVotesToUsers = (sessionId) =>{
  const votes = sessions[sessionId].votes;
  const votedUsers = Object.entries(votes).reduce((result, [userId, vote]) => {
      if (vote !== undefined) {
          result[userId] = vote;
      }
      return result;
  }, {});
  io.to(sessionId).emit('currentVotes', votedUsers);
} 

const saveSessionsToFile = () => {
  fs.writeFileSync(sessionsFilePath, JSON.stringify(sessions, null, 2), "utf8");
};

loadSessions();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post("/create-session", (req, res) => {
  const sessionId = `session_${Date.now()}`;
  const { sessionName, displayName, points } = req.body;
  const userId = uuidv4();
  sessions[sessionId] = {
    name: sessionName,
    users: { [userId]: displayName },
    votes: {},
    points,
    owner: userId,
  };
  saveSessionsToFile();
  res.cookie("sessionId", sessionId, { secure: true });
  res.cookie("userId", userId, { secure: true });
  res.cookie("owner", userId, { secure: true });
  res.cookie("name", displayName, { secure: true });
  res.json({ sessionId, userId });
});

app.get("/:sessionId", (req, res) => {
  const sessionId = req.params.sessionId;
  if (sessions[sessionId]) {
    res.sendFile(path.join(__dirname, "public", "session.html"));
  } else {
    res.status(404).send("Session not found");
  }
});

app.post("/set-vote-title", (req, res) => {
  const { sessionId, voteTitle } = req.body;
  if (sessions[sessionId]) {
    sessions[sessionId].voteTitle = voteTitle;
    saveSessionsToFile();
    io.to(sessionId).emit("updateVoteTitle", voteTitle);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: "Session not found" });
  }
});

app.post("/leave-session", (req, res) => {
  const { sessionId, userId } = req.cookies;
  const currentSession = sessions[sessionId];
  const isUser = sessions[sessionId].users[userId];
  if (!currentSession ||  !isUser) {
    return res.status(400).json({ message: "Session or user not found" });
  }

  const userCount = Object.keys(currentSession.users).length;
  const isAdmin = currentSession.owner === userId;

  if (isAdmin && userCount > 1) {
    const otherUsers = Object.entries(currentSession.users)
      .filter(([id]) => id !== userId)
      .map(([id, name]) => ({ id, name }));
    
    return res.json({ 
      requiresTransfer: true, 
      users: otherUsers 
    });
  }

  if (isAdmin && userCount > 1) {
    // Return the list of other users for admin selection
    const otherUsers = Object.entries(currentSession.users)
      .filter(([id]) => id !== userId)
      .map(([id, name]) => ({ id, name }));
    
    return res.json({ 
      requiresTransfer: true, 
      users: otherUsers 
    });
  }

  if (userCount <= 1) {
    delete sessions[sessionId];
  } else {
    delete currentSession.users[userId];
    if (isAdmin) {
      currentSession.owner = Object.keys(currentSession.users)[0];
      io.to(sessionId).emit("updateOwner", currentSession.owner);
    }
  }

  saveSessionsToFile();
  res.clearCookie("sessionId");
  res.clearCookie("userId");
  res.clearCookie("owner");
  res.clearCookie("name");
  return res.json({ message: "Left session successfully" });
});

app.post("/transfer-admin", (req, res) => {
  const { sessionId, currentAdminId, newAdminId } = req.body;
  const session = sessions[sessionId];
  
  if (!session) {
    return res.status(404).json({ success: false, message: "Session not found" });
  }
  
  if (session.owner !== currentAdminId) {
    return res.status(403).json({ success: false, message: "Only current admin can transfer ownership" });
  }

  if (!session.users[newAdminId]) {
    return res.status(404).json({ success: false, message: "New admin user not found" });
  }

  session.owner = newAdminId;
  saveSessionsToFile();
  
  io.to(sessionId).emit("updateOwner", newAdminId);
  res.json({ success: true, message: "Admin rights transferred successfully" });
});


io.on("connection", (socket) => {
  let currentSessionId = null;
  let userId;

  const cookies = socket.handshake.headers.cookie
    ? socket.handshake.headers.cookie.split("; ")
    : [];
  const userIdCookie = cookies.find((row) => row.startsWith("userId="));

  if (userIdCookie) {
    userId = userIdCookie.split("=")[1];
  } else {
    userId = uuidv4();
    socket.emit("setUserId", userId);
  }

  socket.on("joinSession", ({ sessionId, name }) => {
    if (sessions[sessionId]) {
      currentSessionId = sessionId;
      sessions[sessionId].users[userId] = name;
      saveSessionsToFile();
      socket.join(sessionId);
      io.to(sessionId).emit(
        "userList",
        Object.entries(sessions[sessionId].users)
      );
      io.to(sessionId).emit("updatePoints", sessions[sessionId].points);
      io.to(sessionId).emit("sessionName", sessions[sessionId].name);
      io.to(sessionId).emit("updateOwner", sessions[sessionId].owner);
      sendCurrentVotesToUsers(sessionId);
    } else {
      socket.emit("sessionError", "Session not found");
    }
  });

  socket.on("vote", (data) => {
    if (currentSessionId) {
      sessions[currentSessionId].votes[userId] = data.vote;
      saveSessionsToFile();
      io.to(currentSessionId).emit("voteReceived", userId);
    }
  });

  socket.on("revealVotes", () => {
      if (!currentSessionId || sessions[currentSessionId].owner !== userId) {
          return socket.emit("sessionError", "Only the session owner can reveal votes");
      }    
      if (currentSessionId && sessions[currentSessionId].owner === userId) {
            const totalVotes = Object.values(sessions[currentSessionId].votes);
            if (totalVotes.length === 0) {
                return emitEmptyVoteResult();
            } 
            const sessionVotes = sessions[currentSessionId].votes;

            const voteGroups = processVotes(sessionVotes);

            return voteGroups;

      }  
    
      function processVotes(votesObject) {
          const votes = Object.entries(votesObject);
          const totalVoters = votes.length;

          // Count occurrences of each vote value
          const voteCount = {};
          votes.forEach(([, vote]) => {
              voteCount[vote] = (voteCount[vote] || 0) + 1;
          });

          // Find the highest vote count and all values with that count
          const maxVoteCount = Math.max(...Object.values(voteCount));
          const highestVoteValues = Object.entries(voteCount)
              .filter(([, count]) => count === maxVoteCount)
              .map(([value]) => parseInt(value));

          // Find the lowest vote count and all values with that count
          const minVoteCount = Math.min(...Object.values(voteCount));
          const lowestVoteValues = Object.entries(voteCount)
              .filter(([, count]) => count === minVoteCount)
              .map(([value]) => parseInt(value));

          // Group votes
          const highestVotes = [];
          const lowestVotes = [];
          const otherVotes = [];

          votes.forEach(([userID, vote]) => {
              if (highestVoteValues.includes(vote)) {
                  highestVotes.push({ [userID]: vote });
              } else if (lowestVoteValues.includes(vote)) {
                  lowestVotes.push({ [userID]: vote });
              } else {
                  otherVotes.push({ [userID]: vote });
              }
          });

        // Calculate average
        const sum = votes.reduce((acc, [, vote]) => acc + vote, 0);
        const average = sum / totalVoters;
        return io.to(currentSessionId).emit("revealVotes", {
            votes: votesObject,
            average: average,
            highestVotes: { value: highestVoteValues, voters: highestVotes },
            lowestVotes: { value: lowestVoteValues, voters: lowestVotes },
            otherVotes: otherVotes,
            totalVoters: totalVoters
        });
        
    }


    function emitEmptyVoteResult() {
        return io.to(currentSessionId).emit("revealVotes", {
            votes: {},
            average: 0,
            highestVotes: { value: 0, voters: [] },
            lowestVotes: { value: 0, voters: [] },
            otherVotes: [],
            totalVoters: 0
        });
    }
});



  socket.on("restartVoting", () => {
    if (currentSessionId && sessions[currentSessionId].owner === userId) {
      sessions[currentSessionId].votes = {};
      saveSessionsToFile();
      io.to(currentSessionId).emit("restartVoting");
      io.to(currentSessionId).emit("updateOwner", sessions[currentSessionId].owner);
    } else {
      socket.emit("sessionError", "Only the session owner can restart voting");
    }
  });

  socket.on("endSession", () => {
    if (currentSessionId && sessions[currentSessionId].owner === userId) {
      delete sessions[currentSessionId];
      saveSessionsToFile();
      io.to(currentSessionId).emit("sessionEnded");
    }
  });

  socket.on("disconnect", () => {
    if (currentSessionId && sessions[currentSessionId]) {
      delete sessions[currentSessionId].users[userId];
      saveSessionsToFile();
      io.to(currentSessionId).emit(
        "userList",
        Object.entries(sessions[currentSessionId].users)
      );
    }
  });

  socket.on("getSessionOwner", ({ sessionId }) => {
    const session = sessions[sessionId];
    if (session) {
      socket.emit("setSessionOwner", session.owner);
    }
  });

  socket.on("getTitle", ({ sessionId }) => {
    const session = sessions[sessionId];
    if (session) {
      const voteTitle = sessions[sessionId].voteTitle;
      socket.emit("updateVoteTitle", voteTitle);
    }
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
