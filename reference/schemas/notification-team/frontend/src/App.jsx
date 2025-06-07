// App.jsx - Updated to work with enhanced notification system

import React, { useState } from 'react';
import NotificationModal from './components/NotificationModal';
import NotificationSettings from './components/NotificationSettings';
import { mockAPI } from './data/mockData';
import { Send, Users, FileText, Settings, Bell, Calendar, AlertTriangle, Mail } from 'lucide-react';

function App() {
  // State to control which page to show
  const [currentPage, setCurrentPage] = useState('main'); // 'main' or 'settings'
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    userIds: [],
    notificationId: null
  });

  // Navigation functions
  const goToSettings = () => setCurrentPage('settings');
  const goToMain = () => setCurrentPage('main');

  // Modal control functions
  const openNotificationModal = (userIds, notificationId) => {
    setModalConfig({ userIds, notificationId });
    setIsModalOpen(true);
  };

  const closeNotificationModal = () => {
    setIsModalOpen(false);
    setModalConfig({ userIds: [], notificationId: null });
  };

  // Enhanced notification send handler
  //real
  const handleNotificationSend = async (notificationRequest) => {
    try {
      console.log('Sending notification request:', notificationRequest);
  
      const users = notificationRequest.recipients || notificationRequest.users || [];
      const to = users
        .map(user => user.email)
        .filter(Boolean)
        .join(',');
  
      const subject = 'Volunteer Notification';
      const html = notificationRequest.message_content;
  
      const mock_to = "josephlijintao@gmail.com"

      console.log('TO:', mock_to);
      console.log('SUBJECT:', subject);
      console.log('HTML:', html);
  
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, html }),
      });
  
      const data = await response.json();
      console.log('✅ RESPONSE:', data);
  
      if (data.success) {
        alert('✅ Notification sent successfully!');
      } else {
        alert('❌ Failed to send notification');
      }
  
      return data;
    } catch (error) {
      console.error('❌ Failed to send notification:', error);
      alert('❌ Failed to send notification. Please try again.');
      throw error;
    }
  };
  
  
  //2nd
  // const handleNotificationSend = async (notificationRequest) => {
  //   try {
  //     console.log('📤 Sending notification request:', notificationRequest);
  
  //     // 检查 users 是否存在
  //     if (!notificationRequest.users || !Array.isArray(notificationRequest.users)) {
  //       throw new Error('Invalid notificationRequest: users field is missing or not an array');
  //     }
  
  //     const to = notificationRequest.users.map((user) => user.email).filter(Boolean).join(',');
  //     const subject = notificationRequest.subject || 'Notification';
  //     const html = notificationRequest.content || '';
  
  //     console.log('TO:', to);
  //     console.log('SUBJECT:', subject);
  //     console.log('HTML:', html);
  
  //     const response = await fetch('/api/notifications/send', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ to, subject, html }),
  //     });
  
  //     const data = await response.json();
  //     console.log('✅ RESPONSE:', data);
  
  //     if (data.success) {
  //       alert('✅ Notification sent successfully!');
  //     } else {
  //       alert('❌ Failed to send notification');
  //     }
  
  //     return data;
  //   } catch (error) {
  //     console.error('❌ Failed to send notification:', error.message || error);
  //     alert('❌ Error: ' + (error.message || 'Unexpected error'));
  //     throw error;
  //   }
  // };
  

  // // mock
  // const handleNotificationSend = async (notificationRequest) => {
  //   try {
  //     console.log('Sending notification request:', notificationRequest);
      
  //     const response = await mockAPI.sendNotification(notificationRequest);
      
  //     // Create success message with detailed information
  //     const recipientCount = response.total_recipients;
  //     const channelCount = response.successful_sends;
  //     const failedCount = response.failed_sends;
      
  //     let message = `✅ Notification sent successfully!\n\n`;
  //     message += `📊 Summary:\n`;
  //     message += `• ${recipientCount} recipients\n`;
  //     message += `• ${channelCount} messages delivered\n`;
      
  //     if (failedCount > 0) {
  //       message += `• ${failedCount} delivery failures\n`;
  //     }
      
  //     alert(message);
      
  //     return response;
  //   } catch (error) {
  //     console.error('Failed to send notification:', error);
  //     alert('❌ Failed to send notification. Please try again.');
  //     throw error;
  //   }
  // };

  // Predefined scenarios with different user groups
  const notificationScenarios = [
    {
      id: 'schedule_reminder',
      title: 'Send Schedule Reminder',
      description: 'Send reminder to volunteers about their upcoming service',
      icon: Calendar,
      userIds: [1, 2, 3], // John, Jane, Bob
      notificationId: 5,
      color: 'blue'
    },
    {
      id: 'application_confirmation', 
      title: 'Application Confirmation',
      description: 'Send confirmation to newly approved volunteer',
      icon: FileText,
      userIds: [4], // Alice
      notificationId: 1,
      color: 'green'
    },
    {
      id: 'event_invitation',
      title: 'Special Event Invitation',
      description: 'Send invitation to selected volunteers for special event',
      icon: Send,
      userIds: [2, 4, 5, 7], // Jane, Alice, Charlie, Michael
      notificationId: 6,
      color: 'purple'
    },
    {
      id: 'emergency_alert',
      title: 'Emergency Alert',
      description: 'Send urgent notification to all active volunteers',
      icon: AlertTriangle,
      userIds: [1, 2, 3, 4, 5, 7], // All except those with no contacts
      notificationId: 7,
      color: 'red'
    },
    {
      id: 'monthly_newsletter',
      title: 'Monthly Newsletter',
      description: 'Send monthly newsletter to all volunteers',
      icon: Mail,
      userIds: [1, 2, 3, 4, 5, 6, 7], // All volunteers
      notificationId: 8,
      color: 'indigo'
    },
    {
      id: 'confirmation_followup',
      title: 'Confirmation Follow-up',
      description: 'Follow up with volunteers who haven\'t confirmed their schedule',
      icon: Bell,
      userIds: [3, 5], // Bob, Charlie
      notificationId: 4,
      color: 'yellow'
    }
  ];

  const getIconColorClass = (color) => {
    const colorMap = {
      blue: 'text-blue-600',
      green: 'text-green-600', 
      purple: 'text-purple-600',
      red: 'text-red-600',
      indigo: 'text-indigo-600',
      yellow: 'text-yellow-600'
    };
    return colorMap[color] || 'text-[#0891B2]';
  };

  // Render settings page
  if (currentPage === 'settings') {
    return <NotificationSettings onBack={goToMain} />;
  }

  // Render main page
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#B51D4C] text-white rounded-lg flex items-center justify-center">
                <Send size={18} />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                OBVS Notification System Demo
              </h1>
            </div>
            <button
              onClick={goToSettings}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-2 text-sm"
            >
              <Settings size={16} />
              Notification Settings
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Notification Scenarios
            </h2>
            <p className="text-sm text-gray-600">
              Choose from predefined notification scenarios to test the enhanced contact selection system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notificationScenarios.map(scenario => {
              const IconComponent = scenario.icon;
              
              return (
                <div key={scenario.id} className="border rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <IconComponent 
                        className={`mt-0.5 ${getIconColorClass(scenario.color)}`} 
                        size={20} 
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {scenario.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {scenario.description}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          <Users size={12} />
                          <span>{scenario.userIds.length} recipient{scenario.userIds.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => openNotificationModal(scenario.userIds, scenario.notificationId)}
                      className="px-4 py-2 bg-[#B51D4C] text-white rounded-md hover:bg-[#9A1940] transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
                    >
                      <Send size={16} />
                      Send
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* System Information */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Features Box */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="text-sm font-medium text-blue-900 mb-2">✨ Enhanced Features</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Individual contact method selection</li>
                <li>• Multiple contact types per user</li>
                <li>• Verification status indicators</li>
                <li>• Bulk selection controls</li>
                <li>• Enterprise-grade data format</li>
              </ul>
            </div>

            {/* Demo Info Box */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <h4 className="text-sm font-medium text-amber-900 mb-2">🧪 Demo Information</h4>
              <p className="text-xs text-amber-800">
                This demo uses mock data with realistic contact information. 
                In production, the system will connect to actual OBVS API endpoints 
                with real user data and delivery services.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Notification Modal */}
      <NotificationModal
        isOpen={isModalOpen}
        onClose={closeNotificationModal}
        userIds={modalConfig.userIds}
        notificationId={modalConfig.notificationId}
        onSend={handleNotificationSend}
        fetchUsers={mockAPI.fetchUsers}
        fetchTemplate={mockAPI.fetchTemplate}
      />
    </div>
  );
}

export default App;