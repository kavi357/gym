

const express = require('express')



const { getQuestions, 
        insertAllQuestions,
        deleteAllQuestions,
        getResults,
        InsertAllResults,
        deleteAllResults
        } = require('../controllers/quizController')
const requireAuth = require('../middleware/requireAuth')


const router = express.Router()
router.use(requireAuth)

router.get('/questions', getQuestions)
router.delete('/questions',deleteAllQuestions)
router.post('/questions',insertAllQuestions )
router.get('/result', getResults)
router.post('/result', InsertAllResults)
router.delete('/result', deleteAllResults)

// router.get('/:id', getSingleQuiz)
// router.post('/',  createQuiz)
// router.delete('/:id', deleteQuiz)
// router.patch('/:id',updateQuiz)




module.exports = router