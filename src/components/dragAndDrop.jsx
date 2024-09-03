import React, { useEffect, useState } from 'react';
import { Upload, message, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { storage, db, auth } from '../firebase'; // Importar o storage e db do Firebase
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';

const { Text } = Typography;

const DragAndDrop = () => {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'alunos', user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().fullName);
        } else {
          // Caso o usuário seja um professor
          const professorDoc = await getDoc(doc(db, 'professores', user.uid));
          if (professorDoc.exists()) {
            setUserName(professorDoc.data().fullName);
          }
        }
      }
    };
    fetchUserName();
  }, []);

  const handleUpload = ({ file, onError, onSuccess }) => {
    if (!userName) {
      message.error("Nome do usuário não encontrado. Tente novamente.");
      return;
    }

    const storageRef = ref(storage, `${userName}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Progresso do upload
      },
      (error) => {
        onError(error);
        message.error(`Erro ao enviar o arquivo: ${error.message}`);
      },
      () => {
        // Upload completo
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onSuccess(null, file);
          message.success(`${file.name} enviado com sucesso!`);
        });
      }
    );
  };

  return (
    <Upload.Dragger 
      customRequest={handleUpload} 
      showUploadList={false}
      style={{ height: '100%', padding: '20px' }}
    >
      <p className="ant-upload-drag-icon">
        <UploadOutlined />
      </p>
      <p className="ant-upload-text">Arraste e solte arquivos aqui para enviar</p>
      <p className="ant-upload-hint">
        Suporte para upload único ou em massa. Apenas arquivos de dados são permitidos.
      </p>
    </Upload.Dragger>
  );
};

export default DragAndDrop;
