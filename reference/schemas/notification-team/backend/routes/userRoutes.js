// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Schedule = mongoose.connection.collection('schedules');

router.get('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const record = await Schedule.findOne({ user_id: userId });
    if (!record) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: record.user_id,
      name: record.name,
      email: record.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
