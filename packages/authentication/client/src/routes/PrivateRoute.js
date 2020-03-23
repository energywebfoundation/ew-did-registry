import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({ component: Component, ...rest }) => <Route
  {...rest}
  render={props => (
    rest.auth.isLoggedIn ? (
      <Component {...props} />
    ) : (
        <Redirect
          to={{
            pathname: rest.redirect,
            state: { from: props.location }
          }}
        />
      ))
  } />

//----------------------------------------------------------------------------------------------------------------------

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};
//----------------------------------------------------------------------------------------------------------------------

const mapStateToProps = ({ auth }) => ({ auth });

//----------------------------------------------------------------------------------------------------------------------

export default withRouter(connect(mapStateToProps)(PrivateRoute));