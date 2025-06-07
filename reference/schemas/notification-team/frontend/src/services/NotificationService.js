// NotificationService.js - Service class for handling notifications

import { mockUsers, mockNotificationTemplates } from "../data/mockData";

class NotificationService {
  constructor() {
    // In real implementation, this would be your API base URL
    // For Vite, use import.meta.env instead of process.env
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api/v1";
  }

  /**
   * Fetch users by their IDs
   * @param {number[]} userIds - Array of user IDs
   * @returns {Promise<Object[]>} Array of user objects
   */
  async fetchUsers(userIds) {
    try {
      // Mock implementation - replace with actual API call
      // const response = await fetch(`${this.apiBaseUrl}/users?ids=${userIds.join(',')}`);
      // const data = await response.json();
      // return data;

      // Mock delay to simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      const users = userIds.map((id) => mockUsers[id]).filter(Boolean);
      if (users.length === 0) {
        throw new Error("No users found");
      }
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
  // async fetchUsers(userIds) {
  //   try {
  //     const response = await fetch(`${this.apiBaseUrl}/users`);
  //     const users = await response.json();
  //     return users.filter(user => userIds.includes(user._id));
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //     throw error;
  //   }
  // }
  

  /**
   * Fetch notification template by ID
   * @param {number} notificationId - Notification template ID
   * @returns {Promise<Object>} Notification template object
   */
  async fetchNotificationTemplate(notificationId) {
    try {
      // Mock implementation - replace with actual API call
      // const response = await fetch(`${this.apiBaseUrl}/notifications/templates/${notificationId}`);
      // const data = await response.json();
      // return data;

      // Mock delay to simulate API call
      await new Promise((resolve) => setTimeout(resolve, 200));

      const template = mockNotificationTemplates[notificationId];
      if (!template) {
        throw new Error("Notification template not found");
      }
      return template;
    } catch (error) {
      console.error("Error fetching notification template:", error);
      throw error;
    }
  }

  /**
   * Send notification to users
   * @param {Object} notificationData - Notification data including userIds, content, deliveryMethod, etc.
   * @returns {Promise<Object>} Response from the server
   */
  async sendNotification(notificationData) {
    try {
      // Validate delivery method
      if (![0, 1, 2].includes(notificationData.deliveryMethod)) {
        throw new Error(
          "Invalid delivery method. Must be 0 (email), 1 (SMS), or 2 (both)"
        );
      }

      // Prepare notification payload based on delivery method
      const payload = {
        userIds: notificationData.userIds,
        notificationId: notificationData.notificationId,
        content: notificationData.content,
        deliveryMethod: notificationData.deliveryMethod,
        recipients: [],
      };

      // Build recipient list with appropriate contact info
      for (const user of notificationData.users) {
        const recipient = {
          userId: user.id,
          name: `${user.firstName} ${user.lastName}`,
        };

        // Add contact info based on delivery method
        if (
          notificationData.deliveryMethod === 0 ||
          notificationData.deliveryMethod === 2
        ) {
          recipient.email = user.email;
        }
        if (
          notificationData.deliveryMethod === 1 ||
          notificationData.deliveryMethod === 2
        ) {
          recipient.phone = user.phone || user.cellPhone || "N/A";
        }

        payload.recipients.push(recipient);
      }

      // Mock implementation - replace with actual API call
      // console.log("Sending notification with payload:", payload);

      //real
      await fetch(`${this.apiBaseUrl}/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: payload.recipients.map(r => r.email).join(','),
          subject: 'Volunteer Notification',
          html: payload.content || notificationData.content,
        }),
      });
      

      // Simulate different API endpoints based on delivery method
      if (notificationData.deliveryMethod === 0) {
        // Email only
        await this.sendEmailNotification(payload);
      } else if (notificationData.deliveryMethod === 1) {
        // SMS only
        await this.sendSMSNotification(payload);
      } else if (notificationData.deliveryMethod === 2) {
        // Both email and SMS
        await Promise.all([
          this.sendEmailNotification(payload),
          this.sendSMSNotification(payload),
        ]);
      }

      // Mock delay to simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock response
      const response = {
        success: true,
        message: this.getSuccessMessage(notificationData.deliveryMethod),
        sentCount: notificationData.userIds.length,
        deliveryMethod: notificationData.deliveryMethod,
        timestamp: new Date().toISOString(),
        details: {
          email:
            notificationData.deliveryMethod !== 1
              ? { sent: notificationData.userIds.length, failed: 0 }
              : null,
          sms:
            notificationData.deliveryMethod !== 0
              ? { sent: notificationData.userIds.length, failed: 0 }
              : null,
        },
      };

      return response;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }

  /**
   * Send email notification
   * @private
   */
  async sendEmailNotification(payload) {
    // Mock implementation
    // i comment it

    // console.log(
    //   "Sending email to:",
    //   payload.recipients.map((r) => r.email)
    // );

    // i comment it
    return await fetch(`${this.apiBaseUrl}/notifications/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: payload.recipients.map(r => r.email),
        subject: 'Notification Email',
        content: payload.content
      })
    });
    

    // In real implementation:
    // return await fetch(`${this.apiBaseUrl}/notifications/email`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // });
  }

  /**
   * Send SMS notification
   * @private
   */
  async sendSMSNotification(payload) {
    // Mock implementation
    console.log(
      "Sending SMS to:",
      payload.recipients.map((r) => r.phone)
    );

    // In real implementation:
    // return await fetch(`${this.apiBaseUrl}/notifications/sms`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // });
  }

  /**
   * Get success message based on delivery method
   * @private
   */
  getSuccessMessage(deliveryMethod) {
    switch (deliveryMethod) {
      case 0:
        return "Email notifications sent successfully";
      case 1:
        return "SMS notifications sent successfully";
      case 2:
        return "Email and SMS notifications sent successfully";
      default:
        return "Notifications sent successfully";
    }
  }

  /**
   * Get all notification templates
   * @returns {Promise<Object[]>} Array of notification templates
   */
  async getAllTemplates() {
    try {
      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 200));
      return Object.entries(mockNotificationTemplates).map(
        ([id, template]) => ({
          id: parseInt(id),
          ...template,
        })
      );
    } catch (error) {
      console.error("Error fetching templates:", error);
      throw error;
    }
  }

  /**
   * Validate notification data before sending
   * @param {Object} data - Notification data to validate
   * @returns {boolean} Whether the data is valid
   */
  validateNotificationData(data) {
    if (
      !data.userIds ||
      !Array.isArray(data.userIds) ||
      data.userIds.length === 0
    ) {
      throw new Error("User IDs are required");
    }

    if (
      !data.content ||
      typeof data.content !== "string" ||
      data.content.trim().length === 0
    ) {
      throw new Error("Notification content is required");
    }

    if (!data.notificationId || typeof data.notificationId !== "number") {
      throw new Error("Valid notification ID is required");
    }

    if (
      data.deliveryMethod === undefined ||
      ![0, 1, 2].includes(data.deliveryMethod)
    ) {
      throw new Error(
        "Valid delivery method is required (0: email, 1: SMS, 2: both)"
      );
    }

    return true;
  }
}

// Export singleton instance
export default new NotificationService();
