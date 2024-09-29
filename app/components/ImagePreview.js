import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import * as FileSystem from 'expo-file-system';

const ImagePreview = ({ capturedImage, onRetake, onSave }) => {
    const saveToLocalStorage = async () => {
        try {
            const fileName = `image_${Date.now()}.jpg`;
            const newPath = `${FileSystem.documentDirectory}${fileName}`;
            await FileSystem.moveAsync({
                from: capturedImage.uri,
                to: newPath
            });
            console.log('Image saved to:', newPath);
            onSave();
        } catch (error) {
            console.error('Error saving image:', error);
        }
    };

    return (
        <View style={tw`flex-1 bg-black`}>
            <Image
                source={{ uri: capturedImage.uri }}
                style={tw`w-full h-full`}
                resizeMode="contain"
            />
            <View style={tw`absolute bottom-14 left-0 right-0 flex-row justify-evenly p-4`}>
                <TouchableOpacity style={tw`p-2 bg-black bg-opacity-50 rounded-full`} onPress={onRetake}>
                    <Ionicons name="close" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={tw`p-2 bg-black bg-opacity-50 rounded-full`} onPress={saveToLocalStorage}>
                    <Ionicons name="save-outline" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ImagePreview;
