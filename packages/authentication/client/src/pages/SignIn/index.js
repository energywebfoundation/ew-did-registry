import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Form, Input, Button, Checkbox } from 'antd';
import { login } from '../../state-management';
import { Networks } from 'ew-did-registry/packages/did';
import { identityKeys, sendLoginClaim } from '../../utils/did';
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

class SignIn extends React.Component {

  onFinish = async (values) => {
    console.log('>>> form values:', values);
    const { DID, privateKey } = values;
    const isAuthenticated = await sendLoginClaim(DID, privateKey);
    if (!isAuthenticated) {
      return;
    }
    this.props.login(DID);
    console.log('>>> SignIn props:', this.props);
    this.props.history.push('/');
  }

  onFinishFailed = () => { }

  render() {
    const DID = `did:${Networks.EnergyWeb}:${identityKeys.getAddress()}`;
    const privateKey = identityKeys.privateKey;
    return (
      <div style={{ width: '50%' }}>
        <Form
          {...layout}
          name="basic"
          initialValues={{
            DID,
            privateKey,
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

          <Form.Item {...tailLayout} name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
        </Button>
          </Form.Item>
        </Form>
      </div >
    );
  };
}

const mapActionToProps = { login };
export default connect(({ auth }) => ({ auth }), mapActionToProps)(
  withRouter(SignIn)
);