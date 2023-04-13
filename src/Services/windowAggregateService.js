import axios from 'axios'
import configURL from "../Configurations/configURL";

const {getDataURL, getQueriesURL, getLogsURL} = configURL;

const getQueries = async () => {
    const response = await axios.get(getQueriesURL)
    return response.data
}
const getData = async (reqParams) => {
    const response = await axios.get(`${getDataURL}?queryId=${reqParams.queryId}`)
    return response.data
}
const getLogs = async (reqParams) => {
    const response = await axios.get(`${getLogsURL}?queryId=${reqParams.queryId}`)
    return response.data
}
const exportObject = { getData, getQueries, getLogs}

export default exportObject