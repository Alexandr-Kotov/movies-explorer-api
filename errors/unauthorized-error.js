class UNAUTHORIZED_ERRROR extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = UNAUTHORIZED_ERRROR;
