const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    language: { type: String, enum: ['pt-BR', 'en'], default: 'pt-BR' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
