const prodConfig = {
    env: 'production',
    apiBaseUrl: 'https://g.fabrik.in/api/admin/v1/',
    robotsApiBaseUrl: 'https://g.fabrik.in/api/robots/v1/',
    fileRootUrl: "https://img.fabrik.in",
    imageFolder: "images",
    botBaseUrl: "http://fabrikrobotsapi.azurewebsites.net/api/",
    appName: 'Fabrik Admin',
    supportEmail: 'support@fabrik.in',
    supportPhone: '+91 9447647640',
    authConfig: {
        authority: "https://accounts.fabrik.in",
        client_id: "admin-portal",
        redirect_uri: "https://manage.fabrik.in/account/callback",
        response_type: "code",
        scope: "openid profile admin-api",
        post_logout_redirect_uri: "https://manage.fabrik.in"
    }
}

const devConfig = {
    env: 'development',
    apiBaseUrl: 'http://localhost:58486/api/v1/',
    robotsApiBaseUrl: 'http://localhost:63258/api/v1/',
    fileRootUrl: "https://img.fabrik.in",
    imageFolder: "images",
    botBaseUrl: "http://fabrikrobotsapi.azurewebsites.net/api/",
    appName: 'Fabrik Admin',
    supportEmail: 'support@fabrik.in',
    supportPhone: '+91 9447647640',
    authConfig: {
        authority: "https://localhost:44392",
        client_id: "admin-portal",
        redirect_uri: "http://localhost:3000/account/callback",
        response_type: "code",
        scope: "openid profile admin-api",
        post_logout_redirect_uri: "http://localhost:3000"
    }
}

const config = process.env.NODE_ENV == 'production' ? prodConfig : devConfig;
export { config };