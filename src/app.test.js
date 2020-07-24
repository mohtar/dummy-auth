const makeApp = require('./app');
const mongodb = require('mongodb');
const mongodbMemoryServer = require('mongodb-memory-server');
const querystring = require('querystring');
const request = require('supertest');

let mongod = null;
let db = null;
let app = null;

beforeAll(async (done) => {
  mongod = new mongodbMemoryServer.MongoMemoryServer();
  db = await mongodb.MongoClient.connect(await mongod.getUri());
  app = await makeApp(db);
  done();
});

afterAll(async (done) => {
  await db.close();
  await mongod.stop();
  done();
});

afterEach(async (done) => {
  await db.db().dropDatabase();
  done();
});

test('sign up', async () => {
  const username = 'foo';
  const email = 'foo@example.com';
  const password = 'bar';

  let res;

  res = await request(app)
    .post('/api/signup')
    .send(querystring.stringify({username, email, password}))
    .expect(200);
  expect(res.body.accessToken).toBeDefined();
  expect(res.body.expiresIn).toBeDefined();

  res = await request(app)
    .get('/api/self')
    .set('Authorization', `Bearer ${res.body.accessToken}`)
    .expect(200);
  expect(res.body.id).toBeDefined();
  expect(res.body.username).toEqual(username);
  expect(res.body.email).toEqual(email);
});

test('sign up existing user', async () => {
  const username = 'foo';
  const email = 'foo@example.com';
  const password = 'bar';

  await request(app)
    .post('/api/signup')
    .send(querystring.stringify({username, email, password}))
    .expect(200);

  await request(app)
    .post('/api/signup')
    .send(querystring.stringify({username, email, password}))
    .expect(400);
});

test('log in', async () => {
  const username = 'foo';
  const email = 'foo@example.com';
  const password = 'bar';

  await request(app)
    .post('/api/signup')
    .send(querystring.stringify({username, email, password}))
    .expect(200);

  let res;

  // Log in with username
  res = await request(app)
    .post('/api/login')
    .send(querystring.stringify({usernameOrEmail: username, password}))
    .expect(200);
  expect(res.body.accessToken).toBeDefined();
  expect(res.body.expiresIn).toBeDefined();

  // Log in with email
  res = await request(app)
    .post('/api/login')
    .send(querystring.stringify({usernameOrEmail: email, password}))
    .expect(200);
  expect(res.body.accessToken).toBeDefined();
  expect(res.body.expiresIn).toBeDefined();
});

test('access protected page', async () => {
  await request(app).get('/api/self').expect(401);
});

test('unsuccessful log in', async () => {
  await request(app)
    .post('/api/login')
    .send(querystring.stringify({usernameOrEmail: 'fake', password: 'fake'}))
    .expect(400);
});

test('frontend', async () => {
  await request(app).get('/').expect(200);
});
