// All the Service URL's are to be included here...
let ipAddress = 'localhost'
let portNumber = 8081;
const configURL = {
    loginURL: `http://${ipAddress}:${portNumber}/api/auth/authenticate`,
    getDataURL: `http://${ipAddress}:${portNumber}/get-data`,
    getQueriesURL: `http://${ipAddress}:${portNumber}/get-queries`,
    getLogsURL: `http://${ipAddress}:${portNumber}/get-logs`
};
export default configURL;