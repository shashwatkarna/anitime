import { useState, useEffect, createElement } from 'react';
import { Image, StyleSheet, FlatList, TouchableOpacity, View, ActivityIndicator, Text, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getPopularAnime } from '@/api/client';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withTiming, interpolate, Easing, Layout } from 'react-native-reanimated';

const SPACING = 16;
const MAX_ITEM_WIDTH = 200;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Responsive Grid Logic
  const numColumns = Math.max(2, Math.floor(width / MAX_ITEM_WIDTH));
  const CARD_WIDTH = (width - (numColumns + 1) * SPACING) / numColumns;
  const TRENDING_CARD_WIDTH = Math.min(width * 0.45, 200);

  // Breathing Animation for Trending List
  const breathe = useSharedValue(0);
  useEffect(() => {
    breathe.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, []);

  const breatheStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(breathe.value, [0, 1], [0.1, 0.3]),
    transform: [{ scale: interpolate(breathe.value, [0, 1], [1, 1.02]) }]
  }));

  const { data: trendingData, isLoading: isLoadingTrending } = useQuery({
    queryKey: ['trendingAnime'],
    queryFn: () => (getPopularAnime as any)(10, 'airing'),
  });

  const { data: popularData, isLoading: isLoadingPopular } = useQuery({
    queryKey: ['popularAnime'],
    queryFn: () => (getPopularAnime as any)(20, 'bypopularity'),
  });

  const trendingAnime = trendingData?.data || [];
  const gridAnime = popularData?.data || [];
  const isLoading = isLoadingTrending || isLoadingPopular;

  const renderTrendingItem = ({ item, index }: { item: any, index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      style={[styles.trendingCard, breatheStyle, { width: TRENDING_CARD_WIDTH }]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        style={StyleSheet.absoluteFill}
        onPress={() => router.push({ pathname: '/details', params: { anime: JSON.stringify(item) } })}
      >
        <Image source={{ uri: item.images?.jpg?.large_image_url }} style={styles.trendingImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.cardGradient}
        >
          <Text style={styles.trendingRank}>#{index + 1}</Text>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderGridItem = ({ item, index }: { item: any, index: number }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 50).duration(800).easing(Easing.out(Easing.cubic))}
      style={[styles.gridCardContainer, { width: CARD_WIDTH }]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.gridCard}
        onPress={() => router.push({ pathname: '/details', params: { anime: JSON.stringify(item) } })}
      >
        <Image source={{ uri: item.images?.jpg?.large_image_url }} style={styles.gridImage} />
        <LinearGradient
          colors={['transparent', 'rgba(108, 99, 255, 0.4)', '#0f0f0f']}
          locations={[0, 0.6, 1]}
          style={styles.cardGradient}
        >
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.cardMetaRow}>
            <Text style={styles.cardSubtitle}>{item.score || '?'} ★</Text>
            <Text style={styles.cardSubtitle}>• {item.type || 'TV'}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>AniTime</Text>
          <Text style={styles.appSubtitle}>Your premium anime companion</Text>
        </View>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => router.push('/search')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[Colors.dark.primary, 'rgba(108, 99, 255, 0.6)']}
            style={styles.searchGradient}
          >
            <Ionicons name="search" size={22} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      ) : (
        <FlatList
          key={`grid-${numColumns}`}
          data={gridAnime}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.mal_id.toString()}
          numColumns={numColumns}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Trending Now 🔥</Text>
              <FlatList
                data={trendingAnime}
                renderItem={renderTrendingItem}
                keyExtractor={(item) => item.mal_id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                snapToInterval={TRENDING_CARD_WIDTH + SPACING}
                decelerationRate="fast"
              />
              <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Popular Anime</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  greeting: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  appSubtitle: {
    color: '#888',
    fontSize: 14,
  },
  searchBtn: {
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  searchGradient: {
    padding: 12,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  list: {
    paddingBottom: 100,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    marginLeft: 20,
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  horizontalList: {
    paddingHorizontal: 20,
    gap: SPACING,
  },
  // Trending Styles
  trendingCard: {
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    marginRight: SPACING,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.2)',
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 10,
  },
  trendingImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  trendingRank: {
    color: Colors.dark.primary,
    fontWeight: '900',
    fontSize: 14,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  // Grid Styles
  row: {
    paddingHorizontal: SPACING,
    gap: SPACING,
    marginBottom: SPACING,
  },
  gridCardContainer: {
    // Width handled dynamically
  },
  gridCard: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: 60,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardSubtitle: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '600',
  }
});
