import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useEffect, useRef } from 'react';

interface ModeToggleProps {
    modes: { label: string; value: string }[];
    currentMode: string;
    onModeChange: (mode: string) => void;
}

export function ModeToggle({ modes, currentMode, onModeChange }: ModeToggleProps) {
    return (
        <View style={styles.container}>
            {modes.map((mode) => {
                const isActive = currentMode === mode.value;
                return (
                    <TouchableOpacity
                        key={mode.value}
                        style={[styles.button, isActive && styles.activeButton]}
                        onPress={() => onModeChange(mode.value)}
                        activeOpacity={0.7}
                    >
                        <ThemedText style={[styles.text, isActive && styles.activeText]}>
                            {mode.label}
                        </ThemedText>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeButton: {
        backgroundColor: Colors.dark.primary,
    },
    text: {
        color: '#888',
        fontSize: 14,
        fontWeight: '600',
    },
    activeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
