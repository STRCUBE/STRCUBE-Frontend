// import axios from "axios";
// import configURL from "../Configurations/configURL";

// const {loginURL} = configURL;

const login = async (loginCredentials) => {
    // const response = await axios.post(loginURL, loginCredentials)
    // console.log(response)
    // window.localStorage.setItem('BearerToken', JSON.stringify(response.data.token))
    // return response.data.patient
    if (loginCredentials.userName === "venkatesh" && loginCredentials.password === "KVrsmck@21")
        return { firstName: "Venkatesh", lastName: "Boppana", userId: "1" };
    else
        return null;
}
const exportObject = { login }
export default exportObject