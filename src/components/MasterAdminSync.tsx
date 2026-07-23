import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { syncMasterAdminRole } from '../utils/masterAdmin';

const MasterAdminSync: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id && user?.email) {
      syncMasterAdminRole(user.id, user.email);
    }
  }, [user?.id, user?.email]);

  return null;
};

export default MasterAdminSync;
