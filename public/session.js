const socket = io();
const sessionId = window.location.pathname.split('/')[1];

function joinSession() {
    const name = getElementValue('name');
    if (name) {
        const userId = getCookie('userId');
        document.cookie = `sessionId=${sessionId}; path=/; Secure`;
        document.cookie = `name=${name}; path=/; Secure`;
        socket.emit('joinSession', { sessionId, name, userId });
        hideElement('join');
        showElement('app');
        showElement('bottom-bar', 'flex');
        hideElement('average');
    } else {
        showNotification('Please enter your name first.', true);
        return;
    }
}

function vote(point) {
    socket.emit('vote', { vote: point });
}

function reveal() {
    socket.emit('revealVotes');
}

function restart() {
    socket.emit('restartVoting');
}

function endSession() {
    socket.emit('endSession');
}

function leaveSession() {
    fetch('/leave-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        showNotification(data.message);
        window.location.href = '/';
    })
    .catch(error => {
        console.error('Error leaving session:', error);
        showNotification('Error leaving session. Please try again.', true);
    });
}

socket.on('setUserId', (userId) => {
    document.cookie = `userId=${userId}; path=/; Secure`;
});

socket.on('userList', (users) => {
    const userList = document.getElementById('users');
    userList.innerHTML = '';
    users.forEach(([id, name]) => {
        const div = document.createElement('div');
        div.innerText = name;
        div.id = id;
        userList.appendChild(div);
    });
});

socket.on('updatePoints', (points) => {
    const votesDiv = document.getElementById('votes');
    votesDiv.innerHTML = '';
    points.forEach(point => {
        const button = document.createElement('button');
        button.innerText = point;
        button.onclick = () => vote(point);
        votesDiv.appendChild(button);
    });
});

socket.on('voteReceived', (userId) => {
  console.log("voteReceived");
    document.getElementById(userId).style.backgroundColor = 'lightgreen';
});

socket.on('revealVotes', (data) => {
    const { votes, average } = data;
    if (average) {
        for (const [userId, vote] of Object.entries(votes)) {
            const userElement = document.getElementById(userId);
            if (userElement) {
                userElement.innerText += `: ${vote}`;
            }
        }
        document.getElementById('average').innerText = `Average: ${average.toFixed(2)}`;
        hideElement('reveal');
        showElement('average');
        const sessionOwner = getCookie('userId');
        socket.emit('getSessionOwner', { sessionId });
    }
});

socket.on('setSessionOwner', (ownerId) => {
    const userId = getCookie('userId');
    if (userId === ownerId) {
        showElement('restart');
        showElement('end');
        showElement('reveal');
    }
});

socket.on('restartVoting', () => {
  console.log("restartVoting");
    document.getElementById('average').innerText = '';
    hideElement('restart');
    //hideElement('end');
    hideElement('average');
    const userList = document.getElementById('users');
    userList.childNodes.forEach(div => {
        div.style.backgroundColor = '';
        const name = div.innerText.split(':')[0];
        div.innerText = name;
    });
});

socket.on('sessionEnded', () => {
    showNotification('The session has ended.');
    window.location.href = '/';
});

socket.on('sessionError', (message) => {
    showNotification(message, true);
    window.location.href = '/';
});

socket.on('sessionName', (name) => {
    document.getElementById('sessionName').innerText = `Session: ${name}`;
});

socket.on('currentVotes', (votes) => {
  console.log("currentVotes",votes);
    for (const [userId, vote] of Object.entries(votes)) {
        const userElement = document.getElementById(userId);
        if (userElement) {
            userElement.style.backgroundColor = 'lightgreen';
        }
    }
});

socket.on('updateOwner', (sessionOwner) => {
  console.log("updateOwner");
    const userId = getCookie('userId');
     if (userId === sessionOwner) {
        showElement('reveal');
        showElement('restart');
        showElement('end')
     } else {
        hideElement('reveal');
        hideElement('restart');
        hideElement('end');
     }
});


window.onload = () => {
  console.log("loaded");
    const userId = getCookie('userId');
    const name = getCookie('name');
    if (userId && name && getCookie('sessionId') === sessionId) {
        socket.emit('joinSession', { sessionId, name, userId });
        hideElement('join');
        showElement('app');
        showElement('bottom-bar', 'flex');
        hideElement('average');
    }
};
