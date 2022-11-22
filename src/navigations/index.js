import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from '../screen/login';
import Register from '../screen/register';
import Home from '../screen/home';
import Notification from '../screen/notification';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const BottomTab = () => {
    return (
      <Tab.Navigator screenOptions={{headerShown: false}}>
            <Tab.Screen name="Home" component={Home} options={{
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
            <Tab.Screen name="Notification" component={Notification} options={{
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
        <Stack.Screen name="Login" component={Login} screenOptions={{animationEnabled:false}} />
        <Stack.Screen name="Register" component={Register} screenOptions={{animationEnabled:false}}/>
        <Stack.Screen name="BottomTab" component={BottomTab}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Index;