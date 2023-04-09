// All the Service URL's are to be included here...
let ipAddress = 'localhost'
let portNumber = 8081;
const configURL = {
    loginURL: `http://${ipAddress}:${portNumber}/api/auth/authenticate`,
    getDataURL: `http://0c63-119-161-98-68.ngrok-free.app/get-data`,
    getGroupByDataURL: `http://${ipAddress}:${portNumber}/get-group-by-data`
};
export default configURL;