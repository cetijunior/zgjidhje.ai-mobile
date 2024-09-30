import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraViewScreen from './app/screens/CameraViewScreen';
import ProfileScreen from './app/screens/ProfileScreen';
import AllPicturesScreen from './app/screens/AllPicturesScreen';
import DocumentPreviewScreen from './app/screens/DocumentPreviewScreen';
import ImagePreview from './app/components/ImagePreview';
import AllDocumentsScreen from './app/screens/AllDocumentsScreen';
import './global.css';

const Stack = createNativeStackNavigator();

const defaultHeaderOptions = {
  headerShown: true,
  headerLeft: () => null, // This removes the default back button
  headerStyle: {
    backgroundColor: '#1F2937', // Dark gray background
  },
  headerTintColor: '#FFFFFF', // White text
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

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
            ...defaultHeaderOptions,
            headerTitle: 'Profile',
          }}
        />
        <Stack.Screen
          name="AllPictures"
          component={AllPicturesScreen}
          options={{
            ...defaultHeaderOptions,
            headerTitle: 'Gallery',
          }}
        />
        <Stack.Screen
          name="DocumentPreview"
          component={DocumentPreviewScreen}
          options={defaultHeaderOptions}
        />
        <Stack.Screen
          name="ImagePreview"
          component={ImagePreview}
          options={defaultHeaderOptions}
        />
        <Stack.Screen
          name="AllDocuments"
          component={AllDocumentsScreen}
          options={defaultHeaderOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
