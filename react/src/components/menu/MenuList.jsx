import React from 'react';
import { FaChevronDown, FaChevronRight, FaPencilAlt } from 'react-icons/fa';

const DishItem = ({ item, index, categoryIndex, onPress }) => (
  <button
    onClick={() => onPress(categoryIndex, index)}
    className="w-52 h-80 mr-10 mb-5 transition-opacity hover:opacity-80"
  >
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <img
        src={item.image}
        alt={item.name}
        className="w-52 h-40 rounded-t-lg object-cover"
      />
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
          <p className="text-green-600 font-medium mt-1">{item.price}</p>
          {item.optionGroups.length > 0 && (
            <p className="text-gray-600 text-xs mt-1 truncate">
              Option Group: {item.optionGroups[0].name} ({item.optionGroups[0].options.length} options)
            </p>
          )}
        </div>
        <div className="mt-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {item.available ? 'AVAILABLE' : 'SOLD OUT'}
          </span>
        </div>
      </div>
    </div>
  </button>
);

const MenuList = ({
  categories,
  expandedCategories,
  toggleCategory,
  handleDishPress,
  handleEditCategoryPress,
  setCategories,
}) => {
  return (
    <div className="px-4 pb-20 bg-white">
      <div className="flex justify-between items-center mb-4 mt-4">
        <h2 className="text-2xl font-semibold text-gray-800">Main Menu</h2>
      </div>
      {categories.map((category, categoryIndex) => (
        <div
          key={categoryIndex}
          className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100"
        >
          <button
            onClick={() => toggleCategory(category.name)}
            className="flex justify-between items-center p-5 w-full text-left hover:bg-gray-50"
          >
            <div className="flex items-center">
              {expandedCategories.includes(category.name) ? (
                <FaChevronDown className="mr-3 text-gray-500" />
              ) : (
                <FaChevronRight className="mr-3 text-gray-500" />
              )}
              <span className="text-lg font-medium text-gray-800">{category.name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-3">{category.count} dishes</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditCategoryPress(categoryIndex);
                }}
                className="p-1"
              >
                <FaPencilAlt className="text-gray-500" />
              </button>
            </div>
          </button>
          {expandedCategories.includes(category.name) && (
            <div className="px-5 pb-4">
              <div className="flex overflow-x-auto space-x-4 pb-5">
                {category.dishes.map((item, index) => (
                  <DishItem
                    key={index}
                    item={item}
                    index={index}
                    categoryIndex={categoryIndex}
                    onPress={handleDishPress}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuList;