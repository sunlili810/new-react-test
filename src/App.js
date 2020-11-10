import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import login from 'pages/login/login';
import charing from 'pages/charing/index';
import authcfg from 'pages/authcfg/index';

const charingRout = `${window.routername}/charing`;
const authcfgRout = `${window.routername}/authcfg`;
class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={charing} />
            <Route exact path={window.routername} component={login} />
            <Route exact path={charingRout} component={charing} />
            <Route exact path={authcfgRout} component={authcfg} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
