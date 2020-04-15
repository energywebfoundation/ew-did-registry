import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Typography } from 'antd';
import './style.css';

const { Title } = Typography;



class Home extends Component {
  constructor() {
    super();
    this.state = {
      response: 'Empty'
    }
  }

  componentDidMount() {
    this.get('protected');
  }

  get = async (url) => {
    console.log('>>> Home.get: this:', this);
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/${url}`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${this.props.auth.token}`
      })
    });
    console.log('>>> response:', response);
    const body = await response.json();
    console.log('>>> body:', body);
    this.setState({ response: body.did });
  }

  render() {

    return (
      <div>
        <Title>Authenticated: {this.state.response}</Title>
      </div>
    )
  }

}

export default connect(({ auth }) => ({ auth }))(Home);
