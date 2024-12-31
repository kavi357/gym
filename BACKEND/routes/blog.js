

const express = require('express')



const { getBlogs, 
        getSingleBlog,
        createBlog,
        deleteBlog,
        updateBlog,
        deleteBlogs
        } = require('../controllers/blogController')
const requireAuth = require('../middleware/requireAuth')


const router = express.Router()
router.use(requireAuth)

router.get('/', getBlogs)
router.get('/:id', getSingleBlog)
router.post('/',  createBlog)
router.delete('/:id', deleteBlog)
router.patch('/:id',updateBlog)
router.delete('/',deleteBlogs)

module.exports = router