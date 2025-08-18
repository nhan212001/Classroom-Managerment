import axios from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_BE_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

export const callApi = async ({
    method = 'GET',
    url,
    data,
    params,
    token,
    useToken = true
}) => {
    try {
        const headers = useToken ? {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`
        } : {};
        const response = await axiosClient.request({
            method,
            url,
            data,
            params,
            headers
        });
        return response.data;
    } catch (error) {
        console.error("Error calling API:", error);
        throw error;
    }
};