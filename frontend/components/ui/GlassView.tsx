import { BlurView } from 'expo-blur';
import { StyleSheet, ViewStyle, Platform, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface GlassViewProps {
    style?: ViewStyle;
    intensity?: number;
    children: React.ReactNode;
}

export function GlassView({ style, intensity = 50, children }: GlassViewProps) {
    const colorScheme = useColorScheme() ?? 'dark';
    const isDark = colorScheme === 'dark';

    if (Platform.OS === 'android') {
        // Android doesn't support BlurView well in all versions, fallback to semi-transparent
        return (
            <View style={[
                styles.androidFallback,
                { backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)' },
                style
            ]}>
                {children}
            </View>
        );
    }

    return (
        <BlurView
            intensity={intensity}
            tint={isDark ? 'dark' : 'light'}
            style={[styles.glass, style]}
        >
            {children}
        </BlurView>
    );
}

const styles = StyleSheet.create({
    glass: {
        overflow: 'hidden',
    },
    androidFallback: {
        overflow: 'hidden',
    }
});
