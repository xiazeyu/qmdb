import React, { useContext, useState, useEffect } from 'react';
import {
  Form, Input, Button, Checkbox, Grid, Alert, Space, Message,
} from '@arco-design/web-react';

import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { DEMO, DEBUG } from '../context/DemoContext';
import { postLogin } from '../api/auth';

const { Row, Col } = Grid;

function Login() {
  const {
    accessToken, updateAccessToken, refreshToken, updateRefreshToken, tokenValid,
  } = useContext(AuthContext);
  const [alert, setAlert] = useState('');
  const [alertType, setAlertType] = useState('info');

  const navigate = useNavigate();
  const location = useLocation();
  let { from } = location.state || { from: '/' };
  if (from === '/auth/login' || !from) {
    from = '/';
  }
  const { locEmail, locPasswd } = location.state || { locPasswd: '', locPasswd: '' };

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
    setTimeout(() => navigate(from), 1000);
    return (
      <div className="Login">
        <h1>Login</h1>
        <Alert closable type="success" content="You are already logged in! Jumping to previous page ..." />
        <Button type="primary" onClick={() => { location.reload(); }}>Refresh</Button>
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
        initialValues={DEMO ? {
          email: DEBUG || !locEmail ? 'mike@gmail.com' : locEmail,
          password: DEBUG || !locEmail ? 'password' : locPasswd,
          longExpiry: false,
        } : {
          email: locEmail,
          password: locPasswd,
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
            <Button type="dashed" onClick={() => navigate('/auth/register', { state: from })}>Register</Button>
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
                  setAlert('Login successful. Jumping to previous page ...');
                  setAlertType('success');
                  updateAccessToken(data.bearerToken.token, data.bearerToken.expires_in);
                  updateRefreshToken(data.refreshToken.token, data.refreshToken.expires_in);
                  console.log(tokenValid);
                  setTimeout(() => navigate(from), 1000);
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
