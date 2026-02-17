import { useState, useEffect, useCallback } from 'react';
// Force reload
import { StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, View, Image, Text, Keyboard, Platform } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { searchAnime } from '@/api/client';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    FadeInUp,
    FadeInDown,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    interpolate,
    Easing,
    Layout
} from 'react-native-reanimated';

export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Breathing Animation for Icon
    const breathe = useSharedValue(0);
    // Focus Glow Animation
    const focusValue = useSharedValue(0);

    useEffect(() => {
        breathe.value = withRepeat(
            withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.quad) }),
            -1,
            true
        );
    }, []);

    useEffect(() => {
        focusValue.value = withTiming(isFocused ? 1 : 0, { duration: 300 });
    }, [isFocused]);

    const iconStyle = useAnimatedStyle(() => ({
        opacity: interpolate(breathe.value, [0, 1], [0.4, 0.8]),
        transform: [{ scale: interpolate(breathe.value, [0, 1], [1, 1.1]) }]
    }));

    const searchBoxStyle = useAnimatedStyle(() => ({
        borderColor: interpolate(focusValue.value, [0, 1], [
            'rgba(255,255,255,0.05)' as any,
            'rgba(108, 99, 255, 0.5)' as any
        ]),
        borderWidth: 1.5,
        shadowOpacity: interpolate(focusValue.value, [0, 1], [0, 0.3]),
        backgroundColor: interpolate(focusValue.value, [0, 1], [
            'rgba(30, 30, 30, 0.8)' as any,
            'rgba(35, 35, 35, 0.95)' as any
        ]),
    }));

    // Debounce the query update
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);

        return () => clearTimeout(handler);
    }, [query]);

    const { data: suggestions, isLoading: isLoadingSuggestions } = useQuery({
        queryKey: ['searchAnime', debouncedQuery],
        queryFn: () => searchAnime(debouncedQuery),
        enabled: debouncedQuery.length > 2,
    });

    const handleSearchCheck = () => {
        // Force search or dismiss keyboard
        Keyboard.dismiss();
    };

    const renderSuggestion = ({ item, index }: { item: any, index: number }) => (
        <Animated.View
            entering={FadeInUp.delay(index * 50).duration(600).easing(Easing.out(Easing.cubic))}
            layout={Layout.springify()}
        >
            <TouchableOpacity
                style={styles.suggestionItem}
                activeOpacity={0.7}
                onPress={() => router.push({ pathname: '/details', params: { anime: JSON.stringify(item) } })}
            >
                <Image source={{ uri: item.images?.jpg?.small_image_url }} style={styles.suggestionImage} />
                <View style={styles.suggestionInfo}>
                    <Text style={styles.suggestionTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.suggestionMeta}>{item.year || 'N/A'} • {item.type || 'TV'}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#444" />
            </TouchableOpacity>
        </Animated.View>
    );

    const renderGridItem = ({ item }) => (
        <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push({ pathname: '/details', params: { anime: JSON.stringify(item) } })}
        >
            <Image source={{ uri: item.images?.jpg?.large_image_url }} style={styles.gridImage} />
            <View style={styles.gridContent}>
                <Text style={styles.gridTitle} numberOfLines={1}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header / Search Bar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Animated.View style={[styles.searchBox, searchBoxStyle]}>
                    <Animated.View style={iconStyle}>
                        <Ionicons name="search" size={20} color={Colors.dark.primary} style={{ marginRight: 8 }} />
                    </Animated.View>
                    <TextInput
                        style={styles.input}
                        placeholder="Search for anime..."
                        placeholderTextColor="#666"
                        value={query}
                        onChangeText={setQuery}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onSubmitEditing={handleSearchCheck}
                        returnKeyType="search"
                        autoFocus
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#888" />
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </View>

            {/* Content Area */}
            {isLoadingSuggestions ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.dark.primary} />
                </View>
            ) : (
                <View style={styles.content}>
                    {query.length > 2 && suggestions?.data ? (
                        <FlatList
                            data={suggestions.data}
                            renderItem={renderSuggestion}
                            keyExtractor={(item) => item.mal_id.toString()}
                            contentContainerStyle={styles.list}
                            keyboardShouldPersistTaps="handled"
                            ListHeaderComponent={
                                <Text style={styles.resultsHeader}>Results for "{query}"</Text>
                            }
                        />
                    ) : (
                        <View style={styles.emptyState}>
                            <LinearGradient
                                colors={['rgba(108, 99, 255, 0.2)', 'transparent']}
                                style={styles.emptyGradient}
                            >
                                <Ionicons name="search-outline" size={80} color="rgba(108, 99, 255, 0.4)" />
                            </LinearGradient>
                            <Text style={styles.emptyTitle}>Find Your Next Show</Text>
                            <Text style={styles.emptyText}>Start typing to explore thousands of anime titles across all genres.</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f0f0f' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
        gap: 12,
    },
    backButton: {
        padding: 4,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
        shadowColor: Colors.dark.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 5,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    list: {
        padding: 16,
    },
    resultsHeader: {
        color: '#888',
        fontSize: 14,
        marginBottom: 12,
        fontWeight: '600',
    },
    // Suggestion List Item
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        marginBottom: 12,
    },
    suggestionImage: {
        width: 56,
        height: 56,
        borderRadius: 12,
        marginRight: 16,
        backgroundColor: '#222',
    },
    suggestionInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    suggestionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    suggestionMeta: {
        color: '#888',
        fontSize: 13,
        fontWeight: '500',
    },
    // Empty State
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyGradient: {
        width: 140,
        height: 140,
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptyText: {
        color: '#888',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
    },
});
