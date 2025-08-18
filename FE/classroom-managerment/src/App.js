import './App.css';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useEffect } from 'react';
import { logout, selectLoggedIn, selectRole } from './slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { verifyToken } from './apis/authApi';
import ManageStudents from './components/ManageStudent';
import { USER_ROLE } from './common/constant';
import ManageLesson from './components/ManageLesson';
import ManageEnrollment from './components/ManageEnrollment';
import Modal from 'react-modal'

function App() {
  const loggedIn = useSelector(selectLoggedIn);
  const role = useSelector(selectRole);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  Modal.setAppElement('#root');

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(verifyToken());
    }
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      dispatch(logout());
      navigate('/login');
    }
  }, [loggedIn]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Navigate to={role === USER_ROLE.INSTRUCTOR ? "manage-student" : "manage-enrollment"} replace />} />
        {role === USER_ROLE.INSTRUCTOR && (
          <>
            <Route path="manage-student" element={<ManageStudents />} />
            <Route path="manage-lesson" element={<ManageLesson />} />
          </>
        )}
        <Route path="manage-enrollment" element={<ManageEnrollment />} />
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
