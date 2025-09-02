import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaBook, FaUserGraduate } from 'react-icons/fa';

const StudentDetails = () => {
  const { studentAPI } = useAuth();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStudentDetails();
  }, [id]);

  const loadStudentDetails = async () => {
    try {
      setLoading(true);
      const [studentData, enrollmentData] = await Promise.all([
        studentAPI.getStudent(id),
        studentAPI.getStudentEnrollments(id)
      ]);
      
      setStudent(studentData);
      setEnrollments(enrollmentData.enrollments || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Student not found
        </div>
        <Link to="/admin/students" className="text-blue-600 hover:text-blue-800">
          <FaArrowLeft className="inline mr-1" /> Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/admin/students" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <FaArrowLeft className="mr-2" /> Back to Students
      </Link>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Student Details</h1>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Name</label>
              <p className="mt-1 text-sm text-gray-900">{student.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <p className="mt-1 text-sm text-gray-900">{student.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Joined Date</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(student.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Student ID</label>
              <p className="mt-1 text-sm text-gray-900">{student._id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FaBook className="mr-2" /> Course Enrollments
          </h2>
        </div>
        <div className="px-6 py-4">
          {enrollments.length === 0 ? (
            <div className="text-center py-8">
              <FaUserGraduate className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">This student is not enrolled in any courses yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instructor
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollments.map((course) => (
                    <tr key={course._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {course.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.credits}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.instructor?.name || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;