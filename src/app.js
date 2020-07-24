const accounts = require('./accounts');
const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');

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

async function makeApp(db) {
  const app = express();

  app.use('/static', express.static('static'));

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
    if (userId) {
      res.json(accessToken(userId));
    } else {
      res.status(400).json({error: 'user_already_registered'});
    }
  });

  app.get('/api/self', async (req, res) => {
    const token = getToken(req);
    const unauthorized = {
      error: 'unauthorized_client',
      errorDescription: 'Authorization code is invalid or expired.',
    };
    if (token) {
      let claims;
      try {
        claims = jwt.verify(token, secret);
      } catch (e) {
        res.status(401).send(unauthorized);
        return;
      }
      const {id} = claims;
      const user = await accounts.byId(db, id);
      res.status(200).json({id, username: user.username, email: user.email});
    } else {
      res.status(401).send(unauthorized);
    }
  });

  app.get('/*', (req, res) => {
    res.send(
      '<!doctype html><html><body><div id="main"></div><script src="/static/js/main.js"></script></body></html>',
    );
  });

  return app;
}

module.exports = makeApp;
