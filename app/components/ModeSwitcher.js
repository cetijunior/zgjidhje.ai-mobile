import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';

const ModeSwitcher = ({ currentMode, toggleMode, currentAIMode }) => {
    const navigation = useNavigation();

    const goToProfileScreen = () => {
        navigation.navigate('Profile');
    };

    const goToCalculatorScreen = () => {
        navigation.navigate('Calculator');
    };

    return (
        <View style={tw`absolute -top-20 pt-20 pb-4  flex-row-reverse border-b-2 border-t-2 border-gray-200 bg-black justify-between items-center bg-opacity-50 mt-16 px-8`}>
            {/* Profile Button */}
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
            
            {/* AI Mode Text Centered */}
            <Text style={tw`text-white text-xl font-bold flex-1 text-center`}>
                {currentAIMode}
            </Text>

            {/* Conditional Calculator Button */}
            {currentAIMode === 'Math' && (
                <TouchableOpacity
                    style={tw`rounded-full`}
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
