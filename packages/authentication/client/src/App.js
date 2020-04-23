import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { Layout, Row, Col, Button } from 'antd';
import { logout } from './state-management/actions/auth';
import 'antd/dist/antd.css';
import './App.css';

const { Header, Content } = Layout;

const App = ({ children, auth, location, logout }) => {
  return (
    <Layout className="layout">
      <Header>
        <Row className="logo">
          <Col span={4}>
            Auth example
          </Col>
          {
            auth.isLoggedIn && (
              <>
                <Col offset={18} span={2} className="flex-end">
                  <Button ghost onClick={logout}>Logout</Button>
                </Col>
              </>
            )
          }
        </Row>
      </Header>
      {
        (!auth.isLogedIn
          || location.pathname === "/signin"
          || location.pathname === "/signup") ?
          <Content className="content" style={{ height: '400px' }}>{children}</Content>
          :
          <Layout>
            <Content>{children}</Content>
          </Layout>
      }
    </Layout >
  );
}

const mapStateToProps = (({ auth }) => ({ auth }));
export default withRouter(connect(mapStateToProps, ({ logout: logout }))(App));
