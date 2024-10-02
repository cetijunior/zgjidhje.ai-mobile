import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Share, TouchableOpacity, Modal, Alert } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SavedItemsScreen = ({ route }) => {
    const { item } = route.params;
    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const navigation = useNavigation();

    const shareItem = async () => {
        try {
            const message = `
AI Mode: ${item.aiMode}

Extracted Text:
${item.extractedText}

---

AI Analysis:
${item.aiResponse}

- Powered by @zgjidhje.ai
            `.trim();

            const shareOptions = {
                message: message,
            };

            if (item.imageUri) {
                shareOptions.url = item.imageUri;
            }

            await Share.share(shareOptions);
        } catch (error) {
            console.error('Error sharing item:', error);
        }
    };

    const deleteItem = async () => {
        try {
            const savedItemsJSON = await AsyncStorage.getItem('savedItems');
            let savedItems = savedItemsJSON ? JSON.parse(savedItemsJSON) : [];
            savedItems = savedItems.filter(savedItem => savedItem.id !== item.id);
            await AsyncStorage.setItem('savedItems', JSON.stringify(savedItems));
            navigation.goBack();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const promptDeleteItem = () => {
        Alert.alert(
            "Delete Item",
            "Are you sure you want to delete this item?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: deleteItem }
            ]
        );
    };

    return (
        <ScrollView style={tw`flex-1 bg-white`}>
            {item.imageUri && (
                <TouchableOpacity onPress={() => setImageModalVisible(true)}>
                    <Image source={{ uri: item.imageUri }} style={tw`w-full h-64`} resizeMode="cover" />
                </TouchableOpacity>
            )}
            <View style={tw`p-4`}>
                <Text style={tw`text-2xl font-bold mb-4`}>{item.aiMode}</Text>

                <View style={tw`bg-gray-100 rounded-lg p-4 mb-4`}>
                    <Text style={tw`text-lg font-semibold mb-2`}>Extracted Text:</Text>
                    <Text style={tw`text-base`}>{item.extractedText}</Text>
                </View>

                <View style={tw`bg-gray-100 rounded-lg p-4 mb-6`}>
                    <Text style={tw`text-lg font-semibold mb-2`}>AI Analysis:</Text>
                    <Text style={tw`text-base`}>{item.aiResponse}</Text>
                </View>

                <View style={tw`flex-row justify-between`}>
                    <TouchableOpacity
                        style={tw`flex-row items-center justify-center bg-blue-500 p-3 rounded-lg flex-1 mr-2`}
                        onPress={shareItem}
                    >
                        <Ionicons name="share-outline" size={24} color="white" style={tw`mr-2`} />
                        <Text style={tw`text-white text-center font-semibold`}>Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={tw`flex-row items-center justify-center bg-red-500 p-3 rounded-lg flex-1 ml-2`}
                        onPress={promptDeleteItem}
                    >
                        <Ionicons name="trash-outline" size={24} color="white" style={tw`mr-2`} />
                        <Text style={tw`text-white text-center font-semibold`}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal visible={isImageModalVisible} transparent={true} onRequestClose={() => setImageModalVisible(false)}>
                <View style={tw`flex-1 bg-black`}>
                    <Image
                        source={{ uri: item.imageUri }}
                        style={tw`w-full h-full`}
                        resizeMode="contain"
                    />
                    <TouchableOpacity
                        style={tw`absolute top-10 right-4 p-2 bg-black bg-opacity-50 rounded-full`}
                        onPress={() => setImageModalVisible(false)}
                    >
                        <Ionicons name="close" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </Modal>
        </ScrollView>
    );
};

export default SavedItemsScreen;
