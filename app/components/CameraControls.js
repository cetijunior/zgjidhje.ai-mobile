import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

const CameraControls = ({ currentMode, toggleMode, takePicture, pickImage, toggleFacing }) => {
    return (
        <View style={tw`flex-row justify-around items-center mb-10`}>
            <TouchableOpacity onPress={toggleFacing} style={tw`p-3`}>
                <Ionicons name="camera-reverse-outline" size={36} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={takePicture} style={tw`bg-white rounded-full p-4`}>
                <Ionicons name={currentMode === 'photo' ? "camera" : "document-outline"} size={36} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} style={tw`p-3`}>
                <Ionicons name={currentMode === 'document' ? "document-text" : "image-outline"} size={36} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default CameraControls;
