import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

const ModeSwitcher = ({ currentMode, toggleMode, currentAIMode }) => {
    const navigation = useNavigation();

    const goToProfileScreen = () => {
        navigation.navigate('Profile');
    };

    const goToCalculatorScreen = () => {
        navigation.navigate('Calculator');
    };

    return (
        <View style={tw`flex-col items-center bg-opacity-50 mt-16 px-8`}>
            <View style={tw`flex-row justify-between items-center w-full`}>
                <TouchableOpacity
                    style={tw`rounded-full`}
                    onPress={toggleMode}
                >
                    <View style={tw`relative w-6 h-6 justify-center items-center`}>
                        <Ionicons
                            name={currentMode === 'document' ? 'document-text-outline' : 'camera-outline'}
                            size={24}
                            color="white"
                        />
                        <Animated.View
                            style={[
                                tw`absolute -mr-9`,
                                {
                                    transform: [{
                                        rotate: currentMode === 'document' ? '90deg' : '0deg'
                                    }]
                                }
                            ]}
                        >
                            <Ionicons
                                name="sync-outline"
                                size={50}
                                color="white"
                            />
                        </Animated.View>
                    </View>
                </TouchableOpacity>
                <Text style={tw`text-white text-xl font-bold`}>{currentAIMode}</Text>
                <TouchableOpacity
                    style={tw`rounded-full`}
                    onPress={goToProfileScreen}
                >
                    <View style={tw`relative w-6 h-8 justify-center items-center`}>
                        <Ionicons
                            name="person-outline"
                            size={28}
                            color="white"
                        />
                    </View>
                </TouchableOpacity>
            </View>
            {currentAIMode === 'Math' && (
                <TouchableOpacity
                    style={tw`absolute rounded-full top-10 right-5 bg-black p-1`}
                    onPress={goToCalculatorScreen}
                >
                    <View style={tw`relative w-8 h-8 justify-center items-center`}>
                        <Ionicons
                            name="calculator-outline"
                            size={28}
                            color="white"
                        />
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ModeSwitcher;
