import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import React from 'react';
import Signup from './Signup';

export default function App() {
  const [accessToken, setAccessToken] = React.useState();
  const commonProps = {accessToken, setAccessToken};

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login">
          <Login {...commonProps} />
        </Route>
        <Route path="/signup">
          <Signup {...commonProps} />
        </Route>
        <Route path="/">
          <Home {...commonProps} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
