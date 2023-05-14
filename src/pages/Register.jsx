import React, { useContext, useState, useEffect } from 'react';
import {
  Form, Input, Button, Checkbox, Grid, Alert, Space, Message,
} from '@arco-design/web-react';

import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { DEMO } from '../context/DemoContext';
import { postRegister } from '../api/auth';

const { Row, Col } = Grid;

const random_email = `${Math.random().toString(36).substring(2, 10)}@${Math.random().toString(36).substring(2, 10)}.com`;
const random_passwd = Math.random().toString(36).substring(2, 10);

function Register() {
  const [alert, setAlert] = useState('');
  const [alertType, setAlertType] = useState('info');

  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: '/' };

  const [form] = Form.useForm();

  useEffect(() => {
    // Auto close alert
    const timer = setTimeout(() => {
      setAlert('');
    }, 10000);
    return () => clearTimeout(timer);
  }, [alert]);

  return (
    <div className="Register">
      <h1>Register</h1>
      {DEMO && (
      <small>
        Demo Email:
        {random_email}
        , Password:
        {random_passwd}
      </small>
      )}
      {alert && <Alert closable type={alertType} content={alert} />}
      <Form
        autoComplete="off"
        form={form}
        initialValues={DEMO ? {
          email: random_email,
          password: random_passwd,
          confirm_password: random_passwd,
        } : {
          email: '',
          password: '',
          confirm_password: '',
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
        <Form.Item
          label="Confirm Password"
          field="confirm_password"
          dependencies={['password']}
          wrapperCol={{ span: 12 }}
          style={{ justifyContent: 'center', marginLeft: '-50px' }}
          rules={[{
            validator: (v, cb) => {
              if (!v) {
                return cb('confirm_password is required');
              } if (form.getFieldValue('password') !== v) {
                return cb('confirm_password must be equal with password');
              }
              cb(null);
            },
          },
          {
            required: true,
            type: 'string',
            minLength: 3,
          },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item style={{ justifyContent: 'center' }}>
          <Space size={24}>
            <Button
              type="dashed"
              onClick={() => navigate('/auth/login', { state: from })}
            >
              Login
            </Button>
            <Button
              type="primary"
              onClick={
                async () => {
                  try {
                    await form.validate(['email', 'password', 'confirm_password']);
                  } catch (e) {
                    Message.error(`Input format validation failed. ${e.message}`);
                    return;
                  }
                  const fields = await form.getFieldsValue();
                  const { data, isError } = await postRegister(fields.email, fields.password);
                  if (isError || !data) {
                    setAlert(data);
                    setAlertType('error');
                    return;
                  }
                  setAlert('Register successful. Jumping to login page ...');
                  setAlertType('success');
                  setTimeout(() => navigate('/auth/login', { state: { from, locEmail: fields.email, locPasswd: fields.password } }), 1000);
                }
              }
            >
              Register
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Register;
