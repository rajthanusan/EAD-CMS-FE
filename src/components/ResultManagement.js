import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaEye, FaTrash, FaEdit, FaPlus, FaChartBar } from 'react-icons/fa';
import AddEditResult from './AddEditResult';

const ResultManagement = () => {
  const { studentAPI, resultAPI } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [results, setResults] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      loadStudentResults(selectedStudent);
    }
  }, [selectedStudent]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentAPI.getStudents();
      setStudents(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentResults = async (studentId) => {
    try {
      setLoading(true);
      const data = await resultAPI.getStudentResults(studentId);
      setResults(data.results || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await resultAPI.deleteResult(id);
        setResults(results.filter(result => result._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    if (selectedStudent) {
      loadStudentResults(selectedStudent);
    }
  };

  const handleEditSuccess = () => {
    setEditingResult(null);
    if (selectedStudent) {
      loadStudentResults(selectedStudent);
    }
  };

  if (loading && students.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Result Management</h1>
        {selectedStudent && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" /> Add Result
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Select Student</h2>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a student</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name} - {student.email}
            </option>
          ))}
        </select>
      </div>

      {showAddForm && (
        <AddEditResult
          studentId={selectedStudent}
          onSuccess={handleAddSuccess}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingResult && (
        <AddEditResult
          result={editingResult}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditingResult(null)}
        />
      )}

      {selectedStudent && results.length === 0 && !showAddForm && !editingResult ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <FaChartBar className="text-5xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600">No results found</h3>
          <p className="text-gray-500 mt-2">This student doesn't have any results yet.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
          >
            <FaPlus className="mr-2" /> Add First Result
          </button>
        </div>
      ) : selectedStudent && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {result.course?.code} - {result.course?.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{result.grade}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{result.score || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{result.semester}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{result.academicYear}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEditingResult(result)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FaEdit className="inline mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(result._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="inline mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultManagement;