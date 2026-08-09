import React from 'react';
import { FiUser } from 'react-icons/fi';
import authorService from '../../services/authorService';
import NamedEntityAdminPage from '../../components/NamedEntityAdmin/NamedEntityAdminPage';

function AuthorsPage({ isSubComponent = false }) {
  return (
    <NamedEntityAdminPage
      isSubComponent={isSubComponent}
      service={authorService}
      label="tác giả"
      icon={FiUser}
      title="Quản lý tác giả"
      subtitle="Thêm, sửa, xóa và cấu hình các tác giả trong hệ thống"
      editTitle="Sửa thông tin tác giả"
      editSubtitle="Chỉnh sửa tên của tác giả"
    />
  );
}

export default AuthorsPage;
