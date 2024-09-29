import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swiper from 'react-native-swiper';

function ProfileScreen() {
    const navigation = useNavigation();
    const [image, setImage] = useState('https://via.placeholder.com/150');
    const [username, setUsername] = useState('John Doe');
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [savedPictures, setSavedPictures] = useState([]);

    useEffect(() => {
        loadProfile();
        loadSavedPictures();
    }, []);

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

    const loadSavedPictures = async () => {
        try {
            const savedPicturesJSON = await AsyncStorage.getItem('savedPictures');
            const pictures = savedPicturesJSON ? JSON.parse(savedPicturesJSON) : [];
            setSavedPictures(pictures);
        } catch (error) {
            console.error('Error loading saved pictures:', error);
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
        }
    };

    const toggleUsernameEdit = () => {
        setIsEditingUsername(!isEditingUsername);
    };

    const renderSavedPicture = ({ item }) => (
        <TouchableOpacity style={tw`mr-2`}>
            <Image source={{ uri: item.uri }} style={tw`w-20 h-20 rounded-lg`} />
        </TouchableOpacity>
    );

    return (
        <View style={tw`flex-1 bg-white`}>
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
                        <Text style={tw`text-lg font-semibold text-gray-800`}>Saved Pictures</Text>
                        <TouchableOpacity
                            style={tw`bg-gray-800 p-2 rounded-full justify-center items-center`}
                            onPress={() => navigation.navigate('AllPictures', { pictures: savedPictures })}
                        >
                            <Ionicons name="images-outline" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={tw`h-28 mb-3`}>
                        <FlatList
                            data={savedPictures}
                            renderItem={renderSavedPicture}
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
        </View>
    );
}

export default ProfileScreen;