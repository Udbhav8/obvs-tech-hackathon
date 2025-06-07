// useNotification.js - Custom hook for managing notification state and operations

import { useState, useCallback } from "react";
import NotificationService from "../services/NotificationService";

const useNotification = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationConfig, setNotificationConfig] = useState({
    userIds: [],
    notificationId: null,
  });
  const [isSending, setIsSending] = useState(false);

  /**
   * Open notification modal with configuration
   * @param {number[]} userIds - Array of user IDs to send notification to
   * @param {number} notificationId - ID of the notification template
   * @param {number} defaultDeliveryMethod - Default delivery method (0: email, 1: SMS, 2: both)
   */
  const openNotificationModal = useCallback(
    (userIds, notificationId, defaultDeliveryMethod = 0) => {
      if (!userIds || userIds.length === 0) {
        console.error("No users selected for notification");
        return;
      }

      if (!notificationId) {
        console.error("No notification template selected");
        return;
      }

      setNotificationConfig({
        userIds,
        notificationId,
        defaultDeliveryMethod,
      });
      setIsModalOpen(true);
    },
    []
  );

  /**
   * Close notification modal
   */
  const closeNotificationModal = useCallback(() => {
    setIsModalOpen(false);
    // Reset configuration after a delay to avoid UI flicker
    setTimeout(() => {
      setNotificationConfig({
        userIds: [],
        notificationId: null,
      });
    }, 300);
  }, []);

  /**
   * Send notification
   * @param {Object} data - Notification data
   * @returns {Promise<Object>} Response from the service
   */
  const sendNotification = useCallback(async (data) => {
    setIsSending(true);

    try {
      // Validate data
      NotificationService.validateNotificationData(data);

      // Send notification
      const response = await NotificationService.sendNotification(data);

      // You can add toast notification here for success
      console.log("Notification sent successfully:", response);

      return response;
    } catch (error) {
      // You can add toast notification here for error
      console.error("Failed to send notification:", error);
      throw error;
    } finally {
      setIsSending(false);
    }
  }, []);

  /**
   * Fetch users by IDs
   */
  const fetchUsers = useCallback(async (userIds) => {
    return await NotificationService.fetchUsers(userIds);
  }, []);

  /**
   * Fetch notification template
   */
  const fetchTemplate = useCallback(async (notificationId) => {
    return await NotificationService.fetchNotificationTemplate(notificationId);
  }, []);

  return {
    // State
    isModalOpen,
    notificationConfig,
    isSending,

    // Actions
    openNotificationModal,
    closeNotificationModal,
    sendNotification,
    fetchUsers,
    fetchTemplate,

    // Service methods (for direct access if needed)
    notificationService: NotificationService,
  };
};

export default useNotification;
