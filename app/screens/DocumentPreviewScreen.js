import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

const DocumentPreviewScreen = ({ route, navigation }) => {
    const { document } = route.params;

    const saveDocument = () => {
        // The document is already saved in the CameraViewScreen
        // Just navigate back to the Profile
        navigation.navigate('Profile');
    };

    return (
        <View style={tw`flex-1 bg-black justify-center items-center`}>
            <Ionicons name="document-text" size={100} color="white" />
            <Text style={tw`text-white text-lg mt-4`}>{document.name}</Text>
            <Text style={tw`text-white text-sm mt-2`}>PDF preview not available in Expo Go</Text>
            <View style={tw`absolute bottom-14 left-0 right-0 flex-row justify-evenly p-4`}>
                <TouchableOpacity
                    style={tw`p-2 bg-black bg-opacity-50 rounded-full`}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="close" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={tw`p-2 bg-black bg-opacity-50 rounded-full`}
                    onPress={saveDocument}
                >
                    <Ionicons name="save-outline" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DocumentPreviewScreen;