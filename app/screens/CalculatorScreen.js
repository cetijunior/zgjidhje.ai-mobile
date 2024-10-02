import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

const CalculatorScreen = () => {
    const [display, setDisplay] = useState('');
    const [result, setResult] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handlePress = (value) => {
        if (value === '=' && display) {
            try {
                const calculatedResult = eval(display);
                setResult(calculatedResult.toString());
                setDisplay('');
            } catch (error) {
                setResult('Error');
            }
        } else if (value === 'C') {
            setDisplay('');
            setResult('');
        } else if (value === '⌫') {
            setDisplay(prev => prev.slice(0, -1));
        } else if (['sin', 'cos', 'tan', 'log', '√', 'x²', 'x³', 'π', 'e', '%', '!'].includes(value)) {
            let calculatedValue;
            switch (value) {
                case 'sin':
                    calculatedValue = Math.sin(parseFloat(display));
                    break;
                case 'cos':
                    calculatedValue = Math.cos(parseFloat(display));
                    break;
                case 'tan':
                    calculatedValue = Math.tan(parseFloat(display));
                    break;
                case 'log':
                    calculatedValue = Math.log10(parseFloat(display));
                    break;
                case '√':
                    calculatedValue = Math.sqrt(parseFloat(display));
                    break;
                case 'x²':
                    calculatedValue = Math.pow(parseFloat(display), 2);
                    break;
                case 'x³':
                    calculatedValue = Math.pow(parseFloat(display), 3);
                    break;
                case 'π':
                    calculatedValue = Math.PI;
                    break;
                case 'e':
                    calculatedValue = Math.E;
                    break;
                case '%':
                    calculatedValue = parseFloat(display) / 100;
                    break;
                case '!':
                    calculatedValue = factorial(parseFloat(display));
                    break;
            }
            setResult(calculatedValue.toString());
            setDisplay('');
        } else {
            const lastChar = display.slice(-1);
            const isOperator = ['+', '-', '×', '÷'].includes(value);
            const lastCharIsOperator = ['+', '-', '×', '÷'].includes(lastChar);

            if (!(isOperator && lastCharIsOperator)) {
                setDisplay(prev => prev + (value === '×' ? '*' : value === '÷' ? '/' : value));
            }
        }
    };

    const factorial = (n) => {
        if (n === 0 || n === 1) return 1;
        return n * factorial(n - 1);
    };

    const basicButtons = [
        ['C', '⌫', '(', ')', '÷'],
        ['7', '8', '9', '×'],
        ['4', '5', '6', '-'],
        ['1', '2', '3', '+'],
        ['0', '.', '=']
    ];

    const advancedButtons = [
        ['sin', 'cos', 'tan', 'log'],
        ['√', 'x²', 'x³', 'xʸ'],
        ['π', 'e', '%', '!']
    ];

    return (
        <SafeAreaView style={tw`flex-1 bg-blue-50`}>
            <View style={tw`flex-1 p-4 border-4 border-blue-200 mx-2 my-1 rounded-3xl overflow-hidden`}>
                <View style={tw`flex-1 justify-end items-end`}>
                    <ScrollView style={tw`w-full`} contentContainerStyle={tw`items-end`}>
                        <Text style={tw`text-gray-600 text-3xl mb-2`}>{display}</Text>
                        <Text style={tw`text-blue-600 text-5xl font-bold`}>{result}</Text>
                    </ScrollView>
                </View>
                <View style={tw`flex-row justify-between items-center mt-4 mb-2`}>
                    <TouchableOpacity
                        style={tw`flex-row items-center bg-blue-100 p-2 rounded-full`}
                        onPress={() => setShowAdvanced(!showAdvanced)}
                    >
                        <Ionicons
                            name={showAdvanced ? "contract" : "expand"}
                            size={24}
                            color="#3B82F6"
                        />
                        <Text style={tw`ml-2 text-blue-600 font-semibold`}>
                            {showAdvanced ? "Hide" : "Show"} Advanced
                        </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    {showAdvanced && (
                        <View style={tw`mb-2`}>
                            {advancedButtons.map((row, rowIndex) => (
                                <View key={rowIndex} style={tw`flex-row mb-1`}>
                                    {row.map((button) => (
                                        <TouchableOpacity
                                            key={button}
                                            style={tw`flex-1 justify-center items-center p-[2px]  rounded-full bg-blue-100`}
                                            onPress={() => handlePress(button)}
                                        >
                                            <Text style={tw`text-lg text-blue-600 font-semibold`}>{button}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ))}
                        </View>
                    )}
                    <View>
                        {basicButtons.map((row, rowIndex) => (
                            <View key={rowIndex} style={tw`flex-row`}>
                                {row.map((button) => (
                                    <TouchableOpacity
                                        key={button}
                                        style={[
                                            tw`flex-1 justify-center items-center p-4 m-1 rounded-full`,
                                            button === '0' && tw`flex-2`,
                                            tw`bg-white shadow`,
                                            ['÷', '×', '-', '+', '='].includes(button) && tw`bg-blue-100`,
                                            button === 'C' && tw`bg-red-100`,
                                            button === '⌫' && tw`bg-yellow-100`
                                        ]}
                                        onPress={() => handlePress(button)}
                                    >
                                        <Text style={[
                                            tw`text-2xl`,
                                            tw`text-gray-800`,
                                            ['÷', '×', '-', '+', '='].includes(button) && tw`text-blue-600 font-bold`,
                                            button === 'C' && tw`text-red-600 font-bold`,
                                            button === '⌫' && tw`text-yellow-600 font-bold`
                                        ]}>{button}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default CalculatorScreen;
