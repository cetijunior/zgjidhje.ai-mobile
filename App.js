import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraViewScreen from './app/screens/CameraViewScreen';
import ProfileScreen from './app/screens/ProfileScreen';
import AllPicturesScreen from './app/screens/AllPicturesScreen';
import './global.css';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CameraView">
        <Stack.Screen
          name="CameraView"
          component={CameraViewScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: true,
            headerLeft: () => null, // This removes the default back button
            headerStyle: {
              backgroundColor: '#1F2937', // Dark gray background
            },
            headerTintColor: '#FFFFFF', // White text
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitle: 'Camera',
          }}
        />
        <Stack.Screen
          name="AllPictures"
          component={AllPicturesScreen}
          options={{
            headerShown: true,
            headerLeft: () => null, // This removes the default back button
            headerStyle: {
              backgroundColor: '#1F2937', // Dark gray background
            },
            headerTintColor: '#FFFFFF', // White text
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitle: 'Profile',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
