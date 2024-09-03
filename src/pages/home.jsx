import React, { useEffect, useState } from 'react';
import { Layout, Card, Row, Col, Typography, Button, message, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';

const { Header, Content } = Layout;
const { Title } = Typography;

// Função para gerar uma cor de fundo aleatória
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Home = () => {
  const [classrooms, setClassrooms] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      message.success('Você saiu com sucesso!');
      navigate('/login');
    } catch (error) {
      message.error('Erro ao sair: ' + error.message);
    }
  };

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'professores', user.uid));
          if (userDoc.exists()) {
            const classroomsCollection = collection(db, `professores/${user.uid}/salas`);
            const classroomsSnapshot = await getDocs(classroomsCollection);
            const classroomsList = classroomsSnapshot.docs.map(doc => ({
              id: doc.id,
              name: doc.data().name,
            }));
            setClassrooms(classroomsList);
          } else {
            message.error('Usuário não encontrado ou não é um professor.');
          }
        }
      } catch (error) {
        message.error('Erro ao carregar salas: ' + error.message);
      }
    };

    fetchClassrooms();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/sala/${id}`); // Redireciona para a página da sala específica
  };

  const handleManageClassroomsClick = () => {
    navigate('/manage-classrooms'); // Redireciona para a página de gerenciamento de salas
  };

  return (
    <Layout style={{ height: '100vh', padding: '50px' }}>
      <Header style={{ background: '#fff', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Selecione uma Sala de Aula</Title>
        <div>
          <Button type="primary" onClick={handleManageClassroomsClick}>
            Gerenciar Salas de Aula
          </Button>
          <Button type="primary" style={{ backgroundColor: 'red', marginLeft:32 }} onClick={handleLogout}>
            Sair!
          </Button>
        </div>
      </Header>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Row gutter={[16, 16]} style={{ maxWidth: '1000px' }}>
          {classrooms.map(classroom => (
            <Col xs={24} sm={12} md={8} lg={6} key={classroom.id}>
              <Card
                hoverable
                onClick={() => handleCardClick(classroom.id)}
                style={{
                  height: 150, // Define a altura para manter os cards quadrados
                  width: 150, // Define a largura para manter os cards quadrados
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: getRandomColor(),
                  color: '#fff', // Para garantir que o texto seja legível em qualquer cor
                  borderRadius: 8, // Suaviza as bordas do card
                  textAlign: 'center', // Centraliza o texto
                }}
              >
                <div>
                  <Title level={4} style={{ color: '#fff', margin: 0 }}>{classroom.name}</Title>
                  <p style={{ margin: 0 }}>Clique para entrar na sala</p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default Home;
