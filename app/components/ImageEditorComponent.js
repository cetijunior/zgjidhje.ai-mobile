import React, { useEffect } from 'react';
import { View, BackHandler, Dimensions } from 'react-native';
import { ImageEditor } from 'expo-image-editor';
import tw from 'twrnc';

const ImageEditorComponent = ({ imageUri, isVisible, onEditingComplete, onCloseEditor }) => {
    const screenHeight = Dimensions.get('window').height;

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (isVisible) {
                onCloseEditor();
                return true;
            }
            return false;
        });

        return () => backHandler.remove();
    }, [isVisible, onCloseEditor]);

    if (!isVisible) {
        return null;
    }

    return (
        <View style={tw`absolute top-0 left-0 right-0 bottom-0 bg-black`}>
            <ImageEditor
                visible={true}
                onCloseEditor={onCloseEditor}
                onEditingComplete={onEditingComplete}
                imageUri={imageUri}
                fixedCropAspectRatio={1}
                lockAspectRatio={false}
                minimumCropDimensions={{
                    width: 100,
                    height: 100,
                }}
                mode="full"
            />
        </View>
    );
};

export default ImageEditorComponent;
