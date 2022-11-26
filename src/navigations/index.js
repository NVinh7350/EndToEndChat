import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from '../screen/login';
import Register from '../screen/register';
import Chats from '../screen/chats';
import Invitations from '../screen/invitations';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Search from '../screen/search';
import Profile from '../screen/profile';
import Setting from '../screen/setting';
import EncryptSetting from '../screen/setting/encryptSetting';
import ChatRoom from '../screen/chatRoom';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const BottomTab = () => {
    return (
      <Tab.Navigator screenOptions={{headerShown: false}}>
            <Tab.Screen name="Chats" component={Chats} options={{
                tabBarIcon: ({color, size}) => {
                    return (
                        <Icon name='chat' size={size} color={color}></Icon>
                    )
                },
                tabBarLabel: 'Trò chuyện',
                tabBarLabelStyle:{
                    fontSize:16,
                },
                tabBarStyle:{
                    height:50,
                }
            }}/>
            <Tab.Screen name="Invitations" component={Invitations} options={{
                tabBarIcon: ({color, size}) => {
                    return (
                        <Icon name='bell' size={size} color={color}></Icon>
                    )
                },
                tabBarLabel: 'Thông báo',
                tabBarLabelStyle:{
                    fontSize:16,
                },
                tabBarStyle:{
                    height:50,
                }
            }}/>
        </Tab.Navigator>
    )
}

function Index() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown:false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register}/>
        <Stack.Screen name="BottomTab" component={BottomTab}/>
        <Stack.Screen name="Seach" component={Search}/>
        <Stack.Screen name="Profile" component={Profile}/>
        <Stack.Screen name="Setting" component={Setting} screenOptions={{headerShown:true}}/>
        <Stack.Screen name="EncryptSetting" component={EncryptSetting}/>
        <Stack.Screen name="ChatRoom" component={ChatRoom}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Index;