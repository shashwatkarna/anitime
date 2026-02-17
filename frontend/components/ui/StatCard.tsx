import { View, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { GlassView } from './GlassView';

interface StatCardProps {
    value: string;
    label: string;
    subValue?: string;
    style?: ViewStyle;
}

export function StatCard({ value, label, subValue, style }: StatCardProps) {
    return (
        <GlassView intensity={20} style={[styles.container, style]}>
            <ThemedText style={styles.label}>{label}</ThemedText>
            <ThemedText type="title" style={styles.value}>{value}</ThemedText>
            {subValue && <ThemedText style={styles.subValue}>{subValue}</ThemedText>}
        </GlassView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    label: {
        color: '#888',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    value: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.dark.primary,
        textAlign: 'center',
    },
    subValue: {
        color: '#ccc',
        marginTop: 4,
        fontSize: 14,
    }
});
