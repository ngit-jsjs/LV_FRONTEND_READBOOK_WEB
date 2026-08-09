import React from 'react';
import { FiBookmark } from 'react-icons/fi';
import publisherService from '../../services/publisherService';
import NamedEntityAdminPage from '../../components/NamedEntityAdmin/NamedEntityAdminPage';

function PublishersPage({ isSubComponent = false }) {
  return (
    <NamedEntityAdminPage
      isSubComponent={isSubComponent}
      service={publisherService}
      label="nhà xuất bản"
      icon={FiBookmark}
      title="Quản lý nhà xuất bản"
      subtitle="Thêm, sửa, xóa và cấu hình các nhà xuất bản trong hệ thống"
      editTitle="Sửa thông tin NXB"
      editSubtitle="Chỉnh sửa tên của nhà xuất bản"
    />
  );
}

export default PublishersPage;
