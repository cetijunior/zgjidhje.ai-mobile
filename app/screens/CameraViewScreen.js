import React, { useState, useRef } from 'react';
import { CameraView } from 'expo-camera';
import { StyleSheet, TouchableOpacity, View, Text, Dimensions, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
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
    const [currentMode, setCurrentMode] = useState('photo');
    const [currentAIMode, setCurrentAIMode] = useState('Math');
    const cameraRef = useRef(null);
    const navigation = useNavigation();
    const [scanArea, setScanArea] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const modes = [
        { key: 'document', icon: 'document-text-outline' },
        { key: 'photo', icon: 'camera-outline' },
    ];

    const AImodes = [
        { key: 'math', icon: 'calculator', label: 'Math' },
        { key: 'science', icon: 'flask', label: 'Science' },
        { key: 'history', icon: 'book', label: 'History' },
        { key: 'literature', icon: 'library', label: 'Literature' },
        { key: 'language', icon: 'language', label: 'Language' },
    ];

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 1,
            });
            navigation.navigate('ImageEdit', {
                imageUri: photo.uri,
                aiMode: currentAIMode,
                scanArea: scanArea
            });
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            navigation.navigate('ImageEdit', {
                imageUri: result.assets[0].uri,
                aiMode: currentAIMode,
                scanArea: scanArea
            });
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
            scanAreaStyle = tw`absolute -mt-10 w-[${width}px] h-[${height}px] border-2 border-white rounded-lg left-[${(screenWidth - width) / 2}px] top-[${(screenHeight - height) / 2}px]`;
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
                                onPress={() => setCurrentAIMode(mode.label)}
                                style={tw`mx-4 items-center`}
                            >
                                <View style={tw`${currentAIMode === mode.label ? 'bg-white rounded-full p-1' : ''}`}>
                                    <Ionicons
                                        name={mode.icon}
                                        size={24}
                                        color={currentAIMode === mode.label ? 'black' : 'white'}
                                    />
                                </View>
                                <Text style={tw`text-xs mt-1 text-white`}>
                                    {mode.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <CameraControls
                        currentMode={currentMode}
                        currentAIMode={currentAIMode}
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
            aiMode={currentAIMode}
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