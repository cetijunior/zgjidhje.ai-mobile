import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

const ImagePreview = ({ capturedImage, onRetake, onSave }) => {
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
                <TouchableOpacity style={tw`p-2 bg-black bg-opacity-50 rounded-full`} onPress={() => onSave(capturedImage)}>
                    <Ionicons name="save-outline" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ImagePreview;
