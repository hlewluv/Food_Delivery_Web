import React from 'react';
import { FaChevronDown, FaChevronRight, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';

const OptionGroupsList = ({
  optionGroups,
  expandedOptionGroups,
  toggleOptionGroup,
  handleEditOptionGroup,
  setOptionGroups,
  setCategories,
}) => {
  const handleDeleteOptionGroup = (groupIndex) => {
    if (window.confirm('Are you sure you want to delete this option group? It will be removed from all linked dishes.')) {
      const groupNameToDelete = optionGroups[groupIndex].groupName;
      const updatedOptionGroups = optionGroups.filter((_, index) => index !== groupIndex);
      setOptionGroups(updatedOptionGroups);
      setCategories((prevCategories) =>
        prevCategories.map((category) => ({
          ...category,
          dishes: category.dishes.map((dish) => ({
            ...dish,
            optionGroups: dish.optionGroups.filter(
              (group) => group.groupName !== groupNameToDelete
            ),
          })),
        }))
      );
      alert('Option group deleted successfully!');
    }
  };

  return (
    <div className="px-4 pb-20">
      <div className="flex justify-between items-center mb-4 mt-2">
        <h2 className="text-2xl font-semibold text-gray-800">Option Groups</h2>
      </div>
      {optionGroups.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className="mb-4 bg-white rounded-lg shadow-sm border border-gray-100"
        >
          <button
            onClick={() => toggleOptionGroup(group.groupName)}
            className="flex justify-between items-center p-5 w-full text-left hover:bg-gray-50"
          >
            <div className="flex items-center">
              {expandedOptionGroups.includes(group.groupName) ? (
                <FaChevronDown className="mr-3 text-gray-500" />
              ) : (
                <FaChevronRight className="mr-3 text-gray-500" />
              )}
              <span className="text-lg font-medium text-gray-800">{group.groupName}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-3">{group.options.length} options</span>
              <div className="flex">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditOptionGroup(groupIndex);
                  }}
                  className="p-1 mr-2"
                >
                  <FaPencilAlt className="text-blue-500" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteOptionGroup(groupIndex);
                  }}
                  className="p-1"
                >
                  <FaTrashAlt className="text-red-500" />
                </button>
              </div>
            </div>
          </button>
          {expandedOptionGroups.includes(group.groupName) && (
            <div className="px-5 pb-3">
              {group.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className="p-3 mb-3 border-t border-gray-100 flex justify-between"
                >
                  <span className="text-gray-800">{option.name}</span>
                  <span className="text-green-600">{option.price} VNĐ</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OptionGroupsList;