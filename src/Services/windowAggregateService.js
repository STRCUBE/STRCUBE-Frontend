import axios from 'axios'
import configURL from "../Configurations/configURL";

const {getDataURL, getQueriesURL, getLogsURL, getSomethingURL, getAllURL, getSomethingLogsURL} = configURL;

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
const getAll = async () => {
    const response = await axios.get(`${getAllURL}`)
    return response.data
}
const getSomething = async (reqBody) => {
    const response = await axios.post(getSomethingURL, reqBody)
    return response.data
}
const getSomethingLogs = async (reqBody) => {
    const response = await axios.post(getSomethingLogsURL, reqBody)
    return response.data
}
const exportObject = { getData, getQueries, getLogs, getSomething, getAll, getSomethingLogs}

export default exportObject