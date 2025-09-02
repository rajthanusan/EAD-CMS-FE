import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaTimes, FaSave } from 'react-icons/fa';

const AddEditResult = ({ studentId, result, onSuccess, onCancel }) => {
  const { resultAPI, courseAPI } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    studentId: studentId || '',
    courseId: result?.course?._id || '',
    grade: result?.grade || '',
    score: result?.score || '',
    semester: result?.semester || '',
    academicYear: result?.academicYear || '',
    remarks: result?.remarks || ''
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await courseAPI.getCourses();
      setCourses(data);
    } catch (err) {
      setError('Failed to load courses');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (result) {
        // Update existing result
        await resultAPI.updateResult(result._id, formData);
      } else {
        // Add new result
        await resultAPI.addResult(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {result ? 'Edit Result' : 'Add New Result'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="courseId">
              Course
            </label>
            <select
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={!!result} // Disable editing course for existing results
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.code} - {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="grade">
              Grade
            </label>
            <select
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a grade</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="F">F</option>
              <option value="I">I (Incomplete)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="score">
              Score (Optional)
            </label>
            <input
              type="number"
              id="score"
              name="score"
              value={formData.score}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter score (0-100)"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="semester">
              Semester
            </label>
            <input
              type="text"
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Fall, Spring, Summer"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="academicYear">
              Academic Year
            </label>
            <input
              type="text"
              id="academicYear"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 2023-2024"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="remarks">
              Remarks (Optional)
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional remarks"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center"
              disabled={loading}
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              disabled={loading}
            >
              <FaSave className="mr-2" /> {loading ? 'Saving...' : (result ? 'Update' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditResult;