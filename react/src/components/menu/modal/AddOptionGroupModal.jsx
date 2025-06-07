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

const AddOptionGroupModal = ({
  showAddOptionGroupModal,
  setShowAddOptionGroupModal,
  addOptionGroupData,
  setAddOptionGroupData,
  handleAddOptionGroup,
  addOptionField,
  updateOptionField,
  isLoading
}) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowAddOptionGroupModal(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${showAddOptionGroupModal ? "block" : "hidden"}`}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu đen với độ mờ 50%
        backdropFilter: "blur(4px)", // Hiệu ứng mờ
        WebkitBackdropFilter: "blur(4px)", // Hỗ trợ Safari
      }}
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Thêm nhóm tùy chọn mới</h2>
        <input
          className="border border-gray-300 rounded-lg p-2 mb-3 w-full"
          placeholder="Tên nhóm tùy chọn"
          value={addOptionGroupData.groupName}
          onChange={(e) =>
            setAddOptionGroupData({ ...addOptionGroupData, groupName: e.target.value })
          }
        />
        {addOptionGroupData.options.map((option, index) => (
          <div key={index} className="mb-3">
            <input
              className="border border-gray-300 rounded-lg p-2 mb-1 w-full"
              placeholder="Tên tùy chọn"
              value={option.name}
              onChange={(e) => updateOptionField(index, 'name', e.target.value)}
            />
            <input
              className="border border-gray-300 rounded-lg p-2 w-full"
              placeholder="Giá (VD: 10000)"
              type="number"
              value={option.price}
              onChange={(e) => updateOptionField(index, 'price', e.target.value)}
            />
          </div>
        ))}
        <button
          onClick={addOptionField}
          className="bg-gray-200 p-2 rounded-lg mb-3 w-full text-gray-800"
        >
          + Thêm tùy chọn
        </button>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setShowAddOptionGroupModal(false)}
            className="px-4 py-2 mr-2 text-gray-600"
          >
            Hủy
          </button>
          <button
            onClick={handleAddOptionGroup}
            className="bg-green-600 px-4 py-2 rounded-lg text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Đang tải...' : 'Thêm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOptionGroupModal;