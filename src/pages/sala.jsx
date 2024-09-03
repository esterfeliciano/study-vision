import React, { useEffect, useState } from 'react';
import { Layout, List, Typography, Button, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const Sala = () => {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();

  const handleLeft = async () => {
    navigate("/")
  };

  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        // Buscar alunos
        const studentsCollection = collection(db, `salas/${id}/alunos`);
        const studentsSnapshot = await getDocs(studentsCollection);
        const studentsList = studentsSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setStudents(studentsList);

        // Buscar todos os trabalhos entregues
        const assignmentsCollection = collection(db, `salas/${id}/trabalhos`);
        const assignmentsSnapshot = await getDocs(assignmentsCollection);
        const assignmentsList = assignmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          studentId: doc.data().studentId,
        }));
        setAssignments(assignmentsList);
      } catch (error) {
        message.error('Erro ao carregar dados da sala: ' + error.message);
      }
    };

    fetchClassroomData();
  }, [id]);

  const handleStudentClick = (studentId) => {
    setSelectedStudent(studentId);
  };

  const filteredAssignments = selectedStudent
    ? assignments.filter(assignment => assignment.studentId === selectedStudent)
    : assignments;

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={300} style={{ background: '#fff', padding: '20px' }}>
        <Text strong>Alunos</Text>
        <List
          bordered
          dataSource={students}
          renderItem={student => (
            <List.Item
              key={student.id}
              onClick={() => handleStudentClick(student.id)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedStudent === student.id ? '#e6f7ff' : '#fff',
              }}
            >
              {student.name}
            </List.Item>
          )}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            textAlign: 'center',
            padding: '0 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text strong style={{ fontSize: '20px' }}>Sala de Aula: {id}</Text>
          <Button type="primary" onClick={handleLeft}>
            Voltar
          </Button>
        </Header>
        <Content style={{ margin: '24px 16px 0', height: '100%' }}>
          <div style={{ padding: 24, background: '#fff', height: '100%' }}>
            <Title level={4}>Trabalhos Entregues</Title>
            <List
              bordered
              dataSource={filteredAssignments}
              renderItem={assignment => (
                <List.Item key={assignment.id}>
                  {assignment.title} - {assignment.studentId}
                </List.Item>
              )}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sala;
