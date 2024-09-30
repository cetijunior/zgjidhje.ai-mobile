import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Dimensions, FlatList, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';

const SubscriptionScreen = () => {
    const navigation = useNavigation();
    const { width, height } = Dimensions.get('window');
    const [selectedPlan, setSelectedPlan] = useState(0);
    const flatListRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    const ITEM_WIDTH = width * 0.8;
    const ITEM_SPACING = (width - ITEM_WIDTH) / 2;

    const plans = [
        {
            name: 'Plus',
            price: '$9.99/month',
            color: '#FF6B6B',
            features: [
                'Unlimited document scans',
                'Basic AI-powered analysis',
                'Cloud storage integration',
                'Ad-free experience',
            ],
        },
        {
            name: 'Gold',
            price: '$99.99/year',
            color: '#FFD700',
            features: [
                'All Plus features',
                'Advanced AI-powered analysis',
                'Priority customer support',
                'Early access to new features',
            ],
        },
        {
            name: 'Platinum',
            price: '$199.99',
            color: '#E5E4E2',
            features: [
                'All Gold features',
                'One-time payment',
                'Lifetime updates',
                'Exclusive premium content',
            ],
        },
    ];

    const renderPlanItem = ({ item, index }) => {
        const inputRange = [
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH
        ];
        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={[
                tw`flex-1 justify-center items-center p-4 rounded-[30px]`,
                { width: ITEM_WIDTH, transform: [{ scale }], backgroundColor: `${item.color}33` }
            ]}>
                <Text style={tw`text-2xl font-bold text-white mb-4`}>{item.name}</Text>
                <Text style={[tw`text-3xl font-bold mb-6`, { color: item.color }]}>{item.price}</Text>
                {item.features.map((feature, featureIndex) => (
                    <View key={featureIndex} style={tw`flex-row items-center mb-2`}>
                        <FontAwesome5 name="check-circle" size={16} color={item.color} style={tw`mr-2`} />
                        <Text style={tw`text-white`}>{feature}</Text>
                    </View>
                ))}
            </Animated.View>
        );
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setSelectedPlan(viewableItems[0].index);
        }
    }).current;

    const renderDot = (index) => {
        const opacity = scrollX.interpolate({
            inputRange: [(index - 1) * ITEM_WIDTH, index * ITEM_WIDTH, (index + 1) * ITEM_WIDTH],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
        });
        return (
            <Animated.View
                key={index}
                style={[
                    tw`h-2 w-2 rounded-full mx-1`,
                    { opacity, backgroundColor: plans[index].color }
                ]}
            />
        );
    };

    return (
        <ImageBackground
            source={require('../../assets/subscription-bg.jpg')}
            style={tw`flex-1`}
            resizeMode="cover"
        >
            <LinearGradient
                colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)']}
                style={tw`flex-1`}
            >
                <TouchableOpacity
                    style={tw`absolute top-12 left-4 z-10`}
                    onPress={() => navigation.navigate('CameraView')}
                >
                    <Ionicons name="close" size={30} color="gray" />
                </TouchableOpacity>

                <View style={tw`flex-1 justify-center items-center px-6`}>
                    <Ionicons name="diamond" size={80} color={plans[selectedPlan].color} style={tw`mb-4`} />
                    <Text style={tw`text-3xl font-bold mb-2 text-center text-white`}>Unlock Pro Power</Text>
                    <Text style={tw`text-lg text-gray-200 mb-6 text-center`}>
                        Choose the plan that suits you best!
                    </Text>

                    <View style={[tw`items-center justify-center`, { height: height * 0.4, width: width }]}>
                        <Animated.FlatList
                            key={`plans-${width}`} // Add this line
                            ref={flatListRef}
                            data={plans}
                            renderItem={renderPlanItem}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal={true} // Explicitly set horizontal
                            numColumns={1} // Explicitly set numColumns to 1
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={ITEM_WIDTH}
                            snapToAlignment="center"
                            decelerationRate="fast"
                            contentContainerStyle={{ paddingHorizontal: ITEM_SPACING }}
                            viewabilityConfig={{
                                itemVisiblePercentThreshold: 50
                            }}
                            onViewableItemsChanged={onViewableItemsChanged}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                { useNativeDriver: true }
                            )}
                        />
                    </View>

                    <View style={tw`flex-row justify-center mt-4`}>
                        {plans.map((_, index) => renderDot(index))}
                    </View>

                    <TouchableOpacity
                        style={[tw`mt-6 py-3 px-8 rounded-full shadow-lg`, { backgroundColor: plans[selectedPlan].color }]}
                        onPress={() => {/* Handle subscription */ }}
                    >
                        <Text style={tw`text-white text-lg font-bold`}>
                            {selectedPlan === 2 ? 'Buy' : 'Subscribe to'} {plans[selectedPlan].name}
                        </Text>
                    </TouchableOpacity>

                    <Text style={tw`mt-4 text-gray-300 text-center text-sm`}>
                        7-day free trial available for Plus and Gold plans
                    </Text>
                </View>
            </LinearGradient>
        </ImageBackground>
    );
};

export default SubscriptionScreen;