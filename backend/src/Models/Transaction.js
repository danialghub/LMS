// models/User.js
import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    courseId: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    status: {
        type: String,
        enum: ["failed", 'successful'],
        default: "failed"
    },

}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction
