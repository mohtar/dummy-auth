const {nanoid} = require('nanoid');
const {promisify} = require('util');
const assert = require('assert');
const crypto = require('crypto');

const digest = 'sha256';
const keylen = 32;

async function authenticate(db, usernameOrEmail, password) {
  const row = await db
    .db()
    .collection('users')
    .findOne({
      $or: [{username: usernameOrEmail}, {email: usernameOrEmail}],
    });
  if (row && (await checkPassword(password, row.hashedPassword))) {
    return row.id;
  } else {
    return null;
  }
}

async function register(db, username, email, password) {
  const row = await db
    .db()
    .collection('users')
    .findOne({
      $or: [{username}, {email}],
    });
  if (row) {
    return null;
  } else {
    const id = nanoid(10);
    const hashedPassword = await makePassword(password);
    await db
      .db()
      .collection('users')
      .insertOne({id, username, email, hashedPassword});
    return id;
  }
}

async function byId(db, id) {
  const row = await db.db().collection('users').findOne({id});
  return row;
}

async function makePassword(password) {
  const algorithm = 'pbkdf2';
  const iterations = 120000;
  const salt = await promisify(crypto.randomBytes)(16);
  const hash = await promisify(crypto.pbkdf2)(
    password,
    salt,
    iterations,
    keylen,
    digest,
  );
  return [
    algorithm,
    iterations,
    salt.toString('base64'),
    hash.toString('base64'),
  ].join('$');
}

async function checkPassword(password, encoded) {
  const [algorithm, iterations, salt, hash] = encoded.split('$');
  assert(algorithm == 'pbkdf2');
  const hash2 = await promisify(crypto.pbkdf2)(
    password,
    Buffer.from(salt, 'base64'),
    parseInt(iterations, 10),
    keylen,
    digest,
  );
  return Buffer.from(hash, 'base64').equals(hash2);
}

module.exports = {authenticate, register, byId, makePassword, checkPassword};
