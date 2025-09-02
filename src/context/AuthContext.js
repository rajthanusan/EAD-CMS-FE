import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AuthContext = createContext();


const API_BASE_URL = 'https://ead-cms-be.vercel.app';



const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: true
};


const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
    case 'REGISTER_FAIL':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};


export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  
  useEffect(() => {
    if (state.token) {
      loadUser();
    } else {
      
      setTimeout(() => {
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 1000);
    }
  }, [state.token]);

  
  const apiRequest = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        
        if (response.status === 401) {
          dispatch({ type: 'AUTH_ERROR' });
          toast.error('Session expired. Please login again.');
        }
        throw new Error(data.error || data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  
  const loadUser = async () => {
    try {
      const data = await apiRequest('/api/auth/me');
      dispatch({
        type: 'USER_LOADED',
        payload: data
      });
      return data;
    } catch (error) {
      console.error('Error loading user:', error);
      dispatch({ type: 'AUTH_ERROR' });
      throw error;
    }
  };

  
  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      
      const registerResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      const data = await registerResponse.json();
      
      if (!registerResponse.ok) {
        throw new Error(data.error || data.message || 'Registration failed');
      }
      
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: data
      });
      
      toast.success('Registration successful! Welcome!');
      return data;
    } catch (error) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: error.message
      });
      toast.error(error.message || 'Registration failed. Please try again.');
      throw error;
    }
  };

  
  const login = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      
      const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      const data = await loginResponse.json();
      
      if (!loginResponse.ok) {
        throw new Error(data.error || data.message || 'Login failed');
      }
      
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: data
      });
      
      toast.success('Login successful! Welcome back!');
      return data;
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: error.message
      });
      toast.error(error.message || 'Login failed. Please check your credentials.');
      throw error;
    }
  };

  
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
   
  };

  
  const courseAPI = {
    
    getCourses: async () => {
      try {
        const data = await apiRequest('/api/courses');
        return data;
      } catch (error) {
        toast.error('Failed to fetch courses.');
        throw error;
      }
    },
    
    
    getCourse: async (id) => {
      try {
        const data = await apiRequest(`/api/courses/${id}`);
        return data;
      } catch (error) {
        toast.error('Failed to fetch course details.');
        throw error;
      }
    },
    
    
    createCourse: async (courseData) => {
      try {
        const data = await apiRequest('/api/courses', {
          method: 'POST',
          body: JSON.stringify(courseData)
        });
        toast.success('Course created successfully!');
        return data;
      } catch (error) {
        toast.error('Failed to create course.');
        throw error;
      }
    },
    
    
    updateCourse: async (id, courseData) => {
      try {
        const data = await apiRequest(`/api/courses/${id}`, {
          method: 'PUT',
          body: JSON.stringify(courseData)
        });
        toast.success('Course updated successfully!');
        return data;
      } catch (error) {
        toast.error('Failed to update course.');
        throw error;
      }
    },
    
    
    deleteCourse: async (id) => {
      try {
        const data = await apiRequest(`/api/courses/${id}`, {
          method: 'DELETE'
        });
        toast.success('Course deleted successfully!');
        return data;
      } catch (error) {
        toast.error('Failed to delete course.');
        throw error;
      }
    }
  };

  
  const enrollmentAPI = {
    
    enroll: async (courseId) => {
      try {
        const data = await apiRequest(`/api/enroll/${courseId}`, {
          method: 'POST'
        });
        toast.success('Successfully enrolled in the course!');
        return data;
      } catch (error) {
        toast.error('Failed to enroll in the course.');
        throw error;
      }
    },
    
    
    unenroll: async (courseId) => {
      try {
        const data = await apiRequest(`/api/enroll/${courseId}`, {
          method: 'DELETE'
        });
        toast.info('Successfully unenrolled from the course.');
        return data;
      } catch (error) {
        toast.error('Failed to unenroll from the course.');
        throw error;
      }
    },
    
    
    getMyCourses: async () => {
      try {
        const data = await apiRequest('/api/enroll/my-courses');
        return data;
      } catch (error) {
        toast.error('Failed to fetch your courses.');
        throw error;
      }
    }
  };

  const studentAPI = {
    
    getStudents: () => apiRequest('/api/students'),
    
    
    getStudent: (id) => apiRequest(`/api/students/${id}`),
    
    
    deleteStudent: (id) => 
      apiRequest(`/api/students/${id}`, {
        method: 'DELETE'
      }),
    
    
    getStudentEnrollments: (id) => 
      apiRequest(`/api/students/${id}/enrollments`)
  };
  
  
  const resultAPI = {
    
    addResult: (resultData) => 
      apiRequest('/api/results', {
        method: 'POST',
        body: JSON.stringify(resultData)
      }),
    
    
    getStudentResults: (studentId) => 
      apiRequest(`/api/results/student/${studentId}`),
    
    
    getMyResults: () => 
      apiRequest('/api/results/my-results'),
    
    
    updateResult: (id, resultData) => 
      apiRequest(`/api/results/${id}`, {
        method: 'PUT',
        body: JSON.stringify(resultData)
      }),
    
    
    deleteResult: (id) => 
      apiRequest(`/api/results/${id}`, {
        method: 'DELETE'
      })
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      dispatch,
      register,
      login,
      logout,
      loadUser,
      courseAPI,
      enrollmentAPI,
      studentAPI,
      resultAPI, 
      apiRequest 
    }}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};