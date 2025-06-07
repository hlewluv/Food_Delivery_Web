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

const EditOptionGroupModal = ({
  showEditOptionGroupModal,
  setShowEditOptionGroupModal,
  selectedOptionGroup,
  setSelectedOptionGroup,
  editOptionGroupData,
  setEditOptionGroupData,
  optionGroups,
  setOptionGroups,
  categories,
  setCategories
}) => {
  const saveOptionGroupChanges = () => {
    if (!editOptionGroupData.groupName.trim()) {
      alert('Tên nhóm tùy chọn không được để trống!');
      return;
    }
    if (selectedOptionGroup === null) return;
    const updatedOptionGroups = [...optionGroups];
    updatedOptionGroups[selectedOptionGroup] = { ...editOptionGroupData };
    setOptionGroups(updatedOptionGroups);
    const updatedCategories = [...categories];
    updatedCategories.forEach((category) => {
      category.dishes.forEach((dish) => {
        dish.optionGroups = dish.optionGroups.map((group) =>
          group.groupName === editOptionGroupData.groupName ? editOptionGroupData : group
        );
      });
    });
    setCategories(updatedCategories);
    setShowEditOptionGroupModal(false);
    setSelectedOptionGroup(null);
    setEditOptionGroupData({ groupName: '', options: [] });
    alert('Thành công! Đã lưu thay đổi nhóm tùy chọn!');
  };

  const addNewOptionToGroup = () => {
    setEditOptionGroupData({
      ...editOptionGroupData,
      options: [...editOptionGroupData.options, { name: '', price: '' }]
    });
  };

  const updateOptionInGroup = (index, field, value) => {
    const updatedOptions = [...editOptionGroupData.options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setEditOptionGroupData({ ...editOptionGroupData, options: updatedOptions });
  };

  const removeOptionFromGroup = (index) => {
    const updatedOptions = editOptionGroupData.options.filter((_, i) => i !== index);
    setEditOptionGroupData({ ...editOptionGroupData, options: updatedOptions });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowEditOptionGroupModal(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${showEditOptionGroupModal ? "block" : "hidden"}`}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu đen với độ mờ 50%
        backdropFilter: "blur(4px)", // Hiệu ứng mờ
        WebkitBackdropFilter: "blur(4px)", // Hỗ trợ Safari
      }}
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg overflow-hidden w-[620px] h-[620px] max-w-[90%] max-h-[90%]">
        <div className="p-5 border-b border-gray-200">
          <p className="text-xl font-semibold text-gray-800">Chỉnh sửa nhóm tùy chọn</p>
        </div>
        <div className="p-5 h-[548px] flex flex-col">
          <div className="overflow-y-auto flex-1">
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Tên nhóm tùy chọn</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                placeholder="Nhập tên nhóm tùy chọn"
                value={editOptionGroupData.groupName}
                onChange={(e) => setEditOptionGroupData({ ...editOptionGroupData, groupName: e.target.value })}
              />
            </div>
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Tùy chọn</label>
              <div className="space-y-3">
                {editOptionGroupData.options.map((option, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-800">Tùy chọn {index + 1}</span>
                      <button onClick={() => removeOptionFromGroup(index)}>
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm mb-2"
                      placeholder="Tên tùy chọn"
                      value={option.name}
                      onChange={(e) => updateOptionInGroup(index, 'name', e.target.value)}
                    />
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      placeholder="Giá (VNĐ)"
                      value={option.price}
                      onChange={(e) => updateOptionInGroup(index, 'price', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={addNewOptionToGroup}
              className="border border-gray-300 rounded-lg px-3 py-2 flex items-center justify-center mb-6"
            >
              <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-gray-800 text-sm">Thêm tùy chọn mới</span>
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={saveOptionGroupChanges}
              className="flex-1 bg-green-600 text-white font-medium text-sm px-4 py-3 rounded-lg"
            >
              Lưu
            </button>
            <button
              onClick={() => setShowEditOptionGroupModal(false)}
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

export default EditOptionGroupModal;