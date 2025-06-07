// mockData.js - Enhanced mock data with contact information

export const mockUsers = {
  1: {
    id: 1,
    firstName: "Mitch",
    lastName: "Mitch",
    department: "Limitless Automation Company",
    role: "CEO",
    contacts: [
      {
        id: 1001,
        type: "email",
        value: "mitch@limitlessautomation.ca",
        is_verified: true,
        is_primary: true,
        created_at: "2024-01-15T10:00:00Z",
      },
      {
        id: 1002,
        type: "email",
        value: "josephlijintao@uvic.ca",
        is_verified: true,
        is_primary: false,
        created_at: "2024-01-15T10:05:00Z",
      },
      {
        id: 1003,
        type: "sms",
        value: "+1-555-0101",
        is_verified: true,
        is_primary: true,
        created_at: "2024-01-15T10:10:00Z",
      },
      {
        id: 1004,
        type: "phone",
        value: "+1-555-0111",
        is_verified: false,
        is_primary: false,
        created_at: "2024-01-15T10:15:00Z",
      },
    ],
  },
  2: {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    department: "Community Outreach",
    role: "Senior Volunteer",
    contacts: [
      {
        id: 1005,
        type: "email",
        value: "josephlijintao@gmail.com",
        is_verified: true,
        is_primary: true,
        created_at: "2024-01-16T09:00:00Z",
      },
      {
        id: 1006,
        type: "sms",
        value: "+1-555-0102",
        is_verified: true,
        is_primary: true,
        created_at: "2024-01-16T09:05:00Z",
      },
    ],
  },
  3: {
    id: 3,
    firstName: "Bob",
    lastName: "Johnson",
    department: "Events",
    role: "Event Volunteer",
    contacts: [
      {
        id: 1007,
        type: "email",
        value: "bob.johnson@obvs.org",
        is_verified: true,
        is_primary: true,
        created_at: "2024-01-17T14:00:00Z",
      },
      {
        id: 1008,
        type: "sms",
        value: "+1-555-0103",
        is_verified: false,
        is_primary: true,
        created_at: "2024-01-17T14:05:00Z",
      },
      {
        id: 1009,
        type: "phone",
        value: "+1-555-0113",
        is_verified: true,
        is_primary: false,
        created_at: "2024-01-17T14:10:00Z",
      },
    ],
  },
  4: {
    id: 4,
    firstName: "Alice",
    lastName: "Williams",
    department: "Youth Programs",
    role: "Youth Coordinator",
    contacts: [
      {
        id: 1010,
        type: "email",
        value: "alice.williams@obvs.org",
        is_verified: true,
        is_primary: true,
        created_at: "2024-01-18T11:00:00Z",
      },
      {
        id: 1011,
        type: "email",
        value: "alice.work@company.com",
        is_verified: true,
        is_primary: false,
        created_at: "2024-01-18T11:05:00Z",
      },
      {
        id: 1012,
        type: "sms",
        value: "+1-555-0104",
        is_verified: true,
        is_primary: true,
        created_at: "2024-01-18T11:10:00Z",
      },
    ],
  },
  5: {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    department: "Senior Services",
    role: "Senior Support Volunteer",
    contacts: [
      {
        id: 1013,
        type: "email",
        value: "charlie.brown@obvs.org",
        is_verified: true,
        is_primary: true,
        created_at: "2024-01-19T16:00:00Z",
      },
      {
        id: 1014,
        type: "sms",
        value: "+1-555-0105",
        is_verified: true,
        is_primary: true,
        created_at: "2024-01-19T16:05:00Z",
      },
      {
        id: 1015,
        type: "phone",
        value: "+1-555-0115",
        is_verified: true,
        is_primary: false,
        created_at: "2024-01-19T16:10:00Z",
      },
    ],
  },
  6: {
    id: 6,
    firstName: "Emma",
    lastName: "Davis",
    department: "Food Services",
    role: "Kitchen Volunteer",
    contacts: [
      {
        id: 1016,
        type: "email",
        value: "emma.davis@obvs.org",
        is_verified: true,
        is_primary: true,
        created_at: "2024-01-20T08:00:00Z",
      },
    ],
  },
  7: {
    id: 7,
    firstName: "Michael",
    lastName: "Chen",
    department: "Transportation",
    role: "Driver",
    contacts: [
      {
        id: 1017,
        type: "email",
        value: "michael.chen@obvs.org",
        is_verified: false,
        is_primary: true,
        created_at: "2024-01-21T13:00:00Z",
      },
      {
        id: 1018,
        type: "sms",
        value: "+1-555-0107",
        is_verified: true,
        is_primary: true,
        created_at: "2024-01-21T13:05:00Z",
      },
      {
        id: 1019,
        type: "phone",
        value: "+1-555-0117",
        is_verified: true,
        is_primary: false,
        created_at: "2024-01-21T13:10:00Z",
      },
    ],
  },
  8: {
    id: 8,
    firstName: "Sarah",
    lastName: "Wilson",
    department: "Administration",
    role: "Data Entry Volunteer",
    contacts: [], // Example of user with no contact methods
  },
};

export const mockNotificationTemplates = {
  1: {
    id: 1,
    type: "Application Confirmation",
    subject: "Welcome to OBVS - Application Approved",
    content:
      "Dear {{firstName}} {{lastName}},\n\nWe are pleased to confirm that your volunteer application has been approved. Welcome to Oak Bay Volunteer Services!\n\nYour orientation session is scheduled for {{orientationDate}}. Please bring a valid ID and arrive 15 minutes early.\n\nWe look forward to working with you!\n\nBest regards,\nOBVS Team",
    category: "transactional",
    is_active: true,
  },
  2: {
    id: 2,
    type: "Application Rejection",
    subject: "OBVS Application Update",
    content:
      "Dear {{firstName}} {{lastName}},\n\nThank you for your interest in volunteering with Oak Bay Volunteer Services. After careful consideration, we regret to inform you that we are unable to approve your application at this time.\n\nWe encourage you to reapply in the future. If you have any questions, please feel free to contact us.\n\nBest regards,\nOBVS Team",
    category: "transactional",
    is_active: true,
  },
  3: {
    id: 3,
    type: "Service Completion Thank You",
    subject: "Thank You for Your Service",
    content:
      "Dear {{firstName}} {{lastName}},\n\nThank you for completing your volunteer service with Oak Bay Volunteer Services. Your dedication and hard work have made a significant impact on our community.\n\nWe hope you will consider volunteering with us again in the future. Please feel free to use us as a reference.\n\nWith gratitude,\nOBVS Team",
    category: "transactional",
    is_active: true,
  },
  4: {
    id: 4,
    type: "Confirmation Follow-up",
    subject: "Please Confirm Your Volunteer Schedule",
    content:
      "Dear {{firstName}} {{lastName}},\n\nWe noticed that you haven't confirmed your volunteer schedule yet. This is a friendly reminder to please confirm your availability for the upcoming service date.\n\nIf you need to reschedule or have any questions, please contact us as soon as possible.\n\nThank you,\nOBVS Team",
    category: "reminder",
    is_active: true,
  },
  5: {
    id: 5,
    type: "Schedule Reminder",
    subject: "Reminder: Your Volunteer Shift Tomorrow",
    content:
      "Dear {{firstName}} {{lastName}},\n\nThis is a reminder that you are scheduled to volunteer tomorrow at {{shiftTime}}. Please remember to:\n\n• Arrive 10 minutes early\n• Wear comfortable clothing\n• Bring your volunteer ID\n\nIf you need to cancel or reschedule, please let us know immediately.\n\nSee you tomorrow!\nOBVS Team",
    category: "reminder",
    is_active: true,
  },
  6: {
    id: 6,
    type: "Event Invitation",
    subject: "Special Volunteer Opportunity - Join Us!",
    content:
      "Dear {{firstName}} {{lastName}},\n\nWe have an exciting volunteer opportunity coming up and would love to have you join us!\n\nEvent: {{eventName}}\nDate: {{eventDate}}\nTime: {{eventTime}}\nLocation: {{eventLocation}}\n\nThis is a great opportunity to make a difference in our community. Please let us know if you can attend by replying to this message.\n\nHope to see you there!\nOBVS Team",
    category: "invitation",
    is_active: true,
  },
  7: {
    id: 7,
    type: "Emergency Alert",
    subject: "URGENT: Service Update Required",
    content:
      "Dear {{firstName}} {{lastName}},\n\nDue to unexpected circumstances, we need to make changes to the volunteer schedule. Please check your schedule and confirm your availability.\n\nFor immediate assistance, please call our emergency line at (555) 000-0000.\n\nThank you for your understanding.\n\nOBVS Emergency Team",
    category: "urgent",
    is_active: true,
  },
  8: {
    id: 8,
    type: "Monthly Newsletter",
    subject: "OBVS Monthly Update - {{month}} {{year}}",
    content:
      "Dear {{firstName}} {{lastName}},\n\nHere's what's happening this month at Oak Bay Volunteer Services:\n\n• Upcoming Events\n• Volunteer Spotlights\n• Community Impact Updates\n• Training Opportunities\n\nRead the full newsletter at: {{newsletterLink}}\n\nThank you for being part of our community!\n\nOBVS Communications Team",
    category: "newsletter",
    is_active: true,
  },
};

// Mock API functions for the application
export const mockAPI = {
  // Fetch users by IDs
  fetchUsers: async (userIds) => {
    console.log("Mock API: Fetching users for IDs:", userIds);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = userIds.map((id) => mockUsers[id]).filter(Boolean);
    console.log("Mock API: Returning users:", users);

    return users;
  },

  // Fetch notification template by ID
  fetchTemplate: async (templateId) => {
    console.log("Mock API: Fetching template for ID:", templateId);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const template = mockNotificationTemplates[templateId];
    console.log("Mock API: Returning template:", template);

    return template;
  },

  // Send notification
  sendNotification: async (notificationRequest) => {
    console.log(
      "Mock API: Sending notification with data:",
      notificationRequest
    );

    // Simulate API processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Calculate successful sends
    const totalChannels = notificationRequest.recipients.reduce(
      (sum, recipient) => sum + recipient.delivery_channels.length,
      0
    );

    // Simulate some failures (90% success rate)
    const successfulSends = Math.floor(totalChannels * 0.9);

    const response = {
      success: true,
      message: "Notification sent successfully",
      total_recipients: notificationRequest.recipients.length,
      total_channels: totalChannels,
      successful_sends: successfulSends,
      failed_sends: totalChannels - successfulSends,
      sent_at: new Date().toISOString(),
      notification_id: notificationRequest.notification_id,
    };

    console.log("Mock API: Notification response:", response);
    return response;
  },
};
