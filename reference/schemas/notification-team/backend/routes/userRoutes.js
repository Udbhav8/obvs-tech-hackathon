const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// use MongoDB collection
const Schedule = mongoose.connection.collection('schedules');

// get /api/users/:id
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

// get mult /api/users?ids=1,2,3
router.get('/users', async (req, res) => {
  try {
    const idsParam = req.query.ids;

    // support ids=1,2,3, query
    if (idsParam) {
      const ids = idsParam.split(',').map((id) => parseInt(id.trim()));
      const cursor = await Schedule.find({ user_id: { $in: ids } });
      const users = await cursor.toArray();

      const result = users.map((user) => ({
        id: user.user_id,
        name: user.name,
        email: user.email,
      }));

      return res.json(result);
    }

    // if not return ids，return all users
    const allUsers = await Schedule.find({}).toArray();
    const result = allUsers.map((user) => ({
      id: user.user_id,
      name: user.name,
      email: user.email,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
