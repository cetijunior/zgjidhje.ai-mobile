import React, { useState, useRef, useCallback } from 'react';
import { CameraView } from 'expo-camera';
import { StyleSheet, TouchableOpacity, View, Text, Image, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync } from 'expo-image-manipulator';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import CameraControls from '../components/CameraControls';
import ImagePreview from '../components/ImagePreview';
import ModeSwitcher from '../components/ModeSwitcher';
import ScanArea from '../components/ScanArea';

export default function CameraViewScreen() {
    const [facing, setFacing] = useState('back');
    const [capturedImage, setCapturedImage] = useState(null);
    const [currentMode, setCurrentMode] = useState('document');
    const [savedItems, setSavedItems] = useState([]);
    const [currentAIMode, setCurrentAIMode] = useState('Math');
    const cameraRef = useRef(null);
    const navigation = useNavigation();
    const [scanArea, setScanArea] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const modes = [
        { key: 'document', icon: 'document-text-outline' },
        { key: 'photo', icon: 'camera-outline' },
    ];

    const AImodes = [
        { key: 'math', icon: 'calculator-outline', label: 'Math' },
        { key: 'science', icon: 'flask-outline', label: 'Science' },
        { key: 'history', icon: 'book-outline', label: 'History' },
        { key: 'literature', icon: 'library-outline', label: 'Literature' },
        { key: 'language', icon: 'language-outline', label: 'Language' },
    ];

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 1,
            });
            setCapturedImage(photo);
        }
    };

    const saveItem = async () => {
        if (capturedImage) {
            try {
                // Generate a unique filename
                const fileName = `image_${Date.now()}.jpg`;
                const newPath = `${FileSystem.documentDirectory}${fileName}`;

                // Copy the file to app's document directory
                await FileSystem.copyAsync({
                    from: capturedImage.uri,
                    to: newPath
                });

                // Load existing saved pictures
                const savedPicturesJSON = await AsyncStorage.getItem('savedPictures');
                const savedPictures = savedPicturesJSON ? JSON.parse(savedPicturesJSON) : [];

                // Add new picture to the array
                const newPicture = { id: Date.now().toString(), uri: newPath };
                const updatedPictures = [...savedPictures, newPicture];

                // Save updated array back to AsyncStorage
                await AsyncStorage.setItem('savedPictures', JSON.stringify(updatedPictures));

                console.log('Picture saved successfully');
                setCapturedImage(null);

                // Navigate to Profile screen after saving
                navigation.navigate('Profile');

            } catch (error) {
                console.error('Error saving picture:', error);
            }
        }
    };

    const loadSavedItems = useCallback(async () => {
        try {
            const savedItemsJSON = await AsyncStorage.getItem('profileImages');
            return savedItemsJSON ? JSON.parse(savedItemsJSON) : [];
        } catch (error) {
            console.error('Error loading saved items:', error);
            return [];
        }
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setCapturedImage(result.assets[0]);
            if (currentMode === 'document') {
                // Process the picked image as a document
                const processedImage = await manipulateAsync(
                    result.assets[0].uri,
                    [{ resize: { width: 1000 } }],
                    { format: 'jpeg' }
                );
                const visionResult = await Vision.textRecognizer.process(processedImage.uri);
                const documentData = {
                    id: Date.now().toString(),
                    uri: result.assets[0].uri,
                    type: 'document',
                    text: visionResult.text
                };
                navigation.navigate('DocumentViewer', { document: documentData });
            }
        }
    };

    const renderCamera = () => {
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;

        let scanAreaStyle;
        if (currentMode === 'document') {
            const width = screenWidth * 0.7;
            const height = width * (16 / 9);
            scanAreaStyle = tw`absolute -mt-10 w-[${width}px] h-[${height}px] border-2 border-white rounded-lg left-[${(screenWidth - width) / 2}px] top-[${(screenHeight - height) / 2}px]`;
        } else {
            const height = screenHeight * 0.5;
            const width = height * (3 / 4);
            scanAreaStyle = tw`absolute w-[${width}px] h-[${height}px] border-2 border-white rounded-lg left-[${(screenWidth - width) / 2}px] top-[${(screenHeight - height) / 2}px]`;
        }

        return (
            <CameraView ref={cameraRef} style={tw`flex-1`} facing={facing}>
                <View style={tw`flex-1 bg-transparent justify-between`}>
                    <ModeSwitcher currentMode={currentMode} toggleMode={() => setCurrentMode(currentMode === 'document' ? 'photo' : 'document')} currentAIMode={currentAIMode} />
                    <ScanArea style={scanAreaStyle} />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={tw`justify-center items-center px-4 py-2`}
                        style={tw`absolute bottom-30 left-0 right-0`}
                    >
                        {AImodes.map((mode) => (
                            <TouchableOpacity
                                key={mode.key}
                                onPress={() => {
                                    console.log(`Selected ${mode.label} mode`);
                                    setCurrentAIMode(mode.label);
                                }}
                                style={tw`mx-4 items-center`}
                            >
                                <Ionicons
                                    name={mode.icon}
                                    size={24}
                                    color="white"
                                />
                                <Text style={tw`text-xs mt-1 text-white`}>
                                    {mode.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <CameraControls
                        currentMode={currentMode}
                        toggleFacing={() => setFacing(facing === 'back' ? 'front' : 'back')}
                        takePicture={takePicture}
                        pickImage={pickImage}
                    />
                </View>
            </CameraView>
        );
    };

    const renderImagePreview = () => (
        <ImagePreview
            capturedImage={capturedImage}
            onRetake={() => setCapturedImage(null)}
            onSave={saveItem}
        />
    );

    return (
        <View style={styles.container}>
            {capturedImage ? renderImagePreview() : renderCamera()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});