const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GameSchema = new Schema (
    {
        grid: {type: Array, require: true},
        winner: {type: String, require: true},
    },
    { timestamps: true }
)

module.exports = mongoose.model('Game', GameSchema)