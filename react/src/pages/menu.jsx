import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MenuList from '../components/menu/MenuList';
import OptionGroupsList from '../components/menu/OptionGroupsList';
import Modals from '../components/menu/Modals';
import AddOptionGroupModal from '../components/menu/modal/AddOptionGroupModal';
import * as ApiService from '../components/menu/ApiService';

const MenuScreen = () => {
  const [selectedTab, setSelectedTab] = useState('Có sẵn');
  const [categories, setCategories] = useState([]);
  const [optionGroups, setOptionGroups] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [expandedOptionGroups, setExpandedOptionGroups] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showEditOptionGroupModal, setShowEditOptionGroupModal] = useState(false);
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddOptionGroupModal, setShowAddOptionGroupModal] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOptionGroup, setSelectedOptionGroup] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editDishData, setEditDishData] = useState({
    name: '',
    description: '',
    price: '',
    available: true,
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500',
    optionGroups: [],
  });
  const [editOptionGroupData, setEditOptionGroupData] = useState({
    groupName: '',
    options: [],
  });
  const [addDishData, setAddDishData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500',
    optionGroups: [],
  });
  const [addCategoryName, setAddCategoryName] = useState('');
  const [addOptionGroupData, setAddOptionGroupData] = useState({
    groupName: '',
    options: [{ name: '', price: '' }],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchedCategories = await ApiService.fetchCategories();
        const fetchedOptionGroups = await ApiService.fetchOptionGroups();
        setCategories(fetchedCategories);
        setOptionGroups(fetchedOptionGroups);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleCategory = (categoryName) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const toggleOptionGroup = (groupName) => {
    setExpandedOptionGroups((prev) =>
      prev.includes(groupName)
        ? prev.filter((name) => name !== groupName)
        : [...prev, groupName]
    );
  };

  const handleDishPress = (categoryIndex, dishIndex) => {
    const dish = categories[categoryIndex].dishes[dishIndex];
    setSelectedDish({ categoryIndex, dishIndex });
    setEditDishData({ ...dish });
    setShowEditModal(true);
  };

  const handleEditCategoryPress = (categoryIndex) => {
    setSelectedCategory(categoryIndex);
    setEditCategoryName(categories[categoryIndex].name);
    setShowEditCategoryModal(true);
  };

  const handleEditOptionGroup = (groupIndex) => {
    setSelectedOptionGroup(groupIndex);
    setEditOptionGroupData({ ...optionGroups[groupIndex] });
    setShowEditOptionGroupModal(true);
  };

  const handleAddOptionGroup = async () => {
    if (
      !addOptionGroupData.groupName ||
      addOptionGroupData.options.some((opt) => !opt.name || !opt.price)
    ) {
      alert('Vui lòng điền tên nhóm và ít nhất một tùy chọn hợp lệ');
      return;
    }
    setIsLoading(true);
    try {
      const result = await ApiService.addOptionGroup(addOptionGroupData);
      setOptionGroups(result.optionGroups);
      setAddOptionGroupData({ groupName: '', options: [{ name: '', price: '' }] });
      setShowAddOptionGroupModal(false);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert('Không thể thêm nhóm tùy chọn');
    } finally {
      setIsLoading(false);
    }
  };

  const addOptionField = () => {
    setAddOptionGroupData({
      ...addOptionGroupData,
      options: [...addOptionGroupData.options, { name: '', price: '' }],
    });
  };

  const updateOptionField = (index, field, value) => {
    const newOptions = [...addOptionGroupData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setAddOptionGroupData({ ...addOptionGroupData, options: newOptions });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center p-2 bg-white">
        <h1 className="flex-1 text-center text-xl font-bold text-gray-900">
          Menu
        </h1>
      </div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {['Có sẵn', 'Tuỳ chọn nhóm'].map((tab) => (
          <button
            key={tab}
            className={`flex-1 p-3 pb-3 text-center text-xl font-medium ${
              selectedTab === tab
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-800'
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Add Button Section - Cải tiến */}
        {selectedTab === 'Có sẵn' && (
          <div className="flex justify-between items-center px-6 py-4 bg-white/70 backdrop-blur-sm ">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Danh sách món ăn</h2>
              <p className="text-sm text-gray-500 mt-1">Quản lý các món ăn trong menu của bạn</p>
            </div>
            <button
              onClick={() => setShowAddDishModal(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 p-4 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
            >
              <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        )}

        {selectedTab === 'Tuỳ chọn nhóm' && (
          <div className="flex justify-between items-center px-6 py-4 bg-white/70 backdrop-blur-sm border-b border-gray-200/50">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Nhóm tùy chọn</h2>
              <p className="text-sm text-gray-500 mt-1">Quản lý các tùy chọn bổ sung cho món ăn</p>
            </div>
            <button
              onClick={() => setShowAddOptionGroupModal(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 p-4 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
            >
              <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        )}

        {/* Content Container */}
        <div className="p-4 space-y-4">
          {selectedTab === 'Có sẵn' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
              <MenuList
                categories={categories}
                expandedCategories={expandedCategories}
                toggleCategory={toggleCategory}
                handleDishPress={handleDishPress}
                handleEditCategoryPress={handleEditCategoryPress}
                setCategories={setCategories}
              />
            </div>
          )}

          {selectedTab === 'Tuỳ chọn nhóm' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
              <OptionGroupsList
                optionGroups={optionGroups}
                expandedOptionGroups={expandedOptionGroups}
                toggleOptionGroup={toggleOptionGroup}
                handleEditOptionGroup={handleEditOptionGroup}
                setOptionGroups={setOptionGroups}
                setCategories={setCategories}
              />
            </div>
          )}
        </div>
      </div>
      {/* Modals */}
      <Modals
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        showEditCategoryModal={showEditCategoryModal}
        setShowEditCategoryModal={setShowEditCategoryModal}
        showEditOptionGroupModal={showEditOptionGroupModal}
        setShowEditOptionGroupModal={setShowEditOptionGroupModal}
        showAddDishModal={showAddDishModal}
        setShowAddDishModal={setShowAddDishModal}
        showAddCategoryModal={showAddCategoryModal}
        setShowAddCategoryModal={setShowAddCategoryModal}
        selectedDish={selectedDish}
        setSelectedDish={setSelectedDish}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedOptionGroup={selectedOptionGroup}
        setSelectedOptionGroup={setSelectedOptionGroup}
        editDishData={editDishData}
        setEditDishData={setEditDishData}
        editCategoryName={editCategoryName}
        setEditCategoryName={setEditCategoryName}
        editOptionGroupData={editOptionGroupData}
        setEditOptionGroupData={setEditOptionGroupData}
        addDishData={addDishData}
        setAddDishData={setAddDishData}
        addCategoryName={addCategoryName}
        setAddCategoryName={setAddCategoryName}
        categories={categories}
        setCategories={setCategories}
        optionGroups={optionGroups}
        setOptionGroups={setOptionGroups}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        permissionDenied={permissionDenied}
        setPermissionDenied={setPermissionDenied}
      />
      <AddOptionGroupModal
        showAddOptionGroupModal={showAddOptionGroupModal}
        setShowAddOptionGroupModal={setShowAddOptionGroupModal}
        addOptionGroupData={addOptionGroupData}
        setAddOptionGroupData={setAddOptionGroupData}
        handleAddOptionGroup={handleAddOptionGroup}
        addOptionField={addOptionField}
        updateOptionField={updateOptionField}
        isLoading={isLoading}
      />
    </div>
  );
};

export default MenuScreen;