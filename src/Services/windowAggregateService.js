import axios from 'axios'
import configURL from "../Configurations/configURL";

const {getDataURL, getGroupByDataURL} = configURL;

const getData = async () => {
    const response = await axios.get(getDataURL)
    return response.data
}
const getGroupByData = async (reqParams) => {
    const response = await axios.get(`${getGroupByDataURL}?queryId=${reqParams.queryId}`)
    return response.data
}
const exportObject = { getData, getGroupByData}

export default exportObject