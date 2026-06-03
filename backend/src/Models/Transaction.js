
import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true, ref: "User" },
    courseId: { type: String, required: true, unique: true, ref: "Course" },
    value: { type: String, required: true },
    status: {
        type: String,
        enum: ["failed", 'successful', 'progressing'],
        default: "progressing"
    },

}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction
