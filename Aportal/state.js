// state.js
let globalEmail = null;

function setGlobalEmail(email) {
    globalEmail = email;
}

function getGlobalEmail() {
    return globalEmail;
}

module.exports = {
    setGlobalEmail,
    getGlobalEmail
};
