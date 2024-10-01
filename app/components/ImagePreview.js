import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, ScrollView, ActivityIndicator, SafeAreaView, Share, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

const COHERE_API_KEY = 'PJGGChE4oZwlYrTX7HNL6rUJINkvRZesjma8nWHq';

const ImagePreview = ({ capturedImage, extractedText, onRetake, onSave, aiMode }) => {
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fullScreenVisible, setFullScreenVisible] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        console.log('Extracted text in ImagePreview:', extractedText);
        if (extractedText) {
            getAIResponse();
        }
    }, [extractedText]);

    const getAIResponse = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('https://api.cohere.ai/v1/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${COHERE_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'command-xlarge-nightly',
                    prompt: `You are an AI assistant specialized in ${aiMode}. Provide a clear and short answer of the following text: ${extractedText}`,
                    max_tokens: 100,
                    temperature: 0.3,
                    k: 0,
                    stop_sequences: ['\n\n'],
                    return_likelihoods: 'NONE'
                })
            });

            const data = await response.json();
            if (data.generations && data.generations.length > 0) {
                setAiResponse(data.generations[0].text.trim());
            } else {
                throw new Error('No response from Cohere API');
            }
        } catch (error) {
            console.error('Error getting AI response:', error);
            setAiResponse('Sorry, there was an error processing the text.');
        } finally {
            setIsLoading(false);
        }
    };

    const shareAnswer = async () => {
        try {
            const imageUri = capturedImage.uri;
            const base64Image = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
            await Share.share({
                message: `AI Analysis (${aiMode}): ${aiResponse}`,
                url: `data:image/jpeg;base64,${base64Image}`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-900`}>
            <View style={tw`flex-1`}>
                <TouchableOpacity style={tw`w-full h-2/5`} onPress={() => setFullScreenVisible(true)}>
                    <Image
                        source={{ uri: capturedImage.uri }}
                        style={tw`w-full h-full`}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <View style={tw`flex-1 bg-gray-800 p-4 rounded-t-3xl -mt-4`}>
                    <Text style={tw`text-lg font-bold mb-2 text-white`}>Extracted Text:</Text>
                    <ScrollView
                        style={tw`flex-1 mb-2 bg-gray-700 rounded-xl p-3`}
                        contentContainerStyle={tw`pb-2`}
                        showsVerticalScrollIndicator={true}
                        indicatorStyle="white"
                    >
                        <Text style={tw`text-base text-gray-200`}>{extractedText || 'No text extracted'}</Text>
                    </ScrollView>
                    <View style={tw`border-t border-purple-500 my-2`} />
                    <Text style={tw`text-lg font-bold mb-2 text-white`}>AI Analysis ({aiMode}):</Text>
                    <ScrollView
                        style={tw`flex-1 bg-gray-700 rounded-xl p-3`}
                        contentContainerStyle={tw`pb-2`}
                        showsVerticalScrollIndicator={true}
                        indicatorStyle="white"
                    >
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#8B5CF6" />
                        ) : (
                            <Text style={tw`text-base text-gray-200`}>{aiResponse || 'No AI analysis available'}</Text>
                        )}
                    </ScrollView>
                </View>
            </View>
            <View style={tw`flex-row justify-evenly p-4 bg-gray-800`}>
                <TouchableOpacity style={tw`p-3 bg-red-500 rounded-full`} onPress={onRetake}>
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={tw`p-3 bg-green-500 rounded-full`} onPress={() => onSave(capturedImage)}>
                    <Ionicons name="save-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={tw`p-3 bg-blue-500 rounded-full`} onPress={shareAnswer}>
                    <Ionicons name="share-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <Modal visible={fullScreenVisible} transparent={true} animationType="fade">
                <View style={tw`flex-1 bg-black`}>
                    <TouchableOpacity
                        style={tw`absolute top-16 right-4 z-10 bg-black bg-opacity-50 rounded-full p-2`}
                        onPress={() => setFullScreenVisible(false)}
                    >
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: capturedImage.uri }}
                        style={tw`flex-1`}
                        resizeMode="contain"
                    />
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default ImagePreview;
