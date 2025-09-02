import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import CourseList from './components/CourseList';
import Login from './components/Login';
import Register from './components/Register';
import EnrollmentList from './components/EnrollmentList';
import StudentManagement from './components/StudentManagement';
import StudentDetails from './components/StudentDetails';
import ResultManagement from './components/ResultManagement';
import StudentResults from './components/StudentResults';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};


const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <CourseList />
              </ProtectedRoute>
            } />
            <Route path="/my-courses" element={
              <ProtectedRoute>
                <EnrollmentList />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/admin/students" element={
  <ProtectedRoute>
    <StudentManagement />
  </ProtectedRoute>
} />
<Route path="/admin/students/:id" element={
  <ProtectedRoute>
    <StudentDetails />
  </ProtectedRoute>
} />
<Route path="/admin/results" element={
  <ProtectedRoute>
    <ResultManagement />
  </ProtectedRoute>
} />
<Route path="/my-results" element={
  <ProtectedRoute>
    <StudentResults />
  </ProtectedRoute>
} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;