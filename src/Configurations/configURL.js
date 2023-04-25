// All the Service URL's are to be included here...
let ipAddress = 'localhost'
let portNumber = 8081;
const configURL = {
    loginURL: `http://${ipAddress}:${portNumber}/api/auth/authenticate`,
    getDataURL: `http://${ipAddress}:${portNumber}/get-data`,
    getQueriesURL: `http://${ipAddress}:${portNumber}/get-queries`,
    getLogsURL: `http://${ipAddress}:${portNumber}/get-logs`,
    getSomethingURL: `http://${ipAddress}:${portNumber}/get-something`,
    getSomethingLogsURL: `http://${ipAddress}:${portNumber}/get-something-logs`,
    getAllURL: `http://${ipAddress}:${portNumber}/get-all`
};
export default configURL;