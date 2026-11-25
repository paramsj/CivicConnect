class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
        // Keep typo alias for backwards compatibility
        this.sucess = statusCode < 400;
    }
}

export { ApiResponse };
export default ApiResponse;
