import { COLORS } from '@/constants/GlobalStyles';
import React from 'react';
import { Modal, ActivityIndicator, View, StyleSheet } from 'react-native';

type LoadingOverlayProps = {
    visible: boolean;
    size?: 'small' | 'large' | number;
    color?: string;
    onRequestClose?: () => void;
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    visible,
    size = 100,
    color = COLORS.primary,
    onRequestClose = () => { },
}) => (
    <Modal
        transparent
        animationType="none"
        visible={visible}
        onRequestClose={onRequestClose}
        statusBarTranslucent
    >
        <View style={styles.overlay}>
            <ActivityIndicator size={size} color={color} />
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 10,
    },
});

export default LoadingOverlay;