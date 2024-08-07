const socket = io();
const sessionId = window.location.pathname.split('/')[1];
function sanitizeInput(input) {
    const temp = document.createElement('div');
    temp.textContent = input;
    return temp.innerHTML;
}

function joinSession() {
    const name = getElementValue('name').trim();
    const validName = /^[A-Za-z]{3,10}$/;

    if (!validName.test(name)) {
        showNotification('Please enter a valid display name with only letters and numbers, up to 10 characters.', true);
        return;
    }

    if (name) {
        const userId = getCookie('userId');
        document.cookie = `sessionId=${sessionId}; path=/; Secure`;
        document.cookie = `name=${name}; path=/; Secure`;
        socket.emit('joinSession', { sessionId, name, userId });
        socket.emit('getTitle', { sessionId });
        hideElement('join');
        showElement('mainContent');
    } else {
        showNotification('Please enter your name first.', true);
    }
}


function hideAdmin() {
    hideElement('end');
    hideElement('revealBtn');
    hideElement('restart');
    hideElement('titleChange');
}

function showAdmin() {
    showElement('scoreAdmin');
    hideElement('revealBtn');
    showElement('end');
    showElement('titleChange', 'flex');
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
    .then(response => {
        if (response.ok) {
            return response.json().then(data => {
                showNotification(data.message);
                clearCookie();
                window.location.href = '/';
            });
        } else {
            return response.json().then(data => {
                showNotification(data.message || 'Error leaving session.', true);
            });
        }
    })
    .catch(error => {
        console.error('Error leaving session:', error);
        showNotification('Error leaving session. Please try again.', true);
    });
}

function setVoteTitle() {
    const voteTitle = getElementValue('voteTitle');
    if(voteTitle.length < 3) return false;
    const sanitizedVoteTitle = sanitizeInput(voteTitle);
    fetch('/set-vote-title', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId, voteTitle: sanitizedVoteTitle })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Vote title updated.');
        } else {
            showNotification('Error updating vote title.', true);
        }
    })
    .catch(error => {
        console.error('Error setting vote title:', error);
        showNotification('Error setting vote title. Please try again.', true);
    });
}


socket.on('setUserId', (userId) => {
    document.cookie = `userId=${userId}; path=/; Secure`;
});

socket.on('userList', (users) => {
    const userList = document.getElementById('users');
    userList.innerHTML = '';
    users.forEach(([id, name]) => {
        var outerDiv = document.createElement('div');
        outerDiv.setAttribute('class', 'col-xl-3 col-sm-6 mb-4');
        var cardDiv = document.createElement('div');
        cardDiv.setAttribute('class', 'card bg-gradient-info move-on-hover');
        cardDiv.id = id;
        var cardBodyDiv = document.createElement('div');
        cardBodyDiv.setAttribute('class', 'card-body');
        var dFlexDiv = document.createElement('div');
        dFlexDiv.setAttribute('class', 'd-flex');
        var h5 = document.createElement('h5');
        h5.setAttribute('class', 'mb-0 text-white');
        h5.innerText = name;
        var msAutoDiv = document.createElement('div');
        msAutoDiv.setAttribute('class', 'ms-auto');
        var h6 = document.createElement('h6');
        h6.setAttribute('class', 'text-white text-end mb-0 mt-n2');
        

        msAutoDiv.appendChild(h6);
        dFlexDiv.appendChild(h5);
        dFlexDiv.appendChild(msAutoDiv);
        var p = document.createElement('p');
        p.setAttribute('class', 'text-white mb-0');
        h5.id = id + "name"
        p.innerText = '';
        p.id = id + "score"
        cardBodyDiv.appendChild(dFlexDiv);
        cardBodyDiv.appendChild(p);
        cardDiv.appendChild(cardBodyDiv);
        outerDiv.appendChild(cardDiv);

        userList.appendChild(outerDiv);
    });
});


