import { toast } from 'react-toastify';

var NotificationManager = new (function() {
    
    this.alert = function (message) {
        toast(message);
    };

    this.error = function (message) {
        toast.error(message);
    };

  });

export default NotificationManager;