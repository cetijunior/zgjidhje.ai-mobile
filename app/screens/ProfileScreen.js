import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swiper from 'react-native-swiper';

function ProfileScreen() {
    const navigation = useNavigation();
    const [image, setImage] = useState('https://via.placeholder.com/150');
    const [username, setUsername] = useState('John Doe');
    const [savedItems, setSavedItems] = useState([]);
    const [isPremium, setIsPremium] = useState(false);

    const premiumFeatures = [
        { icon: 'infinite', title: 'Unlimited Scans', description: 'Scan as many documents as you want' },
        { icon: 'cloud-upload', title: 'Cloud Storage', description: 'Securely store your documents in the cloud' },
        { icon: 'analytics', title: 'Advanced Analytics', description: 'Get insights from your scanned documents' },
        { icon: 'color-wand', title: 'Enhanced OCR', description: 'Improved text recognition accuracy' },
    ];

    useFocusEffect(
        React.useCallback(() => {
            loadProfile();
            loadSavedItems();
        }, [])
    );

    const loadProfile = async () => {
        try {
            const storedUsername = await AsyncStorage.getItem('username');
            const storedImage = await AsyncStorage.getItem('profileImage');
            if (storedUsername) setUsername(storedUsername);
            if (storedImage) setImage(storedImage);
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const loadSavedItems = async () => {
        try {
            const savedItemsJSON = await AsyncStorage.getItem('savedItems');
            const items = savedItemsJSON ? JSON.parse(savedItemsJSON) : [];
            // Sort items by date in descending order (newest first)
            const sortedItems = items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setSavedItems(sortedItems);
        } catch (error) {
            console.error('Error loading saved items:', error);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            await AsyncStorage.setItem('profileImage', result.assets[0].uri);
        }
    };

    const renderSavedItem = ({ item }) => (
        <TouchableOpacity
            style={tw`mr-3 mb-3`}
            onPress={() => navigation.navigate('SavedItems', { item })}
        >
            {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={tw`w-28 h-28 rounded-2xl shadow-sm`} />
            ) : (
                <View style={tw`w-28 h-28 bg-gray-100 rounded-2xl justify-center items-center shadow-sm`}>
                    <Ionicons name="document-text" size={40} color="#4B5563" />
                    <Text style={tw`text-xs mt-2 text-center text-gray-600`} numberOfLines={1}>{item.aiMode}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    const renderPremiumFeature = (feature, index) => (
        <View key={index} style={tw`items-center px-4 py-6`}>
            <Ionicons name={feature.icon} size={48} color="#4F46E5" />
            <Text style={tw`text-xl font-bold mt-4 text-gray-800`}>{feature.title}</Text>
            <Text style={tw`text-sm text-gray-600 text-center mt-2`}>{feature.description}</Text>
        </View>
    );

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <View style={tw`relative bg-indigo-600 pb-20`}>
                <Image
                    source={{ uri: image }}
                    style={tw`w-32 h-32 rounded-full mx-auto mt-4 border-4 border-white shadow-lg`}
                />
                <TouchableOpacity
                    style={tw`absolute bottom-16 right-1/2 bg-white p-2 rounded-full shadow-md`}
                    onPress={pickImage}
                >
                    <Ionicons name="camera" size={24} color="#4F46E5" />
                </TouchableOpacity>
            </View>

            <ScrollView style={tw`flex-1 px-6 -mt-14`}>
                <View style={tw`bg-white rounded-3xl shadow-md px-6 py-8`}>
                    <Text style={tw`text-3xl font-bold text-center text-gray-800`}>{username}</Text>
                    <Text style={tw`text-gray-500 text-center mt-1`}>john.doe@example.com</Text>

                    {!isPremium && (
                        <View style={tw`mt-2 h-auto`}>
                            <Swiper
                                style={{ height: 210 }}
                                showsButtons={false}
                                autoplay={true}
                                autoplayTimeout={3}
                                loop={true}
                                activeDotColor="#4F46E5"
                                dotStyle={tw`mt-4`}
                                activeDotStyle={tw`mt-4`}
                            >
                                {premiumFeatures.map((feature, index) => (
                                    <View key={index} style={tw`items-center px-4 rounded-lg`}>
                                        {renderPremiumFeature(feature, index)}
                                    </View>
                                ))}
                            </Swiper>
                            <TouchableOpacity
                                style={tw`mt-2 bg-purple-600 py-3 px-8 rounded-full shadow-md`}
                                onPress={() => navigation.navigate('Subscription')}
                            >
                                <Text style={tw`text-white text-center font-semibold`}>Upgrade to Premium</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={tw`mt-8`}>
                        <View style={tw`flex-row justify-between items-center mb-4`}>
                            <Text style={tw`text-xl font-semibold text-gray-800`}>Recent Items</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('AllSavedItems')}>
                                <Text style={tw`text-blue-500`}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        {savedItems.length > 0 ? (
                            <FlatList
                                data={savedItems.slice(0, 5)} // Show only the 5 most recent items
                                renderItem={renderSavedItem}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        ) : (
                            <View style={tw`items-center py-4`}>
                                <Ionicons name="images-outline" size={48} color="#9CA3AF" style={tw`mb-2`} />
                                <Text style={tw`text-gray-500 text-center`}>No saved items yet</Text>
                            </View>
                        )}
                    </View>

                    <View style={tw`mt-8`}>
                        <TouchableOpacity style={tw`flex-row items-center py-4  border-t border-b border-gray-200`}>
                            <Ionicons name="settings-outline" size={24} color="#4B5563" style={tw`mr-4`} />
                            <Text style={tw`text-lg text-gray-700`}>Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={tw`flex-row items-center py-4 border-b border-gray-200`}>
                            <Ionicons name="help-circle-outline" size={24} color="#4B5563" style={tw`mr-4`} />
                            <Text style={tw`text-lg text-gray-700`}>Help & Support</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={tw`flex-row items-center py-4`}>
                            <Ionicons name="log-out-outline" size={24} color="#EF4444" style={tw`mr-4`} />
                            <Text style={tw`text-lg text-red-500`}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}


export default ProfileScreen;