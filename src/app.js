import * as accounts from './accounts.js';
import bodyParser from 'body-parser';
import express from 'express';
import jwt from 'jsonwebtoken';

const secret = 'ZfPTimQus63SMaJurRJN3NShSLhMGwOdGRMnyIWjmIhluAOcrx';

function timestamp() {
  return Math.floor(Date.now() / 1000);
}

function accessToken(userId) {
  const expiresIn = 24 * 60 * 60;
  const now = timestamp();
  const claims = {
    id: userId,
    iat: now,
    exp: now + expiresIn,
  };
  return {
    accessToken: jwt.sign(claims, secret),
    expiresIn,
  };
}

function getToken(req) {
  const {authorization} = req.headers;
  if (authorization) {
    const words = authorization.split(' ');
    if (words.length == 2 && words[0] == 'Bearer') {
      const token = words[1];
      return token;
    }
  }
}

export default async function makeApp(db) {
  const app = express();

  app.use(bodyParser.urlencoded({extended: false}));

  app.post('/api/login', async (req, res) => {
    const {usernameOrEmail, password} = req.body;
    const userId = await accounts.authenticate(db, usernameOrEmail, password);
    if (userId) {
      res.json(accessToken(userId));
    } else {
      res.status(400).json({error: 'invalid_grant'});
    }
  });

  app.post('/api/signup', async (req, res) => {
    const {username, email, password} = req.body;
    const userId = await accounts.register(db, username, email, password);
    res.json(accessToken(userId));
  });

  app.get('/api/self', async (req, res) => {
    const token = getToken(req);
    if (token) {
      const {id} = jwt.verify(token, secret);
      const user = await accounts.byId(db, id);
      res.status(200).json({id, username: user.username, email: user.email});
    } else {
      res.status(401).send('');
    }
  });

  app.get('/*', (req, res) => {});

  return app;
}
