import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Form, Input, Button, Checkbox } from 'antd';
import { login } from '../../state-management'
import './style.css';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

class SignUp extends React.Component {

  onFinish = async (values) => {
    console.log('>>> form values:', values);
  }

  onFinishFailed = () => { }

  render() {
    return (
      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={this.onFinish}
        onFinishFailed={this.onFinishFailed}
      >
        <Form.Item
          label="DID"
          name="DID"
          rules={[
            {
              required: true,
              message: 'Please input your DID!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
        </Button>
        </Form.Item>
      </Form>
    );
  };
}

const mapActionToProps = { login };
export default connect(({ auth }) => ({ auth }), mapActionToProps)(
  withRouter(SignUp)
);