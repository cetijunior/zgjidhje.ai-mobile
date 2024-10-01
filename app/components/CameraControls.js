import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';

const CameraControls = ({ currentMode, currentAIMode, takePicture, pickImage }) => {
    const navigation = useNavigation();

    const getAIModeIcon = () => {
        switch (currentAIMode) {
            case 'Math':
                return 'calculator';
            case 'Science':
                return 'flask';
            case 'History':
                return 'book';
            case 'Literature':
                return 'library';
            case 'Language':
                return 'language';
            default:
                return 'calculator';
        }
    };

    const handleAIModePress = () => {
        navigation.navigate('QuickAIQuestion', { aiMode: currentAIMode });
    };

    return (
        <View style={tw`flex-row justify-around items-center mb-10`}>
            <TouchableOpacity style={tw`items-center p-3`} onPress={handleAIModePress}>
                <View style={tw`relative`}>
                    <Ionicons name={getAIModeIcon()} size={36} color="white" />
                    <View style={tw`absolute -top-2 -right-2 bg-white rounded-full p-[3px]`}>
                        <Ionicons name="chatbubble" size={20} color="black" />
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePicture} style={tw`bg-white rounded-full p-4 items-center justify-center`}>
                <Ionicons name={currentMode === 'photo' ? "camera" : "document-outline"} size={36} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} style={tw`p-3 items-center justify-center`}>
                <View style={tw`relative`}>
                    <Ionicons name={currentMode === 'document' ? "document-text" : "image-outline"} size={36} color="white" />
                    <Ionicons name="arrow-up-circle" size={24} color="white" style={tw`absolute -top-2 -right-2`} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default CameraControls;
