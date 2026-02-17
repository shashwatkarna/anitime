import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, TouchableOpacity, Image, ViewStyle, ImageSourcePropType } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

interface GradientCardProps {
    title: string;
    subtitle?: string;
    image: string;
    onPress: () => void;
    style?: ViewStyle;
}

export function GradientCard({ title, subtitle, image, onPress, style }: GradientCardProps) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.container, style]}>
            <Image source={{ uri: image }} style={styles.image} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)', '#000']}
                style={styles.gradient}
            >
                <ThemedText type="defaultSemiBold" style={styles.title} numberOfLines={1}>{title}</ThemedText>
                {subtitle && <ThemedText style={styles.subtitle} numberOfLines={1}>{subtitle}</ThemedText>}
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: Colors.dark.surface,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
        paddingTop: 30,
    },
    title: {
        color: '#fff',
        fontSize: 14,
    },
    subtitle: {
        color: '#ccc',
        fontSize: 12,
    }
});
