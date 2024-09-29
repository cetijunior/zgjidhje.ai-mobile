import React from 'react';
import { View } from 'react-native';
import tw from 'twrnc';

const ScanArea = ({ style }) => {
    return (
        <View className="flex-1 bg-transparent justify-between px-10" style={style} />
    );
};

export default ScanArea;
