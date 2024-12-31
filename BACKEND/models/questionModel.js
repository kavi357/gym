const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question: {
        type: Array,
        default: [],
        
    },
    answers: {
        type: Array,
        default: [],
       
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {timestamps:true})

module.exports = mongoose.model('question', questionSchema)


