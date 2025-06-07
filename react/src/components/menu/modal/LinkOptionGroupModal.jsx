import React from 'react';

// Define interfaces
const Option = {
  name: String,
  price: String
};

const OptionGroup = {
  groupName: String,
  options: [Option]
};

const Dish = {
  name: String,
  description: String,
  price: String,
  available: Boolean,
  image: String,
  optionGroups: [OptionGroup],
  category: String
};

const Category = {
  name: String,
  count: Number,
  dishes: [Dish]
};

const LinkOptionGroupModal = ({
  showLinkModal,
  setShowLinkModal,
  selectedCategoryForLink,
  setSelectedCategoryForLink,
  editDishData,
  setEditDishData,
  optionGroups,
  categories
}) => {
  const handleLinkOptionGroup = (groupName) => {
    const selectedGroup = optionGroups.find((group) => group.groupName === groupName);
    if (selectedGroup && !editDishData.optionGroups.some((group) => group.groupName === groupName)) {
      setEditDishData({
        ...editDishData,
        optionGroups: [...editDishData.optionGroups, selectedGroup]
      });
    }
    setShowLinkModal(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowLinkModal(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${showLinkModal ? "block" : "hidden"}`}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu đen với độ mờ 50%
        backdropFilter: "blur(4px)", // Hiệu ứng mờ
        WebkitBackdropFilter: "blur(4px)", // Hỗ trợ Safari
      }}
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg overflow-hidden w-[620px] h-[620px] max-w-[90%] max-h-[90%]">
        <div className="p-5 border-b border-gray-200">
          <p className="text-xl font-semibold text-gray-800">Liên kết nhóm tùy chọn</p>
        </div>
        <div className="p-5 h-[548px] flex flex-col">
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Chọn nhóm tùy chọn</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              value={selectedCategoryForLink}
              onChange={(e) => setSelectedCategoryForLink(e.target.value)}
            >
              <option value="">-- Chọn nhóm tùy chọn --</option>
              {optionGroups.map((group, index) => (
                <option key={index} value={group.groupName}>{group.groupName}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4 mt-auto">
            <button
              onClick={() => handleLinkOptionGroup(selectedCategoryForLink)}
              className="flex-1 bg-green-600 text-white font-medium text-sm px-4 py-3 rounded-lg"
              disabled={!selectedCategoryForLink}
            >
              Liên kết
            </button>
            <button
              onClick={() => setShowLinkModal(false)}
              className="flex-1 bg-gray-300 text-gray-800 font-medium text-sm px-4 py-3 rounded-lg"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkOptionGroupModal;