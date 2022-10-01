const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema (
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        verified: {type: Boolean, required: true},
        key: {type: String, required: true},
        currentGame: {type: ObjectId, required: true}
    },
    { timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)