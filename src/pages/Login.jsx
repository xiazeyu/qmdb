import React, { useContext, useState, useEffect } from 'react';
import {
  Form, Input, Button, Checkbox, Grid, Alert, Space, Message,
} from '@arco-design/web-react';

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { postLogin } from '../api/auth';

const { Row, Col } = Grid;

function Login() {
  const {
    accessToken, updateAccessToken, refreshToken, updateRefreshToken, tokenValid,
  } = useContext(AuthContext);
  const [alert, setAlert] = useState('');
  const [alertType, setAlertType] = useState('info');

  const handleUpdateToken = () => {
    const newToken = 'your-new-access-token';
    updateAccessToken(newToken);
  };
  const [form] = Form.useForm();

  useEffect(() => {
    // Auto close alert
    const timer = setTimeout(() => {
      setAlert('');
    }, 10000);
    return () => clearTimeout(timer);
  }, [alert]);

  if (tokenValid) {
    return (
      <div className="Login">
        <h1>Login</h1>
        <Alert closable type="success" content="You are already logged in!" />
        <Button type="primary" onClick={() => { location.reload(); }}>Refresh</Button>
        <Button type="secondary" onClick={() => { }}>Log out</Button>
      </div>
    );
  }

  return (
    <div className="Login">
      <h1>Login</h1>
      {alert && <Alert closable type={alertType} content={alert} />}
      <Form
        autoComplete="off"
        form={form}
        initialValues={{
          email: 'mike@gmail.com',
          password: 'password',
          longExpiry: false,
        }}
        scrollToFirstError
      >
        <Form.Item
          field="email"
          label="Email"
          wrapperCol={{ span: 12 }}
          style={{ justifyContent: 'center', marginLeft: '-50px' }}
          rules={[
            {
              type: 'email',
              validateLevel: 'warning',
            },
            {
              required: true,
              type: 'string',
              minLength: 3,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          field="password"
          wrapperCol={{ span: 12 }}
          style={{ justifyContent: 'center', marginLeft: '-50px' }}
          rules={[
            {
              required: true,
              type: 'string',
              min: 0,
              max: 99,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item field="longExpiry" triggerPropName="checked" wrapperCol={{ span: 24 }}>
          <Checkbox>Long Expiry</Checkbox>
        </Form.Item>
        <Form.Item style={{ justifyContent: 'center' }}>
          <Space size={24}>
            <Button type="dashed">Register</Button>
            <Button
              type="primary"
              onClick={
          async () => {
            try {
              await form.validate(['email', 'password']);
            } catch (e) {
              Message.error(`Input format validation failed. ${e.message}`);
              return;
            }
            const fields = await form.getFieldsValue();
            const { data, isError } = await postLogin(fields.email, fields.password, fields.longExpiry);
            if (isError || !data) {
              setAlert(data);
              setAlertType('error');
              return;
            }
            setAlert('Login successful');
            setAlertType('success');
            updateAccessToken(data.bearerToken.token, data.bearerToken.expires_in);
            updateRefreshToken(data.refreshToken.token, data.refreshToken.expires_in);
          }
}
            >
              Login
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
