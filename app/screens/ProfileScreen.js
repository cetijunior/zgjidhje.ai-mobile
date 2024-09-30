import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ProfileScreen() {
    const navigation = useNavigation();
    const [image, setImage] = useState('https://via.placeholder.com/150');
    const [username, setUsername] = useState('John Doe');
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [savedItems, setSavedItems] = useState([]);

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
            setSavedItems(items);
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

    const toggleUsernameEdit = async () => {
        if (isEditingUsername) {
            await AsyncStorage.setItem('username', username);
        }
        setIsEditingUsername(!isEditingUsername);
    };

    const renderSavedDocument = ({ item }) => (
        <TouchableOpacity
            style={tw`mr-2 mb-2`}
            onPress={() => navigation.navigate('DocumentPreview', { document: item })}
        >
            <View style={tw`w-24 h-24 bg-gray-200 rounded-lg justify-center items-center`}>
                <Ionicons name="document-text" size={40} color="gray" />
                <Text style={tw`text-xs mt-1 text-center`} numberOfLines={1}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderSavedImage = ({ item }) => (
        <TouchableOpacity
            style={tw`mr-2 mb-2`}
            onPress={() => navigation.navigate('AllPictures', { image: item })}
        >
            <Image source={{ uri: item.uri }} style={tw`w-24 h-24 rounded-lg`} />
        </TouchableOpacity>
    );

    return (
        <ScrollView style={tw`flex-1 bg-white`}>
            <View style={tw`pt-12 pb-3 px-4 rounded-b-3xl bg-gray-800`}>
                {/* Removed glowing backdrop */}
            </View>
            <View style={tw`flex-1 bg-gray-200 rounded-t-3xl px-4 pt-6 relative`}>
                {/* Removed glowing effect for the rounded top */}
                <View style={tw`items-center -mt-16 relative z-10`}>
                    <TouchableOpacity onPress={pickImage}>
                        <Image
                            source={{ uri: image }}
                            style={tw`w-28 h-28 rounded-full border-4 border-white shadow-lg`}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleUsernameEdit} style={tw`mt-3 flex-row items-center`}>
                        {isEditingUsername ? (
                            <TextInput
                                value={username}
                                onChangeText={setUsername}
                                style={tw`text-xl font-semibold text-gray-800 text-center`}
                                autoFocus
                                onBlur={toggleUsernameEdit}
                            />
                        ) : (
                            <Text style={tw`text-xl font-semibold text-gray-800`}>{username}</Text>
                        )}
                        <Ionicons name="create-outline" size={18} color="#4B5563" style={tw`ml-2`} />
                    </TouchableOpacity>
                    <Text style={tw`text-gray-600 mt-1 text-sm`}>john.doe@example.com</Text>
                </View>
                <View style={tw`mt-6 flex-1`}>
                    <View style={tw`flex-row justify-between items-center mb-2`}>
                        <Text style={tw`text-lg font-semibold text-gray-800`}>Saved Documents</Text>
                        <TouchableOpacity
                            style={tw`bg-gray-800 p-2 rounded-full justify-center items-center`}
                            onPress={() => navigation.navigate('AllDocuments', { items: savedItems.filter(item => item.type === 'document') })}
                        >
                            <Ionicons name="document-text" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={tw`mb-3`}>
                        <FlatList
                            data={savedItems.filter(item => item.type === 'document')}
                            renderItem={renderSavedDocument}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={tw`py-1`}
                        />
                    </View>
                    <View style={tw`flex-row justify-between items-center mb-2 mt-4`}>
                        <Text style={tw`text-lg font-semibold text-gray-800`}>Saved Images</Text>
                        <TouchableOpacity
                            style={tw`bg-gray-800 p-2 rounded-full justify-center items-center`}
                            onPress={() => navigation.navigate('AllPictures', { items: savedItems.filter(item => item.type !== 'document') })}
                        >
                            <Ionicons name="images-outline" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={tw`mb-3`}>
                        <FlatList
                            data={savedItems.filter(item => item.type !== 'document')}
                            renderItem={renderSavedImage}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={tw`py-1`}
                        />
                    </View>
                    <TouchableOpacity style={tw`flex-row items-center bg-white rounded-xl p-3 mb-3 shadow-md`}>
                        <Ionicons name="person-outline" size={22} color="#000000" style={tw`mr-3`} />
                        <Text style={tw`text-base font-medium text-gray-800`}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`flex-row items-center bg-white rounded-xl p-3 mb-3 shadow-md`}>
                        <Ionicons name="settings-outline" size={22} color="#000000" style={tw`mr-3`} />
                        <Text style={tw`text-base font-medium text-gray-800`}>Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`flex-row items-center bg-white rounded-xl p-3 mb-3 shadow-md`}>
                        <Ionicons name="help-circle-outline" size={22} color="#000000" style={tw`mr-3`} />
                        <Text style={tw`text-base font-medium text-gray-800`}>Help & Support</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`flex-row items-center justify-center bg-black rounded-xl p-3 mb-10 mt-auto shadow-lg`}>
                        <Ionicons name="log-out-outline" size={22} color="white" style={tw`mr-3`} />
                        <Text style={tw`text-base font-medium text-white`}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

export default ProfileScreen;