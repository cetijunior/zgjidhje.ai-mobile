import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import { COHERE_API_KEY } from '@env';

const QuickAIQuestionScreen = ({ route, navigation }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { aiMode } = route.params;
    const scrollViewRef = useRef();

    const askQuestion = async () => {
        if (!inputText.trim()) return;

        const newMessage = { type: 'user', content: inputText };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setInputText('');
        setIsLoading(true);

        let promptInstructions = '';
        switch (aiMode.toLowerCase()) {
            case 'math':
                promptInstructions = 'Identifiko konceptet matematikore, shpjego formulat, dhe ofro hapa për zgjidhjen e problemeve nëse ka.';
                break;
            case 'science':
                promptInstructions = 'Identifiko konceptet shkencore, shpjego fenomenet, dhe lidh informacionin me teori shkencore përkatëse.';
                break;
            case 'history':
                promptInstructions = 'Identifiko ngjarjet historike, datat, personazhet, dhe ofro kontekst për rëndësinë e tyre historike.';
                break;
            case 'literature':
                promptInstructions = 'Analizo elementet letrare, identifiko autorët, veprat, dhe ofro interpretim të temave ose simbolikës.';
                break;
            case 'language':
                promptInstructions = 'Analizo strukturën gjuhësore, identifiko rregullat gramatikore, dhe shpjego nuancat e përdorimit të gjuhës.';
                break;
            default:
                promptInstructions = 'Analizo pyetjen dhe ofro një përgjigje të detajuar.';
        }

        try {
            const response = await fetch('https://api.cohere.ai/v1/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${COHERE_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'command-xlarge-nightly',
                    prompt: `Ti je një asistent i specializuar në ${aiMode}, rrjedhshëm në shqip. Ofro një përgjigje koncize dhe informuese në shqip të rrjedhshëm për pyetjen e mëposhtme. Përdor terminologjinë dhe konceptet e duhura që lidhen me ${aiMode}.

Pyetja: ${inputText}

Udhëzime:
1. Analizo pyetjen në kontekstin e ${aiMode}.
2. ${promptInstructions}
3. Jep një përgjigje të qartë dhe koncize në shqip.
4. Nëse është e aplikueshme, sugjeroni tema të ngjashme ose fusha për eksplorim të mëtejshëm.
5. Përdor shprehje idiomatike shqiptare për ta bërë përgjigjen të tingëllojë më natyrale.
6. Sigurohu që përgjigja të jetë e plotë dhe të mos ndërpritet në mes të një fjalie.

Përgjigja jote në shqip të rrjedhshëm:`,
                    max_tokens: 300,
                    temperature: 0.7,
                    k: 0,
                    stop_sequences: [],
                    return_likelihoods: 'NONE'
                })
            });

            const data = await response.json();
            if (data.generations && data.generations.length > 0) {
                const aiMessage = { type: 'ai', content: data.generations[0].text.trim() };
                setMessages(prevMessages => [...prevMessages, aiMessage]);
            } else {
                throw new Error('No response from Cohere API');
            }
        } catch (error) {
            console.error('Error asking question:', error);
            const errorMessage = { type: 'ai', content: 'Na vjen keq, ndodhi një gabim gjatë përpunimit të pyetjes suaj. Ju lutemi, provoni përsëri.' };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={tw`flex-1`}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <LinearGradient
                colors={['#343541', '#2A2B32', '#202123']}
                style={tw`flex-1`}
            >
                <View style={tw`flex-1`}>
                    <View style={tw`p-4 pt-8 border-b border-gray-700`}>
                        <Text style={tw`text-2xl font-semibold text-white`}>{aiMode} Assistant</Text>
                    </View>
                    <ScrollView
                        ref={scrollViewRef}
                        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                        style={tw`flex-1 px-4`}
                        contentContainerStyle={tw`pb-4`}
                    >
                        {messages.map((message, index) => (
                            <View key={index} style={tw`my-2 ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                                <View style={tw`max-w-3/4 rounded-2xl p-3 ${message.type === 'user' ? 'bg-blue-500' : 'bg-gray-700'}`}>
                                    <Text style={tw`text-white text-base`}>{message.content}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                    <View style={tw`p-4 pb-12 border-t border-gray-700`}>
                        <View style={tw`flex-row items-center bg-gray-700 rounded-full`}>
                            <TextInput
                                style={tw`flex-1 py-3 px-4 text-white`}
                                placeholder="Ask a question..."
                                placeholderTextColor="#A0AEC0"
                                value={inputText}
                                onChangeText={setInputText}
                                editable={!isLoading}
                            />
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#A0AEC0" style={tw`mr-3`} />
                            ) : (
                                <TouchableOpacity
                                    style={tw`p-3`}
                                    onPress={askQuestion}
                                    disabled={isLoading}
                                >
                                    <Ionicons name="send" size={24} color="#A0AEC0" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

export default QuickAIQuestionScreen;