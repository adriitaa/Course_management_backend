const Course = require('../models/Course');

async function createCourse(req, res) {
  try {
    const { title, description, price, duration, category, instructorName, courseImage } = req.body;
    const course = await Course.create({
      title, description, price, duration, category, instructorName, courseImage,
      createdBy: req.user.id
    });
    res.status(201).json({ course });
  } catch (e) {
    if (e.name === 'ValidationError') return res.status(400).json({ message: e.message });
    res.status(500).json({ message: 'Create failed' });
  }
}

async function getCourses(_req, res) {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ courses });
  } catch {
    res.status(500).json({ message: 'Fetch failed' });
  }
}

async function getCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ course });
  } catch (e) {
    if (e.name === 'CastError') return res.status(400).json({ message: 'Invalid course id' });
    res.status(500).json({ message: 'Fetch failed' });
  }
}

async function updateCourseById(req, res) {
  try {
    const fields = ['title','description','price','duration','category','instructorName','courseImage'];
    const updates = {};
    for (const f of fields) if (req.body[f] !== undefined) updates[f] = req.body[f];

    const course = await Course.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true
    });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ course });
  } catch (e) {
    if (e.name === 'CastError') return res.status(400).json({ message: 'Invalid course id' });
    if (e.name === 'ValidationError') return res.status(400).json({ message: e.message });
    res.status(500).json({ message: 'Update failed' });
  }
}

async function deleteCourseById(req, res) {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    if (e.name === 'CastError') return res.status(400).json({ message: 'Invalid course id' });
    res.status(500).json({ message: 'Delete failed' });
  }
}

module.exports = { createCourse, getCourses, getCourseById, updateCourseById, deleteCourseById };
