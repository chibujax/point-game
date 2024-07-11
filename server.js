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


// Save sessions to file
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
  if (sessions[sessionId] && sessions[sessionId].users[userId]) {
    delete sessions[sessionId].users[userId];
    saveSessionsToFile();
    res.clearCookie("sessionId");
    res.clearCookie("userId");
    res.clearCookie("owner");
    res.clearCookie("name");
    res.json({ message: "Left session successfully" });
  } else {
    res.status(400).json({ message: "Session or user not found" });
  }
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
    if (currentSessionId && sessions[currentSessionId].owner === userId) {
      const totalVotes = Object.values(sessions[currentSessionId].votes);
      const average = totalVotes.reduce((a, b) => a + b, 0) / totalVotes.length;
      io.to(currentSessionId).emit("revealVotes", {
        votes: sessions[currentSessionId].votes,
        average,
      });
    } else {
      socket.emit("sessionError", "Only the session owner can reveal votes");
    }
  });

  socket.on("restartVoting", () => {
    if (currentSessionId && sessions[currentSessionId].owner === userId) {
      sessions[currentSessionId].votes = {};
      saveSessionsToFile();
      io.to(currentSessionId).emit("restartVoting");
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
