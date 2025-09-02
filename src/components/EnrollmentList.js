"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import {
  FaBook,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaSadTear,
  FaClock,
  FaMapMarkerAlt,
  FaAward,
} from "react-icons/fa"

const EnrollmentList = () => {
  const { enrollmentAPI } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchMyCourses()
  }, [])

  const fetchMyCourses = async () => {
    try {
      setLoading(true)
      const data = await enrollmentAPI.getMyCourses()
      setCourses(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-50">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center mr-4">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">My Enrolled Courses</h1>
                <p className="text-gray-600 text-lg">Track your academic journey</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <FaBook className="mr-2" />
                {courses.length} Courses Enrolled
              </span>
              <span className="flex items-center">
                <FaAward className="mr-2" />
                {courses.reduce((total, course) => total + (course.credits || 0), 0)} Total Credits
              </span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
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

        {/* Empty State */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
            <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaSadTear className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No enrolled courses yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't enrolled in any courses yet. Start your learning journey by browsing our course catalog.
            </p>
            <a
              href="/"
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FaBook className="mr-2" />
              Browse Available Courses
            </a>
          </div>
        ) : (
          /* Course Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group"
              >
                {/* Course Header */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <span className="inline-block bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">
                          {course.code}
                        </span>
                        <span className="ml-2 inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                          Enrolled
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {course.title}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <FaChalkboardTeacher className="mr-2 text-violet-500" />
                        <span className="font-medium line-clamp-1">{course.instructor}</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-3 text-center min-w-[70px]">
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
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">{course.description}</p>
                  )}

                  {/* Enrollment Status */}
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 px-4 py-3 rounded-2xl flex items-center justify-center border border-purple-200">
                    <FaGraduationCap className="mr-2 text-purple-600" />
                    <span className="text-sm font-semibold">Successfully Enrolled</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EnrollmentList