import {Redirect} from 'react-router-dom';
import * as b from 'react-bootstrap';
import React from 'react';

export default function Home({accessToken, setAccessToken}) {
  const [data, setData] = React.useState();

  React.useEffect(() => {
    (async () => {
      if (accessToken) {
        const res = await fetch('/api/self', {
          headers: {Authorization: `Bearer ${accessToken}`},
        });
        if (res.ok) {
          setData(await res.json());
        }
      }
    })();
  }, []);

  return accessToken ? (
    <b.Container>
      <b.Row>
        <b.Col>
          <h1>Home</h1>
          {data ? (
            <>
              <p>Hello, {data.username}!</p>
              <p>Your email is {data.email}</p>
            </>
          ) : (
            <p>Loading...</p>
          )}
          <p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setAccessToken(null);
              }}
            >
              Sign out
            </a>
            .
          </p>
        </b.Col>
      </b.Row>
    </b.Container>
  ) : (
    <Redirect to="/login" />
  );
}
