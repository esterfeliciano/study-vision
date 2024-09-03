import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Home from './pages/home';
import Login from './pages/login';
import RegisterTeacher from './pages/register';
import ManageClassrooms from './pages/manageClassrooms';
import PrivateRoute from './components/privateRoute';
import Sala from './pages/sala';
import { initializeAuth } from './store/reducers/auth';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/manage-classrooms" element={<PrivateRoute><ManageClassrooms /></PrivateRoute>} />
        <Route path="/sala/:id" element={<PrivateRoute><Sala /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterTeacher />} />
      </Routes>
    </div>
  );
}

export default App;
