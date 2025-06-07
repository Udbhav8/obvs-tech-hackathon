// === NotificationService.js ===

import { mockUsers, mockNotificationTemplates } from "../data/mockData";

class NotificationService {
  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5173/api";
  }

  async fetchUsers(userIds) {
    try {
      const userPromises = userIds.map((id) =>
        fetch(`${this.apiBaseUrl}/users/${id}`).then((res) => res.json())
      );
      const users = await Promise.all(userPromises);
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async fetchNotificationTemplate(notificationId) {
    try {
      // 可以在后端实现 /templates/:id 接口以返回模板
      const response = await fetch(`${this.apiBaseUrl}/templates/${notificationId}`);
      const template = await response.json();
      return template;
    } catch (error) {
      console.error("Error fetching notification template:", error);
      throw error;
    }
  }

  async sendNotification(notificationData) {
    try {
      if (![0, 1, 2].includes(notificationData.deliveryMethod)) {
        throw new Error("Invalid delivery method. Must be 0 (email), 1 (SMS), or 2 (both)");
      }

      const payload = {
        recipients: [],
        content: notificationData.content
      };

      for (const user of notificationData.users) {
        const recipient = {
          userId: user.id,
          name: `${user.firstName} ${user.lastName}`,
        };

        if (notificationData.deliveryMethod !== 1) {
          recipient.email = user.email;
        }

        if (notificationData.deliveryMethod !== 0) {
          recipient.phone = user.phone || user.cellPhone || "N/A";
        }

        payload.recipients.push(recipient);
      }

      if (notificationData.deliveryMethod === 0) {
        await this.sendEmailNotification(payload);
      } else if (notificationData.deliveryMethod === 1) {
        await this.sendSMSNotification(payload);
      } else {
        await Promise.all([
          this.sendEmailNotification(payload),
          this.sendSMSNotification(payload),
        ]);
      }

      return {
        success: true,
        message: this.getSuccessMessage(notificationData.deliveryMethod),
        sentCount: payload.recipients.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }

  async sendEmailNotification(payload) {
    try {
      for (const recipient of payload.recipients) {
        await fetch(`${this.apiBaseUrl}/notifications/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: recipient.email,
            subject: payload.content.subject,
            html: payload.content.html,
          }),
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  async sendSMSNotification(payload) {
    // TODO: 实现 /notifications/sms 后端接口
    console.log("[Mock] Sending SMS to:", payload.recipients.map(r => r.phone));
  }

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

  async getAllTemplates() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/templates`);
      const templates = await response.json();
      return templates;
    } catch (error) {
      console.error("Error fetching templates:", error);
      throw error;
    }
  }

  validateNotificationData(data) {
    if (!data.userIds || !Array.isArray(data.userIds) || data.userIds.length === 0) {
      throw new Error("User IDs are required");
    }
    if (!data.content || typeof data.content !== "object" || !data.content.subject || !data.content.html) {
      throw new Error("Notification content must include subject and html");
    }
    if (data.deliveryMethod === undefined || ![0, 1, 2].includes(data.deliveryMethod)) {
      throw new Error("Valid delivery method is required (0: email, 1: SMS, 2: both)");
    }
    return true;
  }
}

export default new NotificationService();
