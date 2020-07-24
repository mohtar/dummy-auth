import makeApp from './app.js';
import mongodb from 'mongodb';

(async () => {
  const port = 8080;
  const conn = await mongodb.MongoClient.connect(process.env.MONGO_URI);
  const db = await conn.db();
  const app = await makeApp(db);
  app.listen(port);
})();
