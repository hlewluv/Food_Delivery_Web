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

const AddDishModal = ({
  showAddDishModal,
  setShowAddDishModal,
  addDishData,
  setAddDishData,
  categories,
  setCategories,
  isLoading,
  setIsLoading,
  permissionDenied,
  setPermissionDenied,
  setShowAddCategoryModal
}) => {
  const pickImage = (e) => {
    setIsLoading(true);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAddDishData({ ...addDishData, image: reader.result });
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } else {
      setIsLoading(false);
    }
  };

  const saveNewDish = async () => {
    if (
      !addDishData.name ||
      !addDishData.price ||
      !addDishData.category ||
      addDishData.category === 'add_new_category'
    ) {
      alert('Vui lòng điền đầy đủ tên món, giá và chọn danh mục hợp lệ!');
      return;
    }
    setIsLoading(true);
    try {
      const result = await ApiService.addDish(addDishData);
      setCategories(result.categories);
      setAddDishData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500',
        optionGroups: [],
        available: false
      });
      setShowAddDishModal(false);
      alert('Thành công! Đã thêm món ăn mới!');
    } catch (error) {
      alert('Lỗi! Không thể thêm món ăn!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center ${showAddDishModal ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg overflow-hidden w-[620px] h-[620px] max-w-[90%] max-h-[90%]">
        <div className="p-5 border-b border-gray-200">
          <p className="text-lg font-semibold text-gray-800">Thêm món ăn mới</p>
        </div>
        <div className="flex p-5 h-[548px]">
          <div className="w-1/3 pr-4 flex justify-start pt-10">
            <div className="flex flex-col items-center mt-5">
              <div className="relative mb-2">
                <img
                  src={addDishData.image || 'https://via.placeholder.com/200x160'}
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
                <span className={`text-sm ${isLoading || permissionDenied ? 'text-gray-400' : 'text-gray-700'}`}>Chọn ảnh</span>
              </label>
            </div>
          </div>
          <div className="w-2/3 pl-4 overflow-y-auto">
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Tên món ăn</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Nhập tên món ăn"
                value={addDishData.name}
                onChange={(e) => setAddDishData({ ...addDishData, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Mô tả</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-20"
                placeholder="Nhập mô tả món ăn"
                value={addDishData.description}
                onChange={(e) => setAddDishData({ ...addDishData, description: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Giá tiền</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Nhập giá tiền"
                value={addDishData.price}
                onChange={(e) => setAddDishData({ ...addDishData, price: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Danh mục</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={addDishData.category}
                onChange={(e) => {
                  if (e.target.value === 'add_new_category') {
                    setShowAddCategoryModal(true);
                    setAddDishData({ ...addDishData, category: '' });
                  } else {
                    setAddDishData({ ...addDishData, category: e.target.value });
                  }
                }}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.name}>{category.name}</option>
                ))}
                <option value="add_new_category">Thêm danh mục mới</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveNewDish}
                className="flex-1 bg-green-600 text-white font-medium text-sm px-4 py-3 rounded-lg"
              >
                Thêm món
              </button>
              <button
                onClick={() => setShowAddDishModal(false)}
                className="flex-1 bg-gray-500 text-white font-medium text-sm px-4 py-3 rounded-lg"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDishModal;