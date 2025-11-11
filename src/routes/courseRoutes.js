const router = require('express').Router();
const { auth } = require('../middleware/auth');
const {
  createCourse, getCourses, getCourseById, updateCourseById, deleteCourseById
} = require('../controllers/courseController');

router.use(auth);              // all course endpoints require login
router.post('/', createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.put('/:id', updateCourseById);
router.delete('/:id', deleteCourseById);

module.exports = router;
