import React, { Component } from 'react';
import { Typography } from 'antd';
import './style.css';

const { Title } = Typography;

class Home extends Component {

  render() {
    return (
      <div>
        <Title>Home component</Title>
      </div>
    )
  }

}

export default Home;
