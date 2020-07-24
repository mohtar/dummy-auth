import {Link, Redirect} from 'react-router-dom';
import * as b from 'react-bootstrap';
import React from 'react';

export default function Login({setAccessToken}) {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [failure, setFailure] = React.useState(false);

  async function submit() {
    const body = new URLSearchParams();
    body.append('username', username);
    body.append('email', email);
    body.append('password', password);
    const res = await fetch('/api/signup', {method: 'POST', body});
    if (res.ok) {
      const {accessToken} = await res.json();
      setAccessToken(accessToken);
      setSuccess(true);
    } else {
      setFailure(true);
    }
  }

  return success ? (
    <Redirect to="/" />
  ) : (
    <b.Container>
      <b.Row>
        <b.Col>
          <h1>Sign up</h1>
          {failure && <b.Alert variant="danger">Failed.</b.Alert>}
          <b.Form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <b.Form.Group>
              <b.Form.Control
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </b.Form.Group>
            <b.Form.Group>
              <b.Form.Control
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </b.Form.Group>
            <b.Form.Group>
              <b.Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </b.Form.Group>
            <b.Button
              variant="primary"
              type="submit"
              disabled={!username || !email.match(/@/) || !password}
            >
              Sign up
            </b.Button>
          </b.Form>
          <p>
            Already have an account? <Link to="/login">Log in</Link>.
          </p>
        </b.Col>
      </b.Row>
    </b.Container>
  );
}
