import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Typography, Alert, message } from 'antd';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';

const { Title } = Typography;

function RegisterTeacher() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    const { email, password, fullName } = values;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Criar um documento para o professor
      await setDoc(doc(db, 'professores', user.uid), {
        fullName,
        email: user.email,
        role: 'teacher',
        createdAt: new Date(),
      });

      message.success('Conta de professor criada com sucesso!');
      navigate('/');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <Col xs={24} sm={16} md={12} lg={8} xl={6}>
        <Title level={2} style={{ textAlign: 'center' }}>Registrar como Professor</Title>
        {error && <Alert message={error} type="error" showIcon />}
        <Form
          name="registerTeacher"
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            label="Nome Completo"
            name="fullName"
            rules={[{ required: true, message: 'Escreva seu nome completo' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Escreva seu melhor email!' }]}
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: 'Escreva uma boa senha!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirme sua Senha"
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Agora confirme sua senha!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Senhas não conferem!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Criar Conta
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Button type="link" onClick={() => navigate('/login')}>
            Já tem uma conta? Faça Login!
          </Button>
        </div>
      </Col>
    </Row>
  );
}

export default RegisterTeacher;
