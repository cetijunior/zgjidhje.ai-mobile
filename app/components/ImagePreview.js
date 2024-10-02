import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, ScrollView, ActivityIndicator, SafeAreaView, Share, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COHERE_API_KEY, GOOGLE_CLOUD_VISION_API_KEY } from '@env';

const ImagePreview = ({ route, navigation }) => {
    const { capturedImage, aiMode } = route.params;
    const [extractedText, setExtractedText] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);
    const [fullScreenVisible, setFullScreenVisible] = useState(false);

    useEffect(() => {
        extractTextFromImage(capturedImage.uri);
    }, []);

    const extractTextFromImage = async (imageUri) => {
        setIsExtracting(true);
        setIsLoading(true);
        try {
            const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const body = JSON.stringify({
                requests: [
                    {
                        image: {
                            content: base64ImageData,
                        },
                        features: [
                            {
                                type: 'TEXT_DETECTION',
                                maxResults: 1,
                            },
                        ],
                    },
                ],
            });

            const response = await fetch(
                `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`,
                {
                    method: 'POST',
                    body: body,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = await response.json();

            if (data.responses && data.responses[0] && data.responses[0].fullTextAnnotation) {
                setExtractedText(data.responses[0].fullTextAnnotation.text);
                await getAIResponse(data.responses[0].fullTextAnnotation.text);
            } else {
                setExtractedText('No text detected in the image.');
                setAiResponse("Looks like this image is playing hide and seek with its text! Maybe it's written in invisible ink? Scan Again!");
            }
        } catch (error) {
            console.error('Error extracting text:', error);
            setExtractedText('Error extracting text from the image.');
            setAiResponse('An error occurred while processing the image.');
        } finally {
            setIsExtracting(false);
            setIsLoading(false);
        }
    };

    const getAIResponse = async (text) => {
        if (text === 'No text detected in the image.') {
            setAiResponse("Duket sikur kjo imazh po luan fshehurazi me tekstin e saj! Ndoshta është shkruar me bojë të padukshme? Ju lutemi, provoni të skanoni përsëri.");
            return;
        }

        let promptInstructions = '';
        switch (aiMode.toLowerCase()) {
            case 'math':
                promptInstructions = 'Identifiko konceptet matematikore, shpjego formulat, dhe ofro hapa për zgjidhjen e problemeve nëse ka.';
                break;
            case 'science':
                promptInstructions = 'Identifiko konceptet shkencore, shpjego fenomenet, dhe lidh informacionin me teori shkencore përkatëse.';
                break;
            case 'history':
                promptInstructions = 'Identifiko ngjarjet historike, datat, personazhet, dhe ofro kontekst për rëndësinë e tyre historike.';
                break;
            case 'literature':
                promptInstructions = 'Analizo elementet letrare, identifiko autorët, veprat, dhe ofro interpretim të temave ose simbolikës.';
                break;
            case 'language':
                promptInstructions = 'Analizo strukturën gjuhësore, identifiko rregullat gramatikore, dhe shpjego nuancat e përdorimit të gjuhës.';
                break;
            default:
                promptInstructions = 'Analizo tekstin dhe ofro një shpjegim të detajuar.';
        }

        try {
            const response = await fetch('https://api.cohere.ai/v1/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${COHERE_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'command-xlarge-nightly',
                    prompt: `Ti je një asistent i specializuar në ${aiMode}, rrjedhshëm në shqip. Analizo tekstin e mëposhtëm dhe ofro një përgjigje të qartë dhe koncize në shqip të rrjedhshëm. Sigurohu të përdorësh terminologjinë dhe konceptet e duhura që lidhen me ${aiMode}.

Teksti për të analizuar: ${text}

Udhëzime:
1. ${promptInstructions}
2. Jep një shpjegim të shkurtër ose zgjidhje në shqip.
3. Nëse është e rëndësishme, sugjeroni fusha të mëtejshme studimi ose tema të ngjashme në ${aiMode}.
4. Përdor shprehje idiomatike shqiptare kur është e përshtatshme për ta bërë përgjigjen më natyrale.
5. Sigurohu që përgjigja të jetë e plotë dhe të mos ndërpritet në mes të një fjalie.

Përgjigja jote në shqip të rrjedhshëm:`,
                    max_tokens: 300,
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
            setAiResponse('Na vjen keq, ndodhi një gabim gjatë përpunimit të tekstit. Ju lutemi, provoni përsëri.');
        }
    };

    const shareAnswer = async () => {
        try {
            const message = `
AI Mode: ${aiMode}

Extracted Text:
${extractedText}

---

AI Analysis:
${aiResponse}

- Powered by @zgjidhje.ai
            `.trim();

            const shareOptions = {
                message: message,
            };

            if (capturedImage.uri) {
                shareOptions.url = capturedImage.uri;
            }

            await Share.share(shareOptions);
        } catch (error) {
            console.error('Error sharing item:', error);
        }
    };

    const handleSave = async () => {
        try {
            const newItem = {
                id: Date.now().toString(),
                imageUri: capturedImage.uri,
                extractedText,
                aiResponse,
                aiMode,
                timestamp: new Date().toISOString(),
            };

            // Get existing saved items
            const savedItemsJSON = await AsyncStorage.getItem('savedItems');
            const savedItems = savedItemsJSON ? JSON.parse(savedItemsJSON) : [];

            // Add new item to the savedItems array
            savedItems.push(newItem);

            // Save updated savedItems back to AsyncStorage
            await AsyncStorage.setItem('savedItems', JSON.stringify(savedItems));

            Alert.alert('Success', 'Item saved successfully!');
            navigation.navigate('Profile');
        } catch (error) {
            console.error('Error saving item:', error);
            Alert.alert('Error', 'Failed to save item. Please try again.');
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
                        {isExtracting ? (
                            <ActivityIndicator size="large" color="#8B5CF6" />
                        ) : (
                            <Text style={tw`text-base text-gray-200`}>{extractedText || 'No text extracted'}</Text>
                        )}
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
                <TouchableOpacity style={tw`p-3 bg-green-500 rounded-full`} onPress={handleSave}>
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