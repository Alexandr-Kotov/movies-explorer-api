const { NODE_ENV, MONGO_DB } = process.env;

module.exports.mongodb = NODE_ENV === 'production' ? MONGO_DB : 'mongodb://localhost:27017/moviesdb';
