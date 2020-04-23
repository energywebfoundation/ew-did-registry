import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { login } from '../../state-management';
import { Methods } from '@ew-did-registry/did';
import { defaultKeys, sendAuthClaim } from '../../utils/did';
import './style.css';

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 24,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 16,
  },
};

class SignIn extends React.Component {

  onSubmit = async (values) => {
    console.log('>>> form values:', values);
    const { DID, privateKey } = values;
    const { authenticated, token } = await sendAuthClaim(DID, privateKey);
    if (!authenticated) {
      return;
    }
    this.props.login({ DID, token });
    console.log('>>> SignIn props:', this.props);
    this.props.history.push('/');
  }

  onFinishFailed = () => { }

  render() {
    const DID = `did:${Methods.Erc1056}:${defaultKeys.getAddress()}`;
    const privateKey = defaultKeys.privateKey;
    return (
      <Form
        style={{ width: '650px' }}
        {...layout}
        name="basic"
        initialValues={{
          DID,
          privateKey,
          remember: true,
        }}
        onFinish={this.onSubmit}
        onFinishFailed={this.onFinishFailed}
      >
        <Form.Item
          label="DID"
          name="DID"
          rules={[
            {
              required: true,
              message: 'DID is required!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Private key"
          name="privateKey"
          rules={[
            {
              required: true,
              message: 'Private key is required!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item> */}

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
  withRouter(SignIn)
);