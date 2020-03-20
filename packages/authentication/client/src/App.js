import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import './App.css';

const { Header, Content, Sider } = Layout;

const App = ({ children, auth, location }) => {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" >
          <h1>Authentication Example</h1>
        </div>

      </Header>
      {
        (!auth.isLogedIn
          || location.pathname === "/signin"
          || location.pathname === "/signup") ?
          <Content>{children}</Content>
          :
          <Layout>
            <Sider width={200} style={{ background: '#fff' }} theme={"dark"}>
            </Sider>
            <Content >{children}</Content>
          </Layout>
      }
    </Layout>
  );
}

const mapStateToProps = (({ auth }) => ({ auth }));
export default withRouter(connect(mapStateToProps)(App));
