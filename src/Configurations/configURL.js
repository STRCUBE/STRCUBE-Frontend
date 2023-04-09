// All the Service URL's are to be included here...
let ipAddress = 'localhost'
let portNumber = 8081;
const configURL = {
    loginURL: `http://${ipAddress}:${portNumber}/api/auth/authenticate`,
    getDataURL: `http://${ipAddress}:${portNumber}/get-data`,
    getGroupByDataURL: `http://${ipAddress}:${portNumber}/get-group-by-data`
};
export default configURL;