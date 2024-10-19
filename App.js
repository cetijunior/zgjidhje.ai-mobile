import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SubscriptionScreen from './app/screens/SubscriptionScreen';
import CameraViewScreen from './app/screens/CameraViewScreen';
import ProfileScreen from './app/screens/ProfileScreen';
import AllPicturesScreen from './app/screens/AllPicturesScreen';
import DocumentPreviewScreen from './app/screens/DocumentPreviewScreen';
import ImagePreview from './app/components/ImagePreview';
import AllSavedItemsScreen from './app/screens/AllSavedItemsScreen';
import QuickAIQuestionScreen from './app/screens/QuickAIQuestionScreen';
import CalculatorScreen from './app/screens/CalculatorScreen';
import SavedItemsScreen from './app/screens/SavedItemsScreen';
import './global.css';
import ImageEditScreen from './app/screens/ImageEditScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

const defaultHeaderOptions = {
  headerShown: true,
  headerLeft: () => null, // This removes the default back button
  headerStyle: {
    backgroundColor: '#4F46E5', // Indigo-600 background
  },
  headerTintColor: '#FFFFFF', // White text
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Subscription">
          <Stack.Screen
            name="Subscription"
            component={SubscriptionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CameraView"
            component={CameraViewScreen}
            options={{ 
              headerShown: false, 
              gestureEnabled: false // Disable back swipe
            }}
          />
          <Stack.Screen
            name="ImageEdit"
            component={ImageEditScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              ...defaultHeaderOptions,
              headerTitle: 'Profile',
              gestureEnabled: false // Disable back swipe
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
            name="AllSavedItems"
            component={AllSavedItemsScreen}
            options={{
              ...defaultHeaderOptions,
              headerTitle: 'All Saved Items',
            }}
          />
          <Stack.Screen
            name="QuickAIQuestion"
            component={QuickAIQuestionScreen}
            options={{
              ...defaultHeaderOptions,
              headerTitle: 'Questions',
              headerBackTitle: 'Camera',
            }}
          />
          <Stack.Screen
            name="Calculator"
            component={CalculatorScreen}
            options={{
              ...defaultHeaderOptions,
              headerTitle: 'Calculator',
              headerBackTitle: 'Camera',
            }}
          />
          <Stack.Screen
            name="SavedItems"
            component={SavedItemsScreen}
            options={{
              ...defaultHeaderOptions,
              headerTitle: 'Saved Item',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
