// testScheduler.js

require('dotenv').config();
const mongoose = require('mongoose');
const { sendEmail } = require('./services/emailService');
const NotificationInstance = require('./models/NotificationInstance');

const MONGO_URI = process.env.MONGO_URI;
const Schedule = mongoose.connection.collection('schedules');

(async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');

    const now = new Date();
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const services = await Schedule.find({
      service_time: { $gte: now, $lte: next24h }
    }).toArray();

    if (services.length === 0) {
      console.log('⚠️ No services within 24h found.');
    }

    for (const s of services) {
      const exists = await NotificationInstance.findOne({
        related_entity_type: 'ScheduleReminder',
        related_entity_id: s._id
      });
      if (exists) {
        console.log(`⚠️ Already reminded: ${s.name}`);
        continue;
      }

      const subject = `Reminder: Upcoming Volunteer Service`;
      const html = `<p>Hi ${s.name},<br>Your volunteer service is scheduled for ${new Date(s.service_time).toLocaleString()}.</p>`;

      await sendEmail(s.email, subject, html);

      await NotificationInstance.create({
        notification_id: Date.now(),
        rule_id: null,
        user_id: s.user_id,
        related_entity_type: 'ScheduleReminder',
        related_entity_id: s._id,
        status: 'Sent',
        scheduled_time: now,
        sent_time: new Date(),
        delivery_method: 'Email',
        delivery_details: { email: s.email },
        retry_count: 0,
        created_at: new Date()
      });

      console.log(`✅ Reminder sent to ${s.name} (${s.email})`);
    }

    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  } catch (err) {
    console.error('❌ Error running testScheduler:', err);
  }
})();
