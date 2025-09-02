"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import AddCourse from "./AddCourse"
import EditCourse from "./EditCourse"
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaUserMinus,
  FaSignInAlt,
  FaBook,
  FaChalkboardTeacher,
  FaUsers,
  FaGraduationCap,
  FaClock,
  FaMapMarkerAlt,
  FaSearch,
} from "react-icons/fa"

const CourseList = () => {
  const { user, courseAPI, enrollmentAPI } = useAuth()
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [enrolling, setEnrolling] = useState({})
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCourses(filtered)
    } else {
      setFilteredCourses(courses)
    }
  }, [searchTerm, courses])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const data = await courseAPI.getCourses()
      setCourses(data)
      setFilteredCourses(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await courseAPI.deleteCourse(id)
        setCourses(courses.filter((course) => course._id !== id))
        setSuccess("Course deleted successfully")
        setTimeout(() => setSuccess(""), 3000)
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const handleEdit = (course) => {
    setSelectedCourse(course)
    setShowEditModal(true)
  }

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling((prev) => ({ ...prev, [courseId]: true }))
      await enrollmentAPI.enroll(courseId)
      await fetchCourses()
      setSuccess("Successfully enrolled in course")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnrolling((prev) => ({ ...prev, [courseId]: false }))
    }
  }

  const handleUnenroll = async (courseId) => {
    try {
      setEnrolling((prev) => ({ ...prev, [courseId]: true }))
      await enrollmentAPI.unenroll(courseId)
      await fetchCourses()
      setSuccess("Successfully unenrolled from course")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnrolling((prev) => ({ ...prev, [courseId]: false }))
    }
  }

  const isEnrolled = (course) => {
    return user && course.enrolledStudents && course.enrolledStudents.includes(user._id)
  }

  const getEnrollmentPercentage = (course) => {
    const enrolled = course.enrollmentCount || 0
    const capacity = course.capacity || 30
    return Math.min(100, Math.round((enrolled / capacity) * 100))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 absolute top-0 left-0"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                <FaBook className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Course Catalog</h1>
                <p className="text-gray-600 text-lg">Discover and enroll in amazing courses</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <FaUsers className="mr-2" />
                {courses.length} Courses Available
              </span>
              {user && user.role === "student" && (
                <span className="flex items-center">
                  <FaGraduationCap className="mr-2" />
                  {courses.filter((course) => isEnrolled(course)).length} Enrolled
                </span>
              )}
            </div>
          </div>
          {user && user.role === "admin" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FaPlus className="mr-2" />
              Add New Course
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6 flex items-center animate-pulse">
            <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl mb-6 flex items-center animate-pulse">
            <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{success}</span>
          </div>
        )}

        {/* Empty State */}
        {filteredCourses.length === 0 && !loading ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
            <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBook className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {searchTerm ? "No courses found" : "No courses available"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm 
                ? "Try adjusting your search terms or browse all courses."
                : user && user.role === "admin"
                  ? "Get started by adding your first course to the catalog."
                  : "Check back later for new courses or contact your administrator."}
            </p>
            {user && user.role === "admin" && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaPlus className="mr-2" />
                Add Your First Course
              </button>
            )}
          </div>
        ) : (
          /* Course Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group"
              >
                {/* Course Header */}
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <span className="inline-block bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">
                          {course.code}
                        </span>
                        {isEnrolled(course) && (
                          <span className="ml-2 inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                            Enrolled
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {course.title}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <FaChalkboardTeacher className="mr-2 text-indigo-500" />
                        <span className="font-medium">{course.instructor}</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-3 text-center min-w-[70px]">
                      <div className="text-2xl font-bold text-purple-600">{course.credits}</div>
                      <div className="text-xs text-gray-500 font-medium">Credits</div>
                    </div>
                  </div>

                  {/* Course Details */}
                  {(course.schedule || course.location) && (
                    <div className="mb-4 space-y-2">
                      {course.schedule && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FaClock className="mr-3 text-gray-400 flex-shrink-0" />
                          <span className="line-clamp-1">{course.schedule}</span>
                        </div>
                      )}
                      {course.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FaMapMarkerAlt className="mr-3 text-gray-400 flex-shrink-0" />
                          <span className="line-clamp-1">{course.location}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {course.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{course.description}</p>
                  )}

                  {/* Enrollment Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-500">Enrollment</span>
                      <span className="text-xs font-medium text-gray-700">
                        {course.enrollmentCount || 0}/{course.capacity || 30}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getEnrollmentPercentage(course)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 pb-6">
                  {user && user.role === "admin" ? (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(course)}
                        className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-3 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200 border border-indigo-200 hover:border-indigo-300"
                        title="Edit course"
                      >
                        <FaEdit className="mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200 border border-red-200 hover:border-red-300"
                        title="Delete course"
                      >
                        <FaTrash className="mr-2" />
                        Delete
                      </button>
                    </div>
                  ) : user ? (
                    isEnrolled(course) ? (
                      <button
                        onClick={() => handleUnenroll(course._id)}
                        disabled={enrolling[course._id]}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-700 py-3 px-4 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200 disabled:opacity-50 border border-red-200 hover:border-red-300"
                        title="Unenroll from course"
                      >
                        <FaUserMinus className="mr-2" />
                        {enrolling[course._id] ? "Processing..." : "Unenroll"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course._id)}
                        disabled={enrolling[course._id] || course.enrollmentCount >= course.capacity}
                        className={`w-full py-3 px-4 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                          course.enrollmentCount >= course.capacity
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200"
                            : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                        } ${enrolling[course._id] ? "opacity-50" : ""}`}
                        title={course.enrollmentCount >= course.capacity ? "Course is full" : "Enroll in course"}
                      >
                        <FaUserPlus className="mr-2" />
                        {enrolling[course._id]
                          ? "Processing..."
                          : course.enrollmentCount >= course.capacity
                            ? "Course Full"
                            : "Enroll Now"}
                      </button>
                    )
                  ) : (
                    <div className="bg-purple-50 text-purple-700 px-4 py-3 rounded-xl flex items-center justify-center border border-purple-200">
                      <FaSignInAlt className="mr-2" />
                      <span className="text-sm font-medium">Login to enroll</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        {showAddModal && <AddCourse onClose={() => setShowAddModal(false)} onCourseAdded={fetchCourses} />}

        {showEditModal && selectedCourse && (
          <EditCourse
            course={selectedCourse}
            onClose={() => {
              setShowEditModal(false)
              setSelectedCourse(null)
            }}
            onCourseUpdated={fetchCourses}
          />
        )}
      </div>
    </div>
  )
}

export default CourseList