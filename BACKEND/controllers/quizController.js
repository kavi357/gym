const Question = require('../models/questionModel')
const Result = require('../models/resultsModel')
const mongoose = require('mongoose')

const quizData = require('../database/data.js');

const questions = quizData.questions;
const answers = quizData.answers;





// get all questions

const getQuestions = async (req, res) => {

    
    try{
        const blogs = await Question.find().sort({createdAt: -1})
        res.status(200).json(blogs)
    } catch(error) {
        res.status(400).json({ error: error.message });
    }

}

const getResults = async (req, res) => {

    res.json("get all result")
    // try{
    //     const blogs = await Blog.find().sort({createdAt: -1})
    //     res.status(200).json(blogs)
    // } catch(error) {
    //     res.status(400).json({ error: error.message });
    // }

}



// insert all questions

const insertAllQuestions = async (req, res) => {
    try {
        console.log(questions)
        // Assuming `Question` is your Mongoose model
        await Question.insertMany({questions: questions, answers: answers});
        
        res.status(200).json({ msg: "Data saved successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const InsertAllResults = async (req, res) => {

    res.json("insert all results")
    // try{
    //     const blogs = await Blog.find().sort({createdAt: -1})
    //     res.status(200).json(blogs)
    // } catch(error) {
    //     res.status(400).json({ error: error.message });
    // }

}





const getSingleQuiz = async (req, res) => {

    // try{
    //     const {id} = req.params
    //     if(!mongoose.Types.ObjectId.isValid(id)){
    //                     return res.status(404).json({error: 'Id is not valid'})
    //                 }

    //     const blog = await Blog.findById(id)
       
    //     if(!blog) {
    //         return res.status(404).json({error: 'No such blog'})
    //     }
        
    //     res.status(200).json(blog)
    // } catch(error) {
    //     res.status(400).json({ error: error.message });
    // }

}

const createQuiz = async (req, res) => {

    // const {title, content, image} = req.body

    // let emptyFields = []

    // if(!title) {
    //     emptyFields.push('title')
    // }
    // if(!content) {
    //     emptyFields.push('load')
    // }
   
    // if(emptyFields.length > 0) {
    //     return res.status(400).json({ error: 'Please fill all the fields', emptyFields})
    // }

    // try{

    //     const user_id = req.user._id

    //     const blog = await Blog.create({title, content,image, user_id})
    //     res.status(200).json(blog)
    // } catch(error) {
    //     res.status(400).json({ error: error.message });
    // }

}

// delete a workout

const deleteQuiz = async (req, res) => {

    // try{
   
    //     const {id} = req.params

    //     if(!mongoose.Types.ObjectId.isValid(id)){
    //         return res.status(404).json({error: 'Id is not valid'})
    //     }
        
    //     var blog = await Blog.findById(id)
       
    //     if(!blog) {
    //         return res.status(404).json({error: 'No such blog'})
    //     }
        
    //     blog = await Blog.findOneAndDelete({_id:id})
        
    //     res.status(200).json(blog)
    // } catch(error) {
    //     res.status(400).json({ error: error.message });
    // }

}

// update a workout

const updateQuiz = async (req, res) => {

    // const {title, content, image} = req.body
  
    // try{
    //     const {id} = req.params

    //     if(!mongoose.Types.ObjectId.isValid(id)){
    //         return res.status(404).json({error: 'Id is not valid'})
    //     }
       
    //     const blog = await Blog.findOneAndUpdate({_id:id},{title, content, image})
    //     if(!blog) {
    //         return res.status(404).json({error: 'No such blog'})
    //     }
    //     res.status(200).json({message: "Sucessfully updated"})
    // } catch(error) {
    //     res.status(400).json({ error: error.message });
    // }

}


// delete all workouts

const deleteAllQuestions = async (req, res) => {

    res.json("delete  all questions")
    // try {
       
    //     await Blog.deleteMany({});

       
    //     res.status(200).json({ message: 'All blogs deleted successfully' });
    // } catch (error) {
    //     res.status(500).json({ error: error.message });
    // }
};

const deleteAllResults = async (req, res) => {

    res.json("delete All Results")
    // try {
       
    //     await Blog.deleteMany({});

       
    //     res.status(200).json({ message: 'All blogs deleted successfully' });
    // } catch (error) {
    //     res.status(500).json({ error: error.message });
    // }
};


// exporting functions

module.exports = { // object
    createQuiz,
    insertAllQuestions,
    getQuestions,
    getSingleQuiz,
    deleteQuiz,
    updateQuiz,
    deleteAllQuestions,
    getResults,
    InsertAllResults,
    deleteAllResults
}