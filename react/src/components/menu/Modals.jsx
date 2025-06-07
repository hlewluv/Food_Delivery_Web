import React, { useState } from 'react';
import EditDishModal from './modal/EditDishModal';
import AddDishModal from './modal/AddDishModal';
import EditCategoryModal from './modal/EditCategoryModal';
import AddCategoryModal from './modal/AddCategoryModal';
import LinkOptionGroupModal from './modal/LinkOptionGroupModal';
import EditOptionGroupModal from './modal/EditOptionGroupModal';

const Modals = (props) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedCategoryForLink, setSelectedCategoryForLink] = useState('');

  return (
    <>
      <EditDishModal {...props} showLinkModal={showLinkModal} setShowLinkModal={setShowLinkModal} />
      <AddDishModal {...props} />
      <EditCategoryModal {...props} />
      <AddCategoryModal {...props} />
      <LinkOptionGroupModal
        {...props}
        showLinkModal={showLinkModal}
        setShowLinkModal={setShowLinkModal}
        selectedCategoryForLink={selectedCategoryForLink}
        setSelectedCategoryForLink={setSelectedCategoryForLink}
      />
      <EditOptionGroupModal {...props} />
    </>
  );
};

export default Modals;