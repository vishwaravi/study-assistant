import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import StudyAssistantChat from '../ai-features/StudyAssistantChat';
import Material from './Material';
import FlashcardGenerator from '../ai-features/FlashcardGenerator';
import Profile from '../Profile/Profile';
import ProfileEdit from '../Profile/ProfileEdit'; // Import ProfileEdit
import StudySessionManager from './StudySessionManager';
import Home from './Home';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('materials');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeMenu) {
      case 'chat':
        return <StudyAssistantChat />;
      case 'home':
        return <Home />
      case 'flash cards':
        return <FlashcardGenerator />;
      case 'profile':
        return <Profile onEditProfile={() => setActiveMenu('edit-profile')} />;
      case 'edit-profile':
        return <ProfileEdit onBack={() => setActiveMenu('profile')} />;
      case 'study sessions':
        return <StudySessionManager />
      case 'materials':
      default:
        return <Material />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-white shadow-lg border-r transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out w-64 z-50 md:relative md:translate-x-0`}>
        <div className="flex items-center justify-between h-16 border-b px-6 bg-gradient-to-b from-blue-600 to-blue-500">
          <h1 className="text-white font-semibold text-xl">Study Mate</h1>
          <button className="md:hidden text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-4">
          <NavItem title="Home" active={activeMenu === 'home'} onClick={() => { setActiveMenu('home'); setSidebarOpen(false); }} />
          <NavItem title="Materials" active={activeMenu === 'materials'} onClick={() => { setActiveMenu('materials'); setSidebarOpen(false); }} />
          <NavItem title="Study Sessions" active={activeMenu === 'study sessions'} onClick={() => { setActiveMenu('study sessions'); setSidebarOpen(false); }} />
          <NavItem title="Chat Ai" active={activeMenu === 'chat'} onClick={() => { setActiveMenu('chat'); setSidebarOpen(false); }} />
          <NavItem title="Flash Cards" active={activeMenu === 'flash cards'} onClick={() => { setActiveMenu('flash cards'); setSidebarOpen(false); }} />
          <NavItem title="Profile" active={activeMenu === 'profile' || activeMenu === 'edit-profile'} onClick={() => { setActiveMenu('profile'); setSidebarOpen(false); }} />
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between bg-white shadow-md border-b px-6 md:px-8">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-700" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {activeMenu === 'edit-profile' ? 'Edit Profile' : activeMenu.replace('-', ' ')}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-blue-700 text-lg font-bold">
              Hello, {sessionStorage.getItem("name")}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ title, active, onClick }) => (
  <button
    onClick={onClick}
    className={`text-left px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out ${active ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
      }`}
  >
    {title}
  </button>
);

export default Dashboard;
