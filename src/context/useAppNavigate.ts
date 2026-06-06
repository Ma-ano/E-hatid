import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

export const useAppNavigate = () => {
  const history = useHistory();

  const navigate = useCallback((path: string) => {
    history.push(path);
  }, [history]);

  const goBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return { navigate, goBack };
};

export default useAppNavigate;