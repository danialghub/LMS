import mongoose from 'mongoose'


const LectureSchema = new mongoose.Schema({
    lectureId: { type: String, required: true },
    lectureTitle: { type: String, required: true },
    lectureDuration: { type: Number },
    lectureUrl: { type: String },
    isLectureFree: { type: Boolean, default: false },
    isLecturePublished: { type: Boolean, default: false },
    lectureOrder: { type: Number, required: true },
    attachment: {
        url: String,
        name: String,
        size: Number,
        fileType: String
    },
    lecturePublishStatus: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
}, { _id: false })

const ChapterSchema = new mongoose.Schema({
    chapterId: { type: String, required: true },
    chapterTitle: { type: String, required: true },
    chapterOrder: { type: Number, default: 1 },
    chapterContent: [LectureSchema]
}, { _id: false })


const CourseSchema = new mongoose.Schema({
    courseTitle: { type: String, required: true, unique: true },
    slug: {
        type: String, unique: true, required: true
    },
    courseDescription: { type: String },
    courseThumbnail: String,

    coursePrice: { type: String },

    courseDiscount: { type: Number, min: 0, max: 100, default: 0 },

    isCoursePublished: { type: Boolean, default: false },

    courseContent: [ChapterSchema],

    courseRatings: [
        { userId: String, rating: { type: Number, min: 1, max: 5 } }
    ],

    instructor: { type: mongoose.Schema.ObjectId, ref: "User", required: true },

    enrolledStudents: [
        { type: mongoose.Schema.ObjectId, ref: 'User' }
    ],
    coursePublishStatus: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },

}, { timestamps: true })



const Course = mongoose.model('Course', CourseSchema);

export default Course