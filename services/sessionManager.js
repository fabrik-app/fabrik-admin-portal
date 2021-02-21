function SessionManager() {
    var self = this;

    self.createRandomId = function () {
        return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
    };

    self.getPortalUserSessionId = function () {
        if (window.sessionStorage) {
            if (sessionStorage.sessionId) {
                return sessionStorage.sessionId;
            }
            else {
                var randomId = self.createRandomId();
                sessionStorage.sessionId = randomId;
                return sessionStorage.sessionId;
            }
        } else {
            return self.createRandomId();
        }
    };

    self.getFingerPrint = function() {
        if (window.localStorage) {
            if (localStorage.fabrikfp) {
                return localStorage.fabrikfp;
            } else {
                var fp = self.createRandomId();
                localStorage.fabrikfp = fp;
                return fp;
            }
        }
    }
}

export default SessionManager;