import React from 'react';

// Define interfaces
const Dish = {
  name: String,
  description: String,
  price: String,
  available: Boolean,
  image: String,
  optionGroups: Array,
  category: String
};

const Category = {
  name: String,
  count: Number,
  dishes: [Dish]
};

const EditCategoryModal = ({
  showEditCategoryModal,
  setShowEditCategoryModal,
  selectedCategory,
  setSelectedCategory,
  editCategoryName,
  setEditCategoryName,
  categories,
  setCategories
}) => {
  const saveCategoryChanges = () => {
    if (!editCategoryName.trim()) {
      alert('Tên danh mục không được để trống!');
      return;
    }
    if (selectedCategory === null) return;
    const updatedCategories = [...categories];
    updatedCategories[selectedCategory].name = editCategoryName.trim();
    setCategories(updatedCategories);
    setShowEditCategoryModal(false);
    setSelectedCategory(null);
    setEditCategoryName('');
  };

  const deleteCategory = () => {
    if (selectedCategory === null) return;
    if (categories[selectedCategory].count > 0) {
      alert('Chỉ có thể xóa danh mục khi không còn món ăn nào!');
      return;
    }
    const updatedCategories = categories.filter((_, index) => index !== selectedCategory);
    setCategories(updatedCategories);
    setShowEditCategoryModal(false);
    setSelectedCategory(null);
    setEditCategoryName('');
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center ${showEditCategoryModal ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg overflow-hidden w-[620px] h-[620px] max-w-[90%] max-h-[90%]">
        <div className="p-5 border-b border-gray-200">
          <p className="text-xl font-semibold text-gray-800">Chỉnh sửa danh mục</p>
        </div>
        <div className="p-5 h-[548px] flex flex-col">
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Tên danh mục</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              placeholder="Nhập tên danh mục"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
            />
          </div>
          <div className="flex gap-4 mt-auto">
            <button
              onClick={saveCategoryChanges}
              className="flex-1 bg-green-600 text-white font-medium text-sm px-4 py-3 rounded-lg"
            >
              Lưu
            </button>
            <button
              onClick={deleteCategory}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium ${selectedCategory !== null && categories[selectedCategory]?.count === 0 ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
              disabled={selectedCategory !== null && categories[selectedCategory]?.count > 0}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;