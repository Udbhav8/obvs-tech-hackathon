// NotificationModal.jsx - Enhanced modal with per-user contact selection

import React, { useState, useEffect } from 'react';
import { X, Send, XCircle, Mail, MessageSquare, Phone, Check, AlertCircle, Users, CheckSquare, Square } from 'lucide-react';

const NotificationModal = ({ isOpen, onClose, userIds, notificationId, onSend, fetchUsers, fetchTemplate }) => {
  const [content, setContent] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userContactSelections, setUserContactSelections] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (isOpen && userIds.length > 0 && notificationId) {
      loadData();
    }
  }, [isOpen, userIds, notificationId]);

  const loadData = async () => {
    try {
      setError(null);
      
      // Fetch users with their contact information
      const fetchedUsers = await fetchUsers(userIds);
      setUsers(fetchedUsers);

      // Initialize contact selections for each user
      const initialSelections = {};
      fetchedUsers.forEach(user => {
        initialSelections[user.id] = {};
        user.contacts.forEach(contact => {
          // Auto-select primary contacts by default
          initialSelections[user.id][contact.id] = contact.is_primary;
        });
      });
      setUserContactSelections(initialSelections);

      // Fetch notification template
      const template = await fetchTemplate(notificationId);
      if (template) {
        setContent(template.content);
      }
    } catch (err) {
      setError('Failed to load notification data');
      console.error('Error loading notification data:', err);
    }
  };

  const handleContactSelection = (userId, contactId, selected) => {
    setUserContactSelections(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [contactId]: selected
      }
    }));
  };

  const handleSelectAllForUser = (userId, selectAll) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newSelections = {};
    user.contacts.forEach(contact => {
      newSelections[contact.id] = selectAll;
    });

    setUserContactSelections(prev => ({
      ...prev,
      [userId]: newSelections
    }));
  };

  const handleGlobalSelectAll = (selectAllValue) => {
    setSelectAll(selectAllValue);
    const newSelections = {};
    
    users.forEach(user => {
      newSelections[user.id] = {};
      user.contacts.forEach(contact => {
        newSelections[user.id][contact.id] = selectAllValue;
      });
    });
    
    setUserContactSelections(newSelections);
  };

  const getSelectedContactsForUser = (userId) => {
    const selections = userContactSelections[userId] || {};
    const user = users.find(u => u.id === userId);
    if (!user) return [];

    return user.contacts.filter(contact => selections[contact.id]);
  };

  const getTotalSelectedContacts = () => {
    return users.reduce((total, user) => {
      return total + getSelectedContactsForUser(user.id).length;
    }, 0);
  };

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare data in enterprise format
      const recipients = users.map(user => {
        const selectedContacts = getSelectedContactsForUser(user.id);
        return {
          user_id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          delivery_channels: selectedContacts.map((contact, index) => ({
            type: contact.type,
            address: contact.value,
            priority: index + 1,
            contact_id: contact.id,
            is_verified: contact.is_verified
          }))
        };
      }).filter(recipient => recipient.delivery_channels.length > 0);

      const notificationRequest = {
        notification_id: notificationId,
        message_content: content,
        recipients: recipients,
        send_options: {
          send_immediately: true,
          retry_failed: true,
          track_delivery: true
        }
      };

      await onSend(notificationRequest);
      onClose();
      resetState();
    } catch (error) {
      setError('Failed to send notification');
      console.error('Failed to send notification:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setContent('');
    setUsers([]);
    setUserContactSelections({});
    setError(null);
    setSelectAll(false);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      resetState();
    }
  };

  const getContactIcon = (type) => {
    switch (type) {
      case 'email': return <Mail size={16} className="text-blue-600" />;
      case 'sms': return <MessageSquare size={16} className="text-green-600" />;
      case 'phone': return <Phone size={16} className="text-purple-600" />;
      default: return <MessageSquare size={16} className="text-gray-600" />;
    }
  };

  const getContactTypeLabel = (type) => {
    switch (type) {
      case 'email': return 'Email';
      case 'sms': return 'SMS';
      case 'phone': return 'Phone';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  if (!isOpen) return null;

  const totalSelectedContacts = getTotalSelectedContacts();
  const totalRecipients = users.filter(user => getSelectedContactsForUser(user.id).length > 0).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Users className="text-[#0891B2]" size={24} />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Send Notification</h2>
              <p className="text-sm text-gray-600">
                {totalRecipients} recipients, {totalSelectedContacts} delivery channels selected
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
              <XCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Global Controls */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Recipients & Contact Methods</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleGlobalSelectAll(!selectAll)}
                  className="flex items-center gap-2 text-sm text-[#B51D4C] hover:text-[#9A1940]"
                >
                  {selectAll ? <CheckSquare size={16} /> : <Square size={16} />}
                  {selectAll ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {users.map(user => {
                const selectedContacts = getSelectedContactsForUser(user.id);
                const allContactsSelected = user.contacts.length > 0 && selectedContacts.length === user.contacts.length;
                const someContactsSelected = selectedContacts.length > 0 && selectedContacts.length < user.contacts.length;

                return (
                  <div key={user.id} className="border rounded-lg p-4">
                    {/* User Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0891B2] text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {selectedContacts.length} of {user.contacts.length} contacts selected
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSelectAllForUser(user.id, !allContactsSelected)}
                        className="flex items-center gap-2 text-sm text-[#B51D4C] hover:text-[#9A1940]"
                      >
                        {allContactsSelected ? (
                          <CheckSquare size={16} />
                        ) : someContactsSelected ? (
                          <div className="w-4 h-4 border-2 border-[#B51D4C] rounded flex items-center justify-center">
                            <div className="w-2 h-2 bg-[#B51D4C] rounded-sm"></div>
                          </div>
                        ) : (
                          <Square size={16} />
                        )}
                        {allContactsSelected ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>

                    {/* Contact Methods */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {user.contacts.map(contact => {
                        const isSelected = userContactSelections[user.id]?.[contact.id] || false;
                        
                        return (
                          <label
                            key={contact.id}
                            className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                              isSelected 
                                ? 'border-[#B51D4C] bg-red-50' 
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleContactSelection(user.id, contact.id, e.target.checked)}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 border-2 rounded mr-3 flex items-center justify-center ${
                              isSelected ? 'border-[#B51D4C] bg-[#B51D4C]' : 'border-gray-300'
                            }`}>
                              {isSelected && <Check size={12} className="text-white" />}
                            </div>
                            
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {getContactIcon(contact.type)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    {getContactTypeLabel(contact.type)}
                                  </span>
                                  {contact.is_primary && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                      Primary
                                    </span>
                                  )}
                                  {contact.is_verified ? (
                                    <Check size={12} className="text-green-600" />
                                  ) : (
                                    <AlertCircle size={12} className="text-amber-500" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 truncate">
                                  {contact.value}
                                </p>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    {user.contacts.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        <AlertCircle size={20} className="mx-auto mb-2" />
                        <p className="text-sm">No contact methods available for this user</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Message Content */}
          <div className="border-t p-6">
            <div className="space-y-2">
              <label htmlFor="notification-content" className="block text-sm font-medium text-gray-700">
                Message Content
              </label>
              <textarea
                id="notification-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0891B2] focus:border-transparent resize-none"
                placeholder="Enter your notification message..."
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {totalRecipients > 0 ? (
              <span>Ready to send to <strong>{totalRecipients}</strong> recipients via <strong>{totalSelectedContacts}</strong> channels</span>
            ) : (
              <span className="text-amber-600">⚠️ No recipients selected</span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={loading || !content.trim() || totalRecipients === 0}
              className="px-6 py-2 bg-[#B51D4C] text-white rounded-md hover:bg-[#9A1940] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B51D4C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send size={18} />
              {loading ? 'Sending...' : 'Send Notification'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;