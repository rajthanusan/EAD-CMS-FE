import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaChartLine, FaGraduationCap } from 'react-icons/fa';

const StudentResults = () => {
  const { resultAPI } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMyResults();
  }, []);

  const loadMyResults = async () => {
    try {
      setLoading(true);
      const data = await resultAPI.getMyResults();
      setResults(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateGPA = () => {
    if (results.length === 0) return 0;
    
    const gradePoints = {
      'A': 4.0,
      'B': 3.0,
      'C': 2.0,
      'D': 1.0,
      'F': 0.0,
      'I': 0.0
    };
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    results.forEach(result => {
      if (result.grade !== 'I') { // Exclude Incomplete grades
        const credits = result.course?.credits || 0;
        totalPoints += gradePoints[result.grade] * credits;
        totalCredits += credits;
      }
    });
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-blue-100 rounded-lg mr-4">
          <FaChartLine className="text-3xl text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Academic Results</h1>
          <p className="text-gray-600">View your course grades and academic performance</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Courses Completed</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {results.filter(r => r.grade !== 'I').length}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Current GPA</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{calculateGPA()}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800">Total Results</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">{results.length}</p>
            </div>
          </div>
        </div>
      )}

      {results.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <FaGraduationCap className="text-5xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600">No results available</h3>
          <p className="text-gray-500 mt-2">You don't have any results yet.</p>
        </div>
      ) : (
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
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Academic Year
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {result.course?.code}
                          </div>
                          <div className="text-sm text-gray-500">
                            {result.course?.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${result.grade === 'A' ? 'bg-green-100 text-green-800' : 
                          result.grade === 'B' ? 'bg-blue-100 text-blue-800' : 
                          result.grade === 'C' ? 'bg-yellow-100 text-yellow-800' : 
                          result.grade === 'D' ? 'bg-orange-100 text-orange-800' : 
                          result.grade === 'F' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'}`}
                      >
                        {result.grade}
                      </span>
                    </td>
                  
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.semester}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.academicYear}
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

export default StudentResults;