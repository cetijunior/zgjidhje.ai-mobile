import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Alert, Image } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import ImageEditorComponent from '../components/ImageEditorComponent';

const ImageEditScreen = ({ route, navigation }) => {
    const { imageUri, aiMode } = route.params;
    const [isEditorVisible, setIsEditorVisible] = useState(false);
    const [editedImageUri, setEditedImageUri] = useState(null);

    const handleRetake = () => {
        navigation.navigate('CameraView');
    };

    const handleEditingComplete = async (result) => {
        setIsEditorVisible(false);
        if (result) {
            try {
                const jpegUri = `${FileSystem.cacheDirectory}edited_image_${Date.now()}.jpg`;
                await FileSystem.copyAsync({
                    from: result.uri,
                    to: jpegUri
                });
                setEditedImageUri(jpegUri);
            } catch (error) {
                console.error('Error saving edited image:', error);
                Alert.alert('Error', 'Failed to save edited image. Please try again.');
            }
        }
    };

    const handleCloseEditor = () => {
        setIsEditorVisible(false);
    };

    const handleProceed = () => {
        navigation.navigate('ImagePreview', {
            capturedImage: { uri: editedImageUri || imageUri },
            aiMode: aiMode
        });
    };

    const handleOpenEditor = () => {
        setIsEditorVisible(true);
    };

    return (
        <View style={tw`flex-1 bg-black`}>
            <Image
                source={{ uri: editedImageUri || imageUri }}
                style={tw`flex-1 w-full`}
                resizeMode="contain"
            />
            <ImageEditorComponent
                imageUri={editedImageUri || imageUri}
                isVisible={isEditorVisible}
                onEditingComplete={handleEditingComplete}
                onCloseEditor={handleCloseEditor}
            />
            <View style={tw`absolute bottom-20 left-0 right-0 flex-row justify-center items-center p-4`}>
                <TouchableOpacity onPress={handleRetake} style={tw`p-4 bg-red-500 rounded-full mx-4`}>
                    <Ionicons name="camera" size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleOpenEditor} style={tw`p-4 bg-blue-500 rounded-full mx-4`}>
                    <Ionicons name="create" size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleProceed} style={tw`p-4 bg-green-500 rounded-full mx-4`}>
                    <Ionicons name="arrow-forward" size={28} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ImageEditScreen;
