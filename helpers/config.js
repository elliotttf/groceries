module.exports = {
  db: {
    host: process.env.MONGO_HOST || '127.0.0.1',
    port: process.env.MONGO_PORT || '27017',
    username: process.env.MONGO_USER || '',
    password: process.env.MONGO_PASS || '',
    db: process.env.MONGO_DB || 'list',
    collection: process.env.MONGO_COLLECTION || 'lists'
  }
};

