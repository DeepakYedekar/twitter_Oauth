function response_handler(status_code,data,message="Internal Server Error") {
    try {
        return JSON.stringify({ status_code, data, message });
    } catch (error) {
        throw new Error(error.message);
    }
}

export default response_handler;