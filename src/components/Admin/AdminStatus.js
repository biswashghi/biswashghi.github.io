import React from 'react';
import { statusClassName } from './adminUtils';

const AdminStatus = ({ status }) => {
  if (!status || !status.message) return null;
  return (
    <p className={statusClassName(status.state)} role="status">
      {status.message}
    </p>
  );
};

export default AdminStatus;
