import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from "../App";
import {
  SignIn,
  SignUp,
  NotFound,
} from "../pages";
import { Home } from '../components';

import PrivateRouter from './PrivateRoute';

export default () => (
  <Router>
    <App>
      <Switch>
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <PrivateRouter path="/" component={Home} redirect="/signin" />
        <Route component={NotFound} />
      </Switch>
    </App>
  </Router>
)