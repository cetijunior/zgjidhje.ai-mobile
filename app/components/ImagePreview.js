import React, { useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

const ImagePreview = ({ capturedImage, extractedText, onRetake, onSave }) => {
    useEffect(() => {
        console.log('Extracted text in ImagePreview:', extractedText);
    }, [extractedText]);

    return (
        <View style={tw`flex-1 bg-black`}>
            <View style={tw`flex-1`}>
                <Image
                    source={{ uri: capturedImage.uri }}
                    style={tw`w-full h-3/5`}
                    resizeMode="contain"
                />
                <View style={tw`h-2/5 bg-white p-4`}>
                    <Text style={tw`text-lg font-bold mb-2`}>Extracted Text:</Text>
                    <ScrollView style={tw`flex-1`}>
                        <Text style={tw`text-base`}>{extractedText || 'No text extracted'}</Text>
                    </ScrollView>
                </View>
            </View>
            <View style={tw`absolute bottom-4 left-0 right-0 flex-row justify-evenly p-4`}>
                <TouchableOpacity style={tw`p-2 bg-red-500 rounded-full`} onPress={onRetake}>
                    <Ionicons name="close" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={tw`p-2 bg-green-500 rounded-full`} onPress={() => onSave(capturedImage)}>
                    <Ionicons name="save-outline" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ImagePreview;
