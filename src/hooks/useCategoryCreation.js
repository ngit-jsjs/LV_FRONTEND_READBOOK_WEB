import { useState } from 'react';
import categoryService from '../services/categoryService';
import { getErrorMessage } from '../services/apiClient';

export const useCategoryCreation = () => {
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catSubmitting, setCatSubmitting] = useState(false);

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) {
      alert("Vui lòng điền tên thể loại!");
      return;
    }
    setCatSubmitting(true);
    try {
      const payload = {
        name: catName.trim(),
        description: catDesc.trim()
      };
      await categoryService.createCategory(payload);
      alert('Thêm thể loại thành công!');
      setCatName('');
      setCatDesc('');
    } catch (err) {
      console.error(err);
      alert(`Lỗi khi lưu thể loại: ${getErrorMessage(err)}`);
    } finally {
      setCatSubmitting(false);
    }
  };

  return {
    catName,
    setCatName,
    catDesc,
    setCatDesc,
    catSubmitting,
    handleSaveCategory
  };
};
