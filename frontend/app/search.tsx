import { useState, useEffect, useCallback } from 'react';
// Force reload
import { StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, View, Image, Text, Keyboard } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { searchAnime } from '@/api/client';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const router = useRouter();
    const insets = useSafeAreaInsets();

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

    const renderSuggestion = ({ item }) => (
        <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => router.push({ pathname: '/details', params: { anime: JSON.stringify(item) } })}
        >
            <Image source={{ uri: item.images?.jpg?.small_image_url }} style={styles.suggestionImage} />
            <View style={styles.suggestionInfo}>
                <Text style={styles.suggestionTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.suggestionMeta}>{item.year || 'Unknown'} • {item.type}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
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
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
                    <TextInput
                        style={styles.input}
                        placeholder="Search anime..."
                        placeholderTextColor="#666"
                        value={query}
                        onChangeText={setQuery}
                        onSubmitEditing={handleSearchCheck}
                        returnKeyType="search"
                        autoFocus
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#888" />
                        </TouchableOpacity>
                    )}
                </View>
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
                            <Ionicons name="search-outline" size={64} color="#333" />
                            <Text style={styles.emptyText}>Type to find anime...</Text>
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
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
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
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
        marginBottom: 8,
    },
    suggestionImage: {
        width: 48,
        height: 48,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: '#222',
    },
    suggestionInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    suggestionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
    },
    suggestionMeta: {
        color: '#666',
        fontSize: 13,
    },
    // Empty State
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.5,
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
        marginTop: 16,
    },
});
