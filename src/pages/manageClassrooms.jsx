import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Typography, List, Tabs, Transfer, message } from 'antd';
import { auth, db } from '../firebase';
import { doc, setDoc, collection, addDoc, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const { Title } = Typography;
const { TabPane } = Tabs;

function ManageClassrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchClassrooms = async () => {
      const classroomsCollection = collection(db, `professores/${user.uid}/salas`);
      const classroomsSnapshot = await getDocs(classroomsCollection);
      const classroomsList = classroomsSnapshot.docs.map(doc => ({
        key: doc.id, // Necessário para o Transfer
        title: doc.data().name,
        description: doc.data().name,
      }));
      setClassrooms(classroomsList);
    };

    fetchClassrooms();
  }, [user.uid]);

  const handleCreateClassroom = async (values) => {
    setLoading(true);
    try {
      await addDoc(collection(db, `professores/${user.uid}/salas`), {
        name: values.classroomName,
        createdAt: new Date(),
      });
      message.success('Sala criada com sucesso!');
      setLoading(false);
    } catch (error) {
      message.error('Erro ao criar a sala: ' + error.message);
      setLoading(false);
    }
  };

  const handleAddStudent = async (values) => {
    setLoadingStudents(true);
    try {
      const { studentName, studentEmail, studentPassword } = values;

      // Criar a conta de usuário para o aluno no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, studentEmail, studentPassword);
      const studentUser = userCredential.user;

      // Criar ou atualizar o documento do aluno no Firestore
      const studentDocRef = doc(db, 'alunos', studentUser.uid);
      const studentDoc = await getDoc(studentDocRef);

      if (studentDoc.exists()) {
        // Se o aluno já existe, adicionar os novos IDs de sala ao array existente
        await updateDoc(studentDocRef, {
          fullName: studentName,
          email: studentEmail,
          role: 'student',
          professorId: user.uid,
          salaIds: arrayUnion(...selectedRooms),
          updatedAt: new Date(),
        });
      } else {
        // Se o aluno não existe, criar o documento com os IDs das salas
        await setDoc(studentDocRef, {
          fullName: studentName,
          email: studentEmail,
          role: 'student',
          professorId: user.uid,
          salaIds: selectedRooms,
          createdAt: new Date(),
        });
      }

      // Adicionar o aluno a cada sala especificada
      for (const classroomId of selectedRooms) {
        const classroomRef = doc(db, `professores/${user.uid}/salas/${classroomId}`);
        await updateDoc(classroomRef, {
          alunos: { [studentUser.uid]: studentName },
        }, { merge: true });
      }

      message.success('Aluno adicionado com sucesso a todas as salas!');
      setLoadingStudents(false);
    } catch (error) {
      message.error('Erro ao adicionar aluno: ' + error.message);
      setLoadingStudents(false);
    }
  };

  const handleTransferChange = (targetKeys) => {
    setSelectedRooms(targetKeys);
  };

  return (
    <Row justify="center" align="middle" style={{ padding: '50px' }}>
      <Col xs={24} sm={16} md={12} lg={8} xl={6}>
        <Title level={2} style={{ textAlign: 'center' }}>Gerenciar Salas de Aula e Alunos</Title>

        <Tabs defaultActiveKey="1">
          <TabPane tab="Criar Sala" key="1">
            <Form layout="vertical" onFinish={handleCreateClassroom} style={{ marginBottom: '30px' }}>
              <Form.Item
                label="Nome da Sala"
                name="classroomName"
                rules={[{ required: true, message: 'Por favor, insira o nome da sala' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Criar Sala
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="Criar Aluno" key="2">
            <Form layout="vertical" onFinish={handleAddStudent}>
              <Form.Item
                label="Nome do Aluno"
                name="studentName"
                rules={[{ required: true, message: 'Por favor, insira o nome do aluno' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email do Aluno"
                name="studentEmail"
                rules={[{ required: true, message: 'Por favor, insira o email do aluno' }]}
              >
                <Input type="email" />
              </Form.Item>

              <Form.Item
                label="Senha do Aluno"
                name="studentPassword"
                rules={[{ required: true, message: 'Por favor, insira uma senha para o aluno' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Selecione as Salas"
                name="classroomIds"
                rules={[{ required: true, message: 'Por favor, selecione pelo menos uma sala' }]}
              >
                <Transfer
                  dataSource={classrooms}
                  targetKeys={selectedRooms}
                  onChange={handleTransferChange}
                  render={item => item.title}
                  listStyle={{
                    width: 250,
                    height: 300,
                  }}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loadingStudents} block>
                  Adicionar Aluno
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs> 
      </Col>
    </Row>
  );
}

export default ManageClassrooms;
