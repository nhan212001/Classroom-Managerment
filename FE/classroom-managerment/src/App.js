import './App.css';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
import ResetPassword from './pages/ResetPassword';
import ManageChat from './components/ManageChat';

function App() {
  const loggedIn = useSelector(selectLoggedIn);
  const role = useSelector(selectRole);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  Modal.setAppElement('#root');

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(verifyToken());
    }
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      if (location.pathname !== "/login" && location.pathname !== "/reset-password") {
        dispatch(logout());
        navigate("/login");
      }
    }
  }, [loggedIn]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Navigate to={role === USER_ROLE.INSTRUCTOR ? "manage-student" : "manage-enrollment"} replace />} />
        {role === USER_ROLE.INSTRUCTOR && (
          <>
            <Route path="manage-student" element={<ManageStudents />} />
            <Route path="manage-lesson" element={<ManageLesson />} />
          </>
        )}
        <Route path="manage-enrollment" element={<ManageEnrollment />} />
        <Route path="message" element={<ManageChat />} />
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
