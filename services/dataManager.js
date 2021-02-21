import SessionManager from './sessionManager';

function DataManager() {

    var self = this;

    self.baseUrl = '';
    self.sessionManager = new SessionManager();

    self.ErrorMessage = "Oops.. something has gone wrong. Please refresh and try again";

    self.postData = function (url, data) {
        var fs = self.sessionManager.getFingerPrint() + ":" + self.sessionManager.getPortalUserSessionId();
        return fetch(url, {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'fs': fs
            },
            body: JSON.stringify(data)
        });
    };
};

export default DataManager;