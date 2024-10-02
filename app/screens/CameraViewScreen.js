import React, { useState, useRef, useCallback } from 'react';
import { CameraView } from 'expo-camera';
import { StyleSheet, TouchableOpacity, View, Text, Image, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { manipulateAsync } from 'expo-image-manipulator';
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
    const [currentMode, setCurrentMode] = useState('document');
    const [savedItems, setSavedItems] = useState([]);
    const [currentAIMode, setCurrentAIMode] = useState('Math');
    const cameraRef = useRef(null);
    const navigation = useNavigation();
    const [scanArea, setScanArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

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

    const handleEditedImage = async (editedImageUri) => {
        setCapturedImage({ uri: editedImageUri });
        await processImage(editedImageUri);
    };

    const processImage = async (imageUri) => {
        setIsProcessing(true);
        try {
            await extractTextFromImage(imageUri);
            await processTextWithCohere(extractedText);
        } catch (error) {
            console.error('Error processing image:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const extractTextFromImage = async (imageUri) => {
        setIsProcessing(true);
        try {
            // Read the image file and convert it to base64
            const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Prepare the request body
            const body = JSON.stringify({
                requests: [
                    {
                        image: {
                            content: base64ImageData,
                        },
                        features: [
                            {
                                type: 'TEXT_DETECTION',
                            },
                        ],
                    },
                ],
            });

            // Make the API request
            const response = await fetch(
                'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCjkrmkLZDfxdTjZROd3PTo2m7xmWeUEc0',
                {
                    method: 'POST',
                    body: body,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const result = await response.json();
            console.log('API Response:', result);  // Log the entire response

            if (result.responses && result.responses[0] && result.responses[0].fullTextAnnotation) {
                const detectedText = result.responses[0].fullTextAnnotation.text;
                console.log('Detected text:', detectedText);  // Log the detected text
                setExtractedText(detectedText);
            } else {
                console.log('No text detected in the image');
                setExtractedText('No text detected in the image');
            }
        } catch (error) {
            console.error('Error extracting text:', error);
            setExtractedText('Error extracting text: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const processTextWithCohere = async (text) => {
        try {
            cohere.init('YOUR_COHERE_API_KEY');
            const response = await cohere.generate({
                model: 'command-xlarge-nightly',
                prompt: `Analyze the following text and provide a summary or answer questions about it: ${text}`,
                max_tokens: 300,
                temperature: 0.9,
                k: 0,
                stop_sequences: [],
                return_likelihoods: 'NONE'
            });
            console.log('Cohere response:', response.body.generations[0].text);
            // Handle the response (e.g., display it to the user)
        } catch (error) {
            console.error('Error processing text with Cohere:', error);
        }
    };

    const saveItem = async () => {
        if (capturedImage) {
            try {
                // Generate a unique filename
                const fileName = `image_${Date.now()}.jpg`;
                const newPath = `${FileSystem.documentDirectory}${fileName}`;

                // Copy the file to app's document directory
                await FileSystem.copyAsync({
                    from: capturedImage.uri,
                    to: newPath
                });

                // Load existing saved pictures
                const savedPicturesJSON = await AsyncStorage.getItem('savedPictures');
                const savedPictures = savedPicturesJSON ? JSON.parse(savedPicturesJSON) : [];

                // Add new picture to the array
                const newPicture = { id: Date.now().toString(), uri: newPath };
                const updatedPictures = [...savedPictures, newPicture];

                // Save updated array back to AsyncStorage
                await AsyncStorage.setItem('savedPictures', JSON.stringify(updatedPictures));

                console.log('Picture saved successfully');
                setCapturedImage(null);

                // Navigate to Profile screen after saving
                navigation.navigate('Profile');

                // Extract text from the saved image
                await extractTextFromImage(newPath);

            } catch (error) {
                console.error('Error saving picture:', error);
            }
        }
    };

    const loadSavedItems = useCallback(async () => {
        try {
            const savedItemsJSON = await AsyncStorage.getItem('profileImages');
            return savedItemsJSON ? JSON.parse(savedItemsJSON) : [];
        } catch (error) {
            console.error('Error loading saved items:', error);
            return [];
        }
    }, []);

    const pickImage = async () => {
        if (currentMode === 'document') {
            let result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
            });

            if (!result.canceled) {
                const documentData = {
                    id: Date.now().toString(),
                    uri: result.assets[0].uri,
                    type: 'document',
                    name: result.assets[0].name,
                };
                await extractTextFromImage(result.assets[0].uri);
                navigation.navigate('DocumentPreview', { document: documentData, extractedText });
            }
        } else {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setCapturedImage(result.assets[0]);
                await extractTextFromImage(result.assets[0].uri);
            }
        }
    };

    const saveDocument = async (newPath) => {
        try {
            const savedDocumentsJSON = await AsyncStorage.getItem('savedDocuments');
            const savedDocuments = savedDocumentsJSON ? JSON.parse(savedDocumentsJSON) : [];

            const newDocument = { id: Date.now().toString(), uri: newPath, name: selectedDocument.name };
            const updatedDocuments = [...savedDocuments, newDocument];

            await AsyncStorage.setItem('savedDocuments', JSON.stringify(updatedDocuments));

            console.log('Document saved successfully');
            setSelectedDocument(null);

            // Navigate to Profile screen after saving
            navigation.navigate('Profile');
        } catch (error) {
            console.error('Error saving document:', error);
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
                                onPress={() => {
                                    console.log(`Selected ${mode.label} mode`);
                                    setCurrentAIMode(mode.label);
                                }}
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
            extractedText={extractedText}
            onRetake={() => {
                setCapturedImage(null);
                setExtractedText('');
            }}
            onSave={saveItem}
            aiMode={currentAIMode}
        />
    );

    return (
        <View style={styles.container}>
            {isProcessing ? (
                <View style={tw`flex-1 justify-center items-center`}>
                    <Text>Processing image...</Text>
                </View>
            ) : capturedImage ? (
                renderImagePreview()
            ) : (
                renderCamera()
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});