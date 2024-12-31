const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    user_id: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
}, {timestamps:true})

module.exports = mongoose.model('note', blogSchema)


