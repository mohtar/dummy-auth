const makeApp = require('./app');
const mongodb = require('mongodb');

(async () => {
  const port = process.argv[2] || 8080;
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost';
  const db = await mongodb.MongoClient.connect(mongoUri);
  const app = await makeApp(db);
  app.listen(port);
})();
