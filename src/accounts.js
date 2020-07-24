import {promisify} from 'util';
import * as crypto from 'crypto';
import nanoid from 'nanoid';

const digest = 'sha256';
const keylen = 32;

export async function authenticate(db, usernameOrEmail, password) {
  const row = await db
    .db()
    .collection('users')
    .findOne({
      $or: [{username: usernameOrEmail}, {email: usernameOrEmail}],
    });
  if (row && checkPassword(password, row.hashedPassword)) {
    return row.id;
  } else {
    return null;
  }
}

export async function register(db, username, email, password) {
  const row = await db
    .db()
    .collection('users')
    .findOne({
      $or: [{username}, {email}],
    });
  if (row) {
    return row.id;
  } else {
    const id = nanoid.nanoid(10);
    const hashedPassword = await makePassword(password);
    await db
      .db()
      .collection('users')
      .insertOne({id, username, email, hashedPassword});
    return id;
  }
}

export async function byId(db, id) {
  const row = await db.db().collection('users').findOne({id});
  return row;
}

export async function makePassword(password) {
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

export async function checkPassword(password, encoded) {
  const [algorithm, iterations, salt, hash] = encoded.split('$');
  if (algorithm != 'pbkdf2') {
    return false;
  }
  const hash2 = await promisify(crypto.pbkdf2)(
    password,
    Buffer.from(salt, 'base64'),
    parseInt(iterations, 10),
    keylen,
    digest,
  );
  return Buffer.from(hash, 'base64').equals(hash2);
}
