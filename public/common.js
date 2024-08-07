const cookieNames = ["name", "owner", "sessionId", "useId"];
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function showElement(id, style) {
    const displayStyle = style ? style: 'block';
    document.getElementById(id).style.display = displayStyle;
}

function hideElement(id, important) {
    const hide = important ? 'none!important' : 'none'
    document.getElementById(id).style.display = hide;
}

function getElementValue(id) {
    const element = document.getElementById(id);
    if(element) return element.value;
    return null;
}

function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    
    //notification.classList.remove('hide');
    if (isError) {
        notification.classList.add('alert-warning');
    } else {
        notification.classList.add('alert-info');
    }
    notification.classList.add('nshow');
    setTimeout(() => {
        const notification = document.getElementById('notification');
        notification.classList.remove('nshow');
        notification.classList.add('hide');
    }, 300000);
}

function clearCookie() {
  cookieNames.forEach(name => {
        document.cookie = name + '=; Max-Age=-99999999;';
    });
}
