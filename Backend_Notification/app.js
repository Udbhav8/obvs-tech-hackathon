const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'));

// Check User /api/users/:id
app.use('/api', require('./routes/userRoutes'));

// Send Email /api/notifications/send
app.use('/api', require('./routes/emailRoutes'));

app.use('/api', require('./routes/templateRoutes'));

// Notification
app.use('/api/notifications', require('./routes/notificationRoutes'));

// listen
app.listen(3000, () => console.log('Server running on port 3000'));

require('./services/scheduler');

