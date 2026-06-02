// models/User.js
import mongoose from 'mongoose'

const courseProgressSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    courseId: { type: String, required: true, unique: true },
    completedLectures: []

}, { minimize: false });

const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);

export default CourseProgress
