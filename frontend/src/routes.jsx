import React from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router'

import ProtectedRoute from '@/pages/ProtectedRoute'

import HomePage from '@/pages/HomePage'

import SignUpPage from '@/pages/Auth/SignupPage'
import LoginPage from '@/pages/Auth/LoginPage'

import CoursesPage from '@/pages/Courses/CoursesPage'
import CoursePage from '@/pages/Courses/CoursePage'
import LessonPage from '@/pages/Courses/LessonPage'
import TransactionResult from '@/pages/TransactionResult'

import CourseSetup from '@/pages/Instructor/CourseSetup'
import LectureSetup from '@/pages/Instructor/LectureSetup'


import InstructorDashboardPage from '@/pages/Instructor/InstructorDashboardPage'
import InstructorAnalytics from '@/pages/Instructor/InstructorAnalytics'
import InstructorCoursesManagementPage from '@/pages/Instructor/InstructorCoursesManagementPage'


import StudentDashboardPage from '@/pages/Student/StudentDashboardPage'
import StudentCourses from '@/pages/Student/StudentCourses'
import StudentTransactions from '@/pages/Student/StudentTransactions'

import NotFoundPage from '@/pages/NotFoundPage'
import UnAuthorized from '@/pages/UnAuthorized'

import { useAuthStore } from '@/store/useAuthStore'

const routes = () => {
    const { token } = useAuthStore()

    const routes = [

        {
            path: "/",
            element: <HomePage />
        },
        //auth
        {
            path: "/sign-up/",
            element: token ? <Navigate to={'/'} replace /> : <Outlet />,
            children: [
                { path: 'instructor', element: <SignUpPage role="instructor" /> },
                { path: 'student', element: <SignUpPage role="student" /> },
            ]
        },
        {
            path: "/login/",
            element: token ? <Navigate to={'/'} replace /> : <Outlet />,
            children: [
                { path: 'instructor', element: <LoginPage role="instructor" /> },
                { path: 'student', element: <LoginPage role="student" /> },
            ]
        },

        //course routes
        {
            path: "/courses",
            element: <CoursesPage />
        },
      
        {
            path: "/course/:courseId",
            element: <CoursePage />
        },
        {
            path: "/course/:courseId/:chapterId/:lectureId",
            element: <LessonPage />
        },
        //instrutor routes
        {
            path: "/instructor/",
            element: <ProtectedRoute requiredRole="instructor"><InstructorDashboardPage /></ProtectedRoute>,
            children: [
                {
                    path: "analytics",
                    element: <InstructorAnalytics />
                },
                {
                    path: "courses",
                    element: <InstructorCoursesManagementPage />
                },
                {
                    path: "courses/course-setup/:courseId",
                    element: <CourseSetup />
                },
                {
                    path: "courses/course-setup/:courseId/chapter/:chapterId/lecture-setup/:lectureId",
                    element: <LectureSetup />
                },
            ]
        },
        //student routers
        {
            path: "/student/",
            element: <ProtectedRoute requiredRole="student"><StudentDashboardPage /></ProtectedRoute>,
            children: [
                {
                    path: "my-courses",
                    element: <StudentCourses />
                },
                {
                    path: "my-transactions",
                    element: <StudentTransactions />
                },

            ]
        },
        //transaction
        {
            path: "/transaction-result",
            element: <ProtectedRoute requiredRole="student"><TransactionResult /></ProtectedRoute>,
        },
        {
            path: "/unauthorized",
            element: <UnAuthorized />,
        },

        {
            path: '*',
            element: <NotFoundPage />
        },


    ]

    const router = useRoutes(routes)

    return router;

}

export default routes