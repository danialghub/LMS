
import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: "User" },
    courseId: { type: String, required: true, ref: "Course" },
    authority: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["failed", 'successful', 'pending'],
        default: "pending"
    },
    paymentData: { type: Object },
    verifiedAt: { type: Date }

}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction
