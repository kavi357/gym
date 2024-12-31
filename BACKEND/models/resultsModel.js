const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resultsSchema = new Schema({
    userEmail: {
        type: String,
        
        
    },
    result: {
        type: Array,
        default: [],
       
    },
    attempts: {
        type: Number,
        default: 0
    },
    points: {
        type: Number,
        default: 0
    },
    achived: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }


}, {timestamps:true})

module.exports = mongoose.model('result', resultsSchema)


