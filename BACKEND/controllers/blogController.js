const Blog = require('../models/blogModel')
const mongoose = require('mongoose')

const getBlogs = async (req, res) => {

    try{
        const blogs = await Blog.find().sort({createdAt: -1})
        res.status(200).json(blogs)
    } catch(error) {
        res.status(400).json({ error: error.message });
    }

}

const getSingleBlog = async (req, res) => {

    try{
        const {id} = req.params
        if(!mongoose.Types.ObjectId.isValid(id)){
                        return res.status(404).json({error: 'Id is not valid'})
                    }

        const blog = await Blog.findById(id)
       
        if(!blog) {
            return res.status(404).json({error: 'No such blog'})
        }
        
        res.status(200).json(blog)
    } catch(error) {
        res.status(400).json({ error: error.message });
    }

}



const createBlog = async (req, res) => {

    const {title, content, image} = req.body

    let emptyFields = []

    if(!title) {
        emptyFields.push('title')
    }
    if(!content) {
        emptyFields.push('load')
    }
   
    if(emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill all the fields', emptyFields})
    }

    try{

        const user_id = req.user._id

        const blog = await Blog.create({title, content,image, user_id})
        res.status(200).json(blog)
    } catch(error) {
        res.status(400).json({ error: error.message });
    }

}

// delete a workout

const deleteBlog = async (req, res) => {

    try{
   
        const {id} = req.params

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error: 'Id is not valid'})
        }
        
        var blog = await Blog.findById(id)
       
        if(!blog) {
            return res.status(404).json({error: 'No such blog'})
        }
        
        blog = await Blog.findOneAndDelete({_id:id})
        
        res.status(200).json(blog)
    } catch(error) {
        res.status(400).json({ error: error.message });
    }

}

// update a workout

const updateBlog = async (req, res) => {

    const {title, content, image} = req.body
  
    try{
        const {id} = req.params

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error: 'Id is not valid'})
        }
       
        const blog = await Blog.findOneAndUpdate({_id:id},{title, content, image})
        if(!blog) {
            return res.status(404).json({error: 'No such blog'})
        }
        res.status(200).json({message: "Sucessfully updated"})
    } catch(error) {
        res.status(400).json({ error: error.message });
    }

}


// delete all workouts

const deleteBlogs = async (req, res) => {
    try {
       
        await Blog.deleteMany({});

       
        res.status(200).json({ message: 'All blogs deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// exporting functions

module.exports = { // object
    createBlog,
    getBlogs,
    getSingleBlog,
    deleteBlog,
    updateBlog,
    deleteBlogs
}