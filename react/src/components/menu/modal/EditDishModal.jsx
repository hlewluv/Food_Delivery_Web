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

const EditDishModal = ({
  showEditModal,
  setShowEditModal,
  selectedDish,
  setSelectedDish,
  editDishData,
  setEditDishData,
  categories,
  setCategories,
  optionGroups,
  isLoading,
  setIsLoading,
  permissionDenied,
  setPermissionDenied,
  setShowLinkModal
}) => {
  const pickImage = (e) => {
    setIsLoading(true);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditDishData({ ...editDishData, image: reader.result });
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } else {
      setIsLoading(false);
    }
  };

  const saveDishChanges = () => {
    if (!selectedDish) return;
    const { categoryIndex, dishIndex } = selectedDish;
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].dishes[dishIndex] = { ...editDishData };
    setCategories(updatedCategories);
    setShowEditModal(false);
    setSelectedDish(null);
  };

  const deleteDish = () => {
    if (!selectedDish) return;
    const { categoryIndex, dishIndex } = selectedDish;
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].dishes.splice(dishIndex, 1);
    updatedCategories[categoryIndex].count = updatedCategories[categoryIndex].dishes.length;
    setCategories(updatedCategories);
    setShowEditModal(false);
    setSelectedDish(null);
  };

  const removeOptionGroupFromDish = (groupName) => {
    setEditDishData({
      ...editDishData,
      optionGroups: editDishData.optionGroups.filter(group => group.groupName !== groupName)
    });
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center ${showEditModal ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg overflow-hidden w-[620px] h-[620px] max-w-[90%] max-h-[90%]">
        <div className="p-5 border-b border-gray-200">
          <p className="text-lg font-semibold text-gray-800">{selectedDish ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}</p>
        </div>
        <div className="flex p-5 h-[548px]">
          <div className="flex justify-start pt-10">
            <div className="flex flex-col items-center mt-5">
              <div className="relative mb-2">
                <img
                  src={editDishData.image || 'https://via.placeholder.com/200x160'}
                  alt="Dish"
                  className="w-[200px] h-[160px] rounded-lg bg-gray-100 object-cover"
                />
                {isLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center rounded-lg">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  </div>
                )}
              </div>
              <label
                className={`border border-gray-300 rounded-lg px-3 py-2 flex items-center justify-center w-[200px] bg-${isLoading || permissionDenied ? 'gray-100' : 'white'} cursor-${isLoading || permissionDenied ? 'not-allowed' : 'pointer'}`}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={pickImage}
                  disabled={isLoading || permissionDenied}
                />
                <svg className={`w-4 h-4 mr-2 ${isLoading || permissionDenied ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6M9 19h6m-3-3v6" />
                </svg>
                <span className={`text-sm ${isLoading || permissionDenied ? 'text-gray-400' : 'text-gray-700'}`}>Đổi ảnh</span>
              </label>
            </div>
          </div>
          <div className="w-2/3 pl-10 overflow-y-auto">
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Tên món ăn</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Nhập tên món ăn"
                value={editDishData.name}
                onChange={(e) => setEditDishData({ ...editDishData, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Mô tả</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-20"
                placeholder="Nhập mô tả món ăn"
                value={editDishData.description}
                onChange={(e) => setEditDishData({ ...editDishData, description: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Giá tiền</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Nhập giá tiền"
                value={editDishData.price}
                onChange={(e) => setEditDishData({ ...editDishData, price: e.target.value })}
              />
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
              <button
                onClick={() => setEditDishData({ ...editDishData, available: !editDishData.available })}
                className={`px-4 py-1 rounded-full ${editDishData.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {editDishData.available ? 'CÓ SẴN' : 'HẾT MÓN'}
              </button>
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Nhóm tùy chọn</label>
              <div className="space-y-2">
                {editDishData.optionGroups?.length > 0 ? (
                  editDishData.optionGroups.map((group, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="text-sm text-gray-700">{group.groupName} ({group.options.length} tùy chọn)</span>
                      <button onClick={() => removeOptionGroupFromDish(group.groupName)}>
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic py-2 text-center">Chưa có nhóm tùy chọn nào</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowLinkModal(true)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 flex items-center justify-center mb-4 bg-gray-50"
            >
              <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="text-sm text-gray-700">Liên kết nhóm tùy chọn</span>
            </button>
            <div className="flex gap-3">
              <button
                onClick={saveDishChanges}
                className="flex-1 bg-green-600 text-white font-medium text-sm px-4 py-3 rounded-lg"
              >
                Lưu thay đổi
              </button>
              {selectedDish && (
                <button
                  onClick={deleteDish}
                  className="flex-1 bg-red-600 text-white font-medium text-sm px-4 py-3 rounded-lg"
                >
                  Xóa món
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDishModal;