const cron = require('node-cron');
const mongoose = require('mongoose');
const { sendEmail } = require('./emailService');
const NotificationInstance = require('../models/NotificationInstance');

const Schedule = mongoose.connection.collection('schedules');

cron.schedule('* * * * *', async () => {
  console.log('[Reminder Task] Checking for volunteer services within 24h...');

  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const services = await Schedule.find({
    service_time: { $gte: now, $lte: next24h }
  }).toArray();

  for (const s of services) {
    // prevent duplicateds
    const exists = await NotificationInstance.findOne({
      related_entity_type: 'ScheduleReminder',
      related_entity_id: s._id
    });
    if (exists) continue;

    const subject = `Reminder: Upcoming Volunteer Service`;
    const html = `
    <p>Hi ${s.name},<br>
    Your volunteer service is scheduled for <strong>${new Date(s.service_time).toLocaleString()}</strong>.<br><br>
    <strong>Position:</strong> ${s.position}<br>
    <strong>Location:</strong> ${s.location}<br>
    <strong>Details:</strong> ${s.description}
    </p>
  `;
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

    console.log(`Reminder sent to ${s.name} (${s.email})`);
  }
});