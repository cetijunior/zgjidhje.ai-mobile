import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Alert, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Sharing from 'expo-sharing';

const AllDocumentsScreen = () => {
    const [savedDocuments, setSavedDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        loadSavedDocuments();
    }, []);

    const loadSavedDocuments = async () => {
        try {
            if (route.params?.items) {
                setSavedDocuments(route.params.items.filter(item => item.type === 'document'));
            } else {
                const savedItemsJSON = await AsyncStorage.getItem('savedItems');
                const items = savedItemsJSON ? JSON.parse(savedItemsJSON) : [];
                setSavedDocuments(items.filter(item => item.type === 'document'));
            }
        } catch (error) {
            console.error('Error loading saved documents:', error);
        }
    };

    const renderDocumentItem = ({ item }) => (
        <TouchableOpacity
            style={tw`flex-row items-center p-4 bg-white border-b border-gray-200`}
            onPress={() => setSelectedDocument(item)}
            onLongPress={() => promptDeleteDocument(item)}
        >
            <Ionicons name="document-text" size={24} color="#4B5563" style={tw`mr-4`} />
            <View style={tw`flex-1`}>
                <Text style={tw`text-base font-medium text-gray-800`} numberOfLines={1}>{item.name}</Text>
                <Text style={tw`text-sm text-gray-500`}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <Text style={tw`text-sm text-gray-500`}>{item.size}</Text>
        </TouchableOpacity>
    );

    const promptDeleteDocument = (document) => {
        Alert.alert(
            "Delete Document",
            "Are you sure you want to delete this document?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteDocument(document) }
            ]
        );
    };

    const deleteDocument = async (document) => {
        try {
            const updatedDocuments = savedDocuments.filter(d => d.id !== document.id);
            await AsyncStorage.setItem('savedItems', JSON.stringify(updatedDocuments));
            setSavedDocuments(updatedDocuments);
            if (selectedDocument && selectedDocument.id === document.id) {
                setSelectedDocument(null);
            }
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    const shareDocument = async (uri) => {
        try {
            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error('Error sharing document:', error);
        }
    };

    return (
        <View style={tw`flex-1 bg-gray-100`}>
            {savedDocuments.length > 0 ? (
                <FlatList
                    data={savedDocuments}
                    renderItem={renderDocumentItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={tw`pb-4`}
                />
            ) : (
                <View style={tw`flex-1 justify-center items-center p-6`}>
                    <Ionicons name="document-text-outline" size={80} color="#9CA3AF" style={tw`mb-4`} />
                    <Text style={tw`text-2xl text-gray-600 font-semibold text-center`}>No documents saved yet</Text>
                    <Text style={tw`text-base text-gray-500 mt-2 text-center`}>Start saving important documents to access them quickly!</Text>
                </View>
            )}
            <Modal visible={!!selectedDocument} transparent={true} animationType="fade" onRequestClose={() => setSelectedDocument(null)}>
                <View style={tw`flex-1 bg-black bg-opacity-75 justify-center items-center`}>
                    <View style={tw`bg-white rounded-2xl p-6 w-5/6 max-w-sm`}>
                        <Text style={tw`text-2xl font-bold mb-4 text-gray-800`}>{selectedDocument?.name}</Text>
                        <View style={tw`bg-gray-100 rounded-lg p-4 mb-6`}>
                            <Text style={tw`text-gray-600`}>Date: {new Date(selectedDocument?.date).toLocaleDateString()}</Text>
                            <Text style={tw`text-gray-600 mt-2`}>Size: {selectedDocument?.size}</Text>
                            <Text style={tw`text-gray-600 mt-2`}>Type: {selectedDocument?.type}</Text>
                        </View>
                        <View style={tw`flex-row justify-around`}>
                            <TouchableOpacity
                                style={tw`p-3 bg-gray-200 rounded-full`}
                                onPress={() => setSelectedDocument(null)}
                            >
                                <Ionicons name="close" size={28} color="#4B5563" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={tw`p-3 bg-blue-500 rounded-full`}
                                onPress={() => shareDocument(selectedDocument.uri)}
                            >
                                <Ionicons name="share-outline" size={28} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={tw`p-3 bg-red-500 rounded-full`}
                                onPress={() => promptDeleteDocument(selectedDocument)}
                            >
                                <Ionicons name="trash-outline" size={28} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default AllDocumentsScreen;
