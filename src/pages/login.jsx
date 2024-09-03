// src/pages/Login.js
import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Typography, Alert } from 'antd';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';

const { Title } = Typography;

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    const { email, password } = values;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <Col xs={24} sm={16} md={12} lg={8} xl={6}>
        <Title level={2} style={{ textAlign: 'center' }}>Fazer Login</Title>
        {error && <Alert message={error} type="error" showIcon />}
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter your email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Entrar
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Link to="/register">Não tem uma conta ainda? Crie uma!</Link>
        </div>
      </Col>
    </Row>
  );
}

export default Login;
