import {Link, Redirect} from 'react-router-dom';
import * as b from 'react-bootstrap';
import React from 'react';

export default function Login({setAccessToken}) {
  const [usernameOrEmail, setUsernameOrEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [unauthorized, setUnauthorized] = React.useState(false);
  const [authorized, setAuthorized] = React.useState(false);

  async function submit() {
    const body = new URLSearchParams();
    body.append('usernameOrEmail', usernameOrEmail);
    body.append('password', password);
    const res = await fetch('/api/login', {method: 'POST', body});
    if (res.ok) {
      const {accessToken} = await res.json();
      setAccessToken(accessToken);
      setAuthorized(true);
    } else {
      setUnauthorized(true);
    }
  }

  return authorized ? (
    <Redirect to="/" />
  ) : (
    <b.Container>
      <b.Row>
        <b.Col>
          <h1>Log in</h1>
          {unauthorized && (
            <b.Alert variant="danger">
              Wrong username/email or password.
            </b.Alert>
          )}
          <b.Form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <b.Form.Group controlId="formBasicEmail">
              <b.Form.Control
                placeholder="Username or email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
              />
            </b.Form.Group>
            <b.Form.Group controlId="formBasicPassword">
              <b.Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </b.Form.Group>
            <b.Button variant="primary" type="submit">
              Log in
            </b.Button>
          </b.Form>
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>.
          </p>
        </b.Col>
      </b.Row>
    </b.Container>
  );
}
