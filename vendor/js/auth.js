var sidebar = document.getElementById("sidebar-options");
window.addEventListener("load", checkAuth);

function checkAuth() {
    console.log("Checking login");
    if (localStorage.getItem("token") == null) {
        unAuthorizedUser();
    }
    else {
        authedicatedUser();
    }
}


function isAuthedicated() {
    if (localStorage.getItem("token") != null) {
        return true;
    }
    return false;
}

function isOwner(username) {
    console.log("username : " + username + "localStorage username : " + localStorage.getItem('username'));
    if(localStorage.getItem('username') === username) {
        console.log('gurnaw true');
        return true;
    }
    console.log('gurnaw false');
    return false;
}

function cleanStorage() {
    localStorage.removeItem("token");
    localStorage.removeItem("token");
}

function logout() {
    cleanStorage();
    checkAuth();
}
