const { NODE_ENV, MONGO_DB, JWT_SECRET } = process.env;

module.exports.mongodb = NODE_ENV === 'production' ? MONGO_DB : 'mongodb://localhost:27017/moviesdb';
module.exports.devSecret = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
