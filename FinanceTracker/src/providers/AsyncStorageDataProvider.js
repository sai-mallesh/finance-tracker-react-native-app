import React, {
  createContext,
  useContext,
  useState,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

const AsyncStorageDataContext = createContext();

export const AsyncStorageDataProvider = ({children}) => {
  const [groupsInfo, setGroupsInfo] = useState([]);

  const [userMetadata, setUserMetadata] = useState({
    name: '',
    email: '',
    userId: '',
    userType: '',
    currency: '',
    spendings: '',
  });

  const contextValue = useMemo(() => {
    return {
      groupsInfo,
      setGroupsInfo,
      userMetadata,
      setUserMetadata,
    };
  }, [groupsInfo, userMetadata]);

  return (
    <AsyncStorageDataContext.Provider value={contextValue}>
      {children}
    </AsyncStorageDataContext.Provider>
  );
};

AsyncStorageDataProvider.propTypes = {
  children: PropTypes.any.isRequired,
};

export const useAsyncStorageData = () => {
  return useContext(AsyncStorageDataContext);
};