socket.on('updatePoints', (points) => {
    const votesDiv = document.getElementById('votes');
    votesDiv.innerHTML = '';
    points.forEach(point => {
        const button = document.createElement('button');
        votesDiv.appendChild(button);
        button.id = point + "name";
        button.setAttribute('type', 'button');
        button.setAttribute('class', 'btn bg-gradient-secondary btn-sm');
        button.innerText = point;
        button.onclick = () => vote(point);
    });
});

socket.on('voteReceived', (userId) => {
    console.log("vote recieved", userId)
    showElement('revealBtn');
    const userElement = document.getElementById(userId);
    if (userElement) {
        userElement.classList.add('bg-gradient-success');
        userElement.classList.remove('bg-gradient-info');
    }
});

socket.on('revealVotes', (data) => {
    const { votes, average, highestVote, lowestVote, totalVoters } = data;
    let allUserVotes = "";
    if (votes) {
        for (const [userId, vote] of Object.entries(votes)) {
            const userElement = document.getElementById(userId + "score");
            const userNameElement = document.getElementById(userId + "name");
            if (userElement) {
                userElement.innerText = vote;
            }
            if (userNameElement) {
                allUserVotes += `${userNameElement.innerText}: ${vote} <br/>`;
            }
        }
        document.getElementById('average').innerText = `Average: ${average.toFixed(2)}`;
        document.getElementById('highestVote').innerText = `Highest Vote: ${highestVote.value} (${highestVote.count} people voted)`;
        document.getElementById('lowestVote').innerText = `Lowest Vote: ${lowestVote.value} (${lowestVote.count} person voted)`;
        document.getElementById('totalVoters').innerText = `Total Votes: ${totalVoters}`;
        document.getElementById('allVoters').innerHTML = allUserVotes;
        hideElement('revealBtn', true);
        showElement('average');
        showElement('highestVote');
        showElement('lowestVote');
        showElement('totalVoters');
        showElement('allVoters');
        const sessionOwner = getCookie('userId');
        socket.emit('getSessionOwner', { sessionId });
    }
});



socket.on('setSessionOwner', (ownerId) => {
    const userId = getCookie('userId');
    if (userId === ownerId) {
        showAdmin()
    }
});

socket.on('updateVoteTitle', (voteTitle) => {
    const title = voteTitle || "";
    document.getElementById('voteTitleDisplay').innerText = "Vote Title: " + title;
});

socket.on('restartVoting', () => {
    document.getElementById('average').innerText = 'Average: 0';
    document.getElementById('highestVote').innerText = "";
    document.getElementById('lowestVote').innerText = "";
    document.getElementById('totalVoters').innerText = "";
    document.getElementById('allVoters').innerHtml = "";
    hideElement('revealBtn');
    const userList = document.getElementById('users');
    userList.childNodes.forEach(div => {
        div.firstChild.classList.add('bg-gradient-info');
        div.firstChild.classList.remove('bg-gradient-success');
        userId = div.firstChild.id;
        document.getElementById(userId + "score").innerText = ""
    });
});

socket.on('sessionEnded', () => {
    showNotification('The session has ended.');
    clearCookie();
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
    for (const [userId, vote] of Object.entries(votes)) {
        const userElement = document.getElementById(userId);
        if (userElement) {
            userElement.classList.add('bg-gradient-success');
            userElement.classList.remove('bg-gradient-info');
        }
    }
});

socket.on('updateOwner', (sessionOwner) => {
    const userId = getCookie('userId');
     if (userId === sessionOwner) {
        showAdmin();
     } else {
        hideAdmin();
     }
});

window.onload = () => {
    document.getElementById('voteTitle').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            setVoteTitle();
        }
    });
    const userId = getCookie('userId');
    const name = getCookie('name');
    if (userId && name && getCookie('sessionId') === sessionId) {
        socket.emit('joinSession', { sessionId, name, userId });
        socket.emit('getTitle', { sessionId });
        hideElement('join');
        showElement('mainContent');
        // showElement('bottom-bar', 'flex');
        // hideElement('average');
    } else {
        hideElement('mainContent');
    }
};
