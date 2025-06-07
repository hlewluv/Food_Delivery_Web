import React from 'react';
import { FiChevronDown, FiArchive } from 'react-icons/fi';

const Header = ({
  userName = 'Hoang Le',
  branchName = 'Coffee Cafe & Roasters, Ho Chi Minh',
  archiveCount = '17.1k',
}) => (
  <div className="bg-white px-8 pt-5 pb-3">
    <div className="flex flex-row justify-between items-start">
      <div className="flex flex-row items-baseline">
        <span className="text-xl font-bold mr-2">Chào bạn trở lại!</span>
        <span className="text-3xl font-bold">{userName}</span>
      </div>
    </div>
    <div className="flex flex-row items-center mt-2">
      <span className="text-lg mr-2">{branchName}</span>
      <FiChevronDown size={20} color="#6b7280" />
    </div>
    <div className="flex flex-row items-center mt-2">
      <FiArchive size={16} color="#6b7280" />
      <span className="text-gray-500 ml-1">{archiveCount}</span>
    </div>
  </div>
);

export default Header;