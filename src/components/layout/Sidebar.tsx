
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  FileQuestion,
  Map,
  BrainCircuit,
  UserCircle,
  Settings,
  Menu,
  X
} from 'lucide-react';
import LanguageSwitcher from '@/components/language/LanguageSwitcher';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { t } = useTranslation();

  const menuItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: t('navigation.dashboard') },
    { path: '/quiz', icon: <FileQuestion size={20} />, label: t('navigation.quiz') },
    { path: '/flashcards', icon: <BookOpen size={20} />, label: t('navigation.flashcards') },
    { path: '/qualifications', icon: <GraduationCap size={20} />, label: t('navigation.qualifications') },
    { path: '/learning-paths', icon: <Map size={20} />, label: t('navigation.learningPaths') },
    { path: '/cognitive-profile', icon: <BrainCircuit size={20} />, label: 'Cognitive Profile' },
    { path: '/profile', icon: <UserCircle size={20} />, label: t('navigation.profile') },
    { path: '/settings', icon: <Settings size={20} />, label: t('navigation.settings') }
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 w-64 dark:bg-gray-950 dark:border-gray-800 
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'}`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
        <span className={`text-lg font-semibold ${!isOpen && 'md:hidden'}`}>Study Bee</span>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 md:hidden"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <nav className="flex flex-col flex-1 p-2 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-3 py-2.5 rounded-md flex items-center space-x-3 transition-colors ${
                isActive
                  ? 'bg-gray-100 text-black dark:bg-gray-800 dark:text-white'
                  : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900'
              } ${!isOpen && 'md:justify-center md:px-2'}`
            }
          >
            {item.icon}
            <span className={`${!isOpen && 'md:hidden'}`}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <LanguageSwitcher />
      </div>
    </aside>
  );
};

export default Sidebar;
