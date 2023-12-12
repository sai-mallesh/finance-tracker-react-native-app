import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {SafeAreaView} from 'react-native';
import {globalStyles} from '../Styles';
import {getDataLocal, getObjectDataLocal, keys} from '../AsyncStorageUtils';
import {useAsyncStorageData} from '../providers/AsyncStorageDataProvider';
import {getGroupData} from '../Utils';

const LaunchScreen = ({navigation}) => {
  const {setUserMetadata, setGroupsInfo} = useAsyncStorageData();
  const fetchData = async () => {
    const sessionExists = await getDataLocal(keys.SESSION_EXISTS);
    if (sessionExists === 'true') {
      const metadata = await getObjectDataLocal(keys.USER_METADATA);
      setUserMetadata(metadata);
      if (metadata.userType === 'hybrid') {
        const groupData = await getGroupData(metadata.userId);
        setGroupsInfo(groupData);
      } else if (metadata.userType === 'local') {
        const grpData = await getObjectDataLocal(keys.GROUPS_LIST);
        setGroupsInfo(grpData);
      }
      navigation.navigate('PostAuthScreens');
    } else {
      navigation.navigate('Login');
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return <SafeAreaView style={globalStyles.mainContainer} />;
};

LaunchScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default LaunchScreen;
