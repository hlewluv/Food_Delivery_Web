import React from 'react';
import * as ApiService from '../ApiService';

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

const AddCategoryModal = ({
  showAddCategoryModal,
  setShowAddCategoryModal,
  addCategoryName,
  setAddCategoryName,
  categories,
  setCategories,
  showAddDishModal,
  addDishData,
  setAddDishData,
  isLoading,
  setIsLoading
}) => {
  const saveNewCategory = async () => {
    if (!addCategoryName.trim()) {
      alert('Tên danh mục không được để trống!');
      return;
    }
    setIsLoading(true);
    try {
      const result = await ApiService.addCategory(addCategoryName);
      setCategories(result.categories);
      if (showAddDishModal) {
        setAddDishData({ ...addDishData, category: addCategoryName.trim() });
      }
      setAddCategoryName('');
      setShowAddCategoryModal(false);
      alert('Thành công! Đã thêm danh mục mới!');
    } catch (error) {
      alert(error.message || 'Không thể thêm danh mục!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center ${showAddCategoryModal ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-5 border-b border-gray-200">
          <p className="text-xl font-semibold text-gray-800">Thêm danh mục mới</p>
        </div>
        <div className="p-5 h-[548px] flex flex-col">
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Tên danh mục</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              placeholder="Nhập tên danh mục"
              value={addCategoryName}
              onChange={(e) => setAddCategoryName(e.target.value)}
            />
          </div>
          <div className="flex gap-4 mt-auto">
            <button
              onClick={saveNewCategory}
              className="flex-1 bg-green-600 text-white font-medium text-sm px-4 py-3 rounded-lg"
            >
              Thêm
            </button>
            <button
              onClick={() => setShowAddCategoryModal(false)}
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

export default AddCategoryModal;