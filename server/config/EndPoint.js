export const getEndpoints = (mode) => {
    const prodEndPoints = {
        APP_SERVER_URL: "https://zdeserver-dabrhgf0e2cghzej.canadacentral-01.azurewebsites.net",
        WEB_SERVER_HOST: "https://zohodataexplorer.com",
        WEB_SERVER_PORT: "443",
    }

    const devEndPoints = {
        APP_SERVER_PORT: "5000",
        APP_SERVER_URL: "http://localhost",
        WEB_SERVER_HOST: "localhost",
        WEB_SERVER_PORT: "5173",
    }

    if (mode === 'development') {
        return devEndPoints;
    } else {
        return prodEndPoints;
    }   
}
