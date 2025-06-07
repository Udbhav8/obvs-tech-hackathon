// NotificationSettings.jsx - Notification preferences settings page

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, MessageSquare, Bell, BellOff, Save, Settings } from 'lucide-react';

function NotificationSettings({ onBack }) {
  const [settings, setSettings] = useState({
    deliveryMethod: 2, // 0: Email, 1: SMS, 2: Both
    frequency: true, // true: receive notifications, false: do not receive
  });

  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load existing settings on component mount
  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      // TODO: Implement API call to fetch user's notification settings
      // const response = await fetch('/api/user/notification-settings');
      // const userSettings = await response.json();
      // setSettings(userSettings);
      
      console.log('Loading user notification settings...');
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleDeliveryMethodChange = (method) => {
    setSettings(prev => ({
      ...prev,
      deliveryMethod: method
    }));
  };

  const handleFrequencyChange = (receive) => {
    setSettings(prev => ({
      ...prev,
      frequency: receive
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setSaveMessage('');
    
    try {
      // TODO: Implement API call to save user's notification settings
      // const response = await fetch('/api/user/notification-settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });
      
      console.log('Saving notification settings:', settings);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveMessage('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDeliveryMethodText = () => {
    switch (settings.deliveryMethod) {
      case 0: return 'Email only';
      case 1: return 'SMS only';
      case 2: return 'Email and SMS';
      default: return 'Both';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Notification Settings
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="text-[#0891B2]" size={24} />
            <h2 className="text-lg font-medium text-gray-900">
              Manage Your Notification Preferences
            </h2>
          </div>

          <div className="space-y-8">
            {/* Delivery Method Section */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="text-[#0891B2]" size={20} />
                Delivery Method
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose how you would like to receive notifications from OBVS.
              </p>

              <div className="space-y-3">
                {/* Email Only */}
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value={0}
                    checked={settings.deliveryMethod === 0}
                    onChange={() => handleDeliveryMethodChange(0)}
                    className="h-4 w-4 text-[#B51D4C] focus:ring-[#B51D4C] border-gray-300"
                  />
                  <div className="ml-3 flex items-center space-x-3">
                    <Mail className="text-[#0891B2]" size={20} />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Email only</div>
                      <div className="text-sm text-gray-600">Receive notifications via email</div>
                    </div>
                  </div>
                </label>

                {/* SMS Only */}
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value={1}
                    checked={settings.deliveryMethod === 1}
                    onChange={() => handleDeliveryMethodChange(1)}
                    className="h-4 w-4 text-[#B51D4C] focus:ring-[#B51D4C] border-gray-300"
                  />
                  <div className="ml-3 flex items-center space-x-3">
                    <MessageSquare className="text-[#0891B2]" size={20} />
                    <div>
                      <div className="text-sm font-medium text-gray-900">SMS only</div>
                      <div className="text-sm text-gray-600">Receive notifications via text message</div>
                    </div>
                  </div>
                </label>

                {/* Both */}
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value={2}
                    checked={settings.deliveryMethod === 2}
                    onChange={() => handleDeliveryMethodChange(2)}
                    className="h-4 w-4 text-[#B51D4C] focus:ring-[#B51D4C] border-gray-300"
                  />
                  <div className="ml-3 flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <Mail className="text-[#0891B2]" size={20} />
                      <MessageSquare className="text-[#0891B2]" size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Both email and SMS</div>
                      <div className="text-sm text-gray-600">Receive notifications via both methods</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Notification Frequency Section */}
            <div className="pb-8">
              <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="text-[#0891B2]" size={20} />
                Notification Frequency
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Control whether you want to receive notifications from OBVS.
              </p>

              <div className="space-y-3">
                {/* Receive Notifications */}
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="frequency"
                    value={true}
                    checked={settings.frequency === true}
                    onChange={() => handleFrequencyChange(true)}
                    className="h-4 w-4 text-[#B51D4C] focus:ring-[#B51D4C] border-gray-300"
                  />
                  <div className="ml-3 flex items-center space-x-3">
                    <Bell className="text-green-600" size={20} />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Enable notifications</div>
                      <div className="text-sm text-gray-600">I would like to receive notifications from OBVS</div>
                    </div>
                  </div>
                </label>

                {/* Don't Receive Notifications */}
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="frequency"
                    value={false}
                    checked={settings.frequency === false}
                    onChange={() => handleFrequencyChange(false)}
                    className="h-4 w-4 text-[#B51D4C] focus:ring-[#B51D4C] border-gray-300"
                  />
                  <div className="ml-3 flex items-center space-x-3">
                    <BellOff className="text-gray-400" size={20} />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Disable notifications</div>
                      <div className="text-sm text-gray-600">I would like not to receive notifications from OBVS</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div>
                {saveMessage && (
                  <p className={`text-sm ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                    {saveMessage}
                  </p>
                )}
              </div>
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="px-6 py-2 bg-[#B51D4C] text-white rounded-md hover:bg-[#9A1940] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default NotificationSettings;