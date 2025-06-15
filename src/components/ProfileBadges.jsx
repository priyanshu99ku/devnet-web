import React from 'react';
import { FaMedal } from 'react-icons/fa';

const BADGES = [
  { count: 1, label: 'First Connection', color: 'bg-yellow-400', icon: <FaMedal className="text-yellow-600" /> },
  { count: 5, label: '5 Connections', color: 'bg-blue-400', icon: <FaMedal className="text-blue-700" /> },
  { count: 25, label: '25 Connections', color: 'bg-purple-400', icon: <FaMedal className="text-purple-700" /> },
];

const ProfileBadges = ({ connectionCount }) => {
  return (
    <div className="w-full flex flex-col items-center gap-4 mt-4 mb-6">
      <div className="flex gap-4 flex-wrap justify-center">
        {BADGES.map(badge => (
          <div
            key={badge.count}
            className={`flex flex-col items-center px-4 py-2 rounded-xl shadow-md border-2 transition-all duration-200 ${connectionCount >= badge.count ? badge.color + ' border-yellow-500 scale-105' : 'bg-gray-200 border-gray-300 opacity-60'}`}
          >
            <span className="text-2xl mb-1">{badge.icon}</span>
            <span className="font-semibold text-base">{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileBadges; 