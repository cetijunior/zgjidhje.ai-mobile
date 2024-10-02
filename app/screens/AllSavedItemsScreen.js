import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const AllSavedItemsScreen = () => {
    const [savedItems, setSavedItems] = useState([]);
    const navigation = useNavigation();

    const loadSavedItems = useCallback(async () => {
        try {
            const savedItemsJSON = await AsyncStorage.getItem('savedItems');
            const items = savedItemsJSON ? JSON.parse(savedItemsJSON) : [];
            setSavedItems(items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
        } catch (error) {
            console.error('Error loading saved items:', error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadSavedItems();
        }, [loadSavedItems])
    );

    const deleteItem = async (itemId) => {
        try {
            const updatedItems = savedItems.filter(item => item.id !== itemId);
            await AsyncStorage.setItem('savedItems', JSON.stringify(updatedItems));
            setSavedItems(updatedItems);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const promptDeleteItem = (item) => {
        Alert.alert(
            "Delete Item",
            "Are you sure you want to delete this item?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteItem(item.id) }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={tw`w-1/2 p-2`}
            onPress={() => navigation.navigate('SavedItems', { item })}
            onLongPress={() => promptDeleteItem(item)}
        >
            <View style={tw`bg-white rounded-lg shadow overflow-hidden`}>
                <Image source={{ uri: item.imageUri }} style={tw`w-full h-40`} resizeMode="cover" />
                <View style={tw`p-2`}>
                    <Text style={tw`font-bold text-sm`} numberOfLines={1}>{item.aiMode}</Text>
                    <Text style={tw`text-xs text-gray-500`} numberOfLines={2}>{item.extractedText}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={tw`flex-1 bg-gray-100`}>
            {savedItems.length > 0 ? (
                <FlatList
                    data={savedItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={tw`p-2`}
                />
            ) : (
                <View style={tw`flex-1 justify-center items-center p-6`}>
                    <Ionicons name="images-outline" size={80} color="#9CA3AF" style={tw`mb-4`} />
                    <Text style={tw`text-2xl text-gray-600 font-semibold text-center`}>No items saved yet</Text>
                    <Text style={tw`text-base text-gray-500 mt-2 text-center`}>Start saving items to see them here!</Text>
                </View>
            )}
        </View>
    );
};

export default AllSavedItemsScreen;
