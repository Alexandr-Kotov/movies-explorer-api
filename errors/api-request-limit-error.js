class API_REQUEST_LIMIT_ERRROR extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 429;
  }
}

module.exports = API_REQUEST_LIMIT_ERRROR;