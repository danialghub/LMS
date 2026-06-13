// models/User.js
import mongoose from 'mongoose'

const courseProgressSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    completedLectures: { type: [], default: [] } // بهتره default هم بدید

}, { minimize: false });


courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);

export default CourseProgress