function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function showElement(id, style) {
    const displayStyle = style ? style: 'block';
    document.getElementById(id).style.display = displayStyle;
}

function hideElement(id) {
    document.getElementById(id).style.display = 'none';
}

function getElementValue(id) {
    const element = document.getElementById(id);
    if(element) return element.value;
    return null;
}

function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    if (isError) {
        notification.classList.add('error');
    } else {
        notification.classList.remove('error');
    }
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
