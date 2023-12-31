import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import AccountScreen from '../screens/AccountScreen';
//import TransactionScreen from '../screens/TransactionScreen';
import GroupScreen from '../screens/GroupScreen';
import GroupListScreen from '../screens/GroupListScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GroupSettingsScreen from '../screens/GroupSettingsScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

const GroupStackScreens = () => (
  <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Group List">
    <Stack.Screen name="Group List" component={GroupListScreen} initialParams={{ rerender: false }} />
    <Stack.Screen name="Group Screen" component={GroupScreen} />
    <Stack.Screen name="Group Settings" component={GroupSettingsScreen}  />
  </Stack.Navigator>
);

const BottomTabNavigator = () => {
  const getTabBarIcon = (route, focused, color) => {
    let iconName;
    if (route.name === 'Home') {
      iconName = focused ? 'home' : 'home-outline';
    } else if (route.name === 'Group') {
      iconName = focused ? 'account-group' : 'account-group-outline';
    } else if (route.name === 'Transaction') {
      iconName = focused ? 'wallet' : 'wallet-outline';
    } else if (route.name === 'Learn') {
      iconName = focused ? 'book-sharp' : 'book-outline';
    } else if (route.name === 'Account') {
      iconName = focused ? 'account-circle' : 'account-circle-outline';
    }

    return <MaterialCommunityIcons name={iconName} size={25} color={color} />;
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color}) => getTabBarIcon(route, focused, color),
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          padding: 10,
          height: 65,
        },
        tabBarActiveTintColor: '#0E8388',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: {paddingBottom: 10, fontSize: 10},
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Group" component={GroupStackScreens} />
      {/* <Tab.Screen name="Transaction" component={TransactionScreen} /> */}
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
