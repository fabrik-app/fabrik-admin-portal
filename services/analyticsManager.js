import DataManager from './dataManager';

function AnalyticsManager() {

    var self = this;

    self.baseUrl = "https://g.fabrik.in/api/analytics/";
    self.source = "Fabrik Web";
    self.dataManager = new DataManager();

    self.getUrlParams = function (url) {
        var params = {};
        (url + '?').split('?')[1].split('&').forEach(function (pair) {
            pair = (pair + '=').split('=').map(decodeURIComponent);
            if (pair[0].length) {
                params[pair[0]] = pair[1];
            }
        });
        return params;
    };

    self.getUserId = function () {
        if (document.getElementById("uId")) {
            var uId = document.getElementById('uId').value;
            if (uId) {
                return uId;
            }
            else {
                return "";
            }
        }
        else {
            return "";
        }
    }

    self.recordStoreView = function (slug) {

        var formData = {
            'path': slug,
            'source': self.source,
            'uId': self.getUserId()
        };

        var recordActivityResult = self.dataManager.postData(self.baseUrl + "views/store/" + slug, formData);

        recordActivityResult.then(function (data) {
            console.log("Store view success");
        });
    }

    self.recordDesignerView = function (slug) {

        var formData = {
            'path': slug,
            'source': self.source,
            'uId': self.getUserId()
        };

        var recordActivityResult = self.dataManager.postData(self.baseUrl + "views/designer/" + slug, formData);

        recordActivityResult.then(function (data) {
            console.log("Designer view success");
        });
    }

    self.recordSearch = function (query) {

        var formData = {
            'query': query,
            'source': self.source,
            'uId': self.getUserId()
        };

        var recordActivityResult = self.dataManager.postData(self.baseUrl + "search/log", formData);

        recordActivityResult.then(function (data) {
            console.log("Search log success");
        });
    }
}

export default AnalyticsManager;