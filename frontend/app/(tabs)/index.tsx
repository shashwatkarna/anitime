import { Image, StyleSheet, FlatList, TouchableOpacity, View, Dimensions, ActivityIndicator, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getPopularAnime } from '@/api/client';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.4;
const SPACING = 15;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: trendingData, isLoading: isLoadingTrending } = useQuery({
    queryKey: ['trendingAnime'],
    queryFn: () => getPopularAnime(10, 'airing'),
  });

  const { data: popularData, isLoading: isLoadingPopular } = useQuery({
    queryKey: ['popularAnime'],
    queryFn: () => getPopularAnime(20, 'bypopularity'),
  });

  const trendingAnime = trendingData?.data || [];
  const gridAnime = popularData?.data || [];
  const isLoading = isLoadingTrending || isLoadingPopular;

  const renderTrendingItem = ({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.trendingCard}
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

  const renderGridItem = ({ item, index }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 50 + 500).springify()}
      style={styles.gridCardContainer}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.gridCard}
        onPress={() => router.push({ pathname: '/details', params: { anime: JSON.stringify(item) } })}
      >
        <Image source={{ uri: item.images?.jpg?.large_image_url }} style={styles.gridImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.cardGradient}
        >
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.score || '?'} ★</Text>
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
          <Text style={styles.appSubtitle}>Discover Anime</Text>
        </View>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => router.push('/search')}
        >
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      ) : (
        <FlatList
          data={gridAnime}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.mal_id.toString()}
          numColumns={2}
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
                snapToInterval={CARD_WIDTH + SPACING}
                decelerationRate="fast"
              />
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>All Anime</Text>
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
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 50,
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
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 15,
  },
  horizontalList: {
    paddingHorizontal: 20,
    gap: SPACING,
  },
  // Trending Styles
  trendingCard: {
    width: CARD_WIDTH,
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    marginRight: SPACING,
  },
  trendingImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  trendingRank: {
    color: Colors.dark.primary,
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 2,
  },
  // Grid Styles
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  gridCardContainer: {
    width: (width - 45) / 2,
  },
  gridCard: {
    width: '100%',
    height: 260,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
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
    padding: 12,
    paddingTop: 40,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardSubtitle: {
    color: '#bbb',
    fontSize: 12,
  }
});
