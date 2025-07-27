const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    }, // e.g., "2024/2025"
    isActive: { 
        type: Boolean, 
        default: false 
        },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }, { timestamps: true });


module.exports = mongoose.model('Session', sessionSchema);
