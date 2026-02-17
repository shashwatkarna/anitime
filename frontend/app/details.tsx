import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, Image, View, Dimensions, Text, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { calculateWatchTime } from '@/api/client';
import { useMutation } from '@tanstack/react-query';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function DetailsScreen() {
    const { anime } = useLocalSearchParams();
    const router = useRouter();
    const animeData = anime ? JSON.parse(Array.isArray(anime) ? anime[0] : anime) : null;

    const [inputVal, setInputVal] = useState('');
    const [targetDate, setTargetDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [mode, setMode] = useState('daily_eps');
    const [result, setResult] = useState<any>(null);
    const [showFullSynopsis, setShowFullSynopsis] = useState(false);

    const mutation = useMutation({
        mutationFn: calculateWatchTime,
        onSuccess: (data) => setResult(data),
        onError: (error) => Alert.alert('Error', 'Calculation failed')
    });

    const handleCalculate = () => {
        if (!animeData) return;
        const payload: any = { total_episodes: animeData.episodes || 12, episode_duration: 24 };

        if (mode === 'daily_eps') {
            if (!inputVal) { Alert.alert("Required", "Episodes per day?"); return; }
            payload.episodes_per_day = parseInt(inputVal);
        } else if (mode === 'daily_time') {
            if (!inputVal) { Alert.alert("Required", "Minutes per day?"); return; }
            payload.minutes_per_day = parseInt(inputVal);
        } else {
            payload.target_date = targetDate.toISOString().split('T')[0];
        }
        mutation.mutate(payload);
    };

    if (!animeData) return <Text>No Data</Text>;

    // Responsive layout: use horizontal layout only on wider screens (tablets/desktop)
    const isWideScreen = width > 768;

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <View style={styles.backBtnBlur}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </View>
            </TouchableOpacity>

            {isWideScreen ? (
                // TABLET/DESKTOP: Two Column Layout
                <View style={styles.twoColumnContainer}>
                    {/* Left Column - Image */}
                    <View style={styles.leftColumn}>
                        <Image source={{ uri: animeData.images?.jpg?.large_image_url }} style={styles.posterImage} />
                    </View>

                    {/* Right Column - Content */}
                    <ScrollView style={styles.rightColumn} contentContainerStyle={styles.rightColumnContent} showsVerticalScrollIndicator={false}>
                        <Animated.View entering={FadeInDown.delay(200).springify()}>
                            {/* Title */}
                            <Text style={styles.title}>{animeData.title}</Text>

                            {/* HERO STAT: Total Time */}
                            <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.heroStatContainer}>
                                <LinearGradient
                                    colors={['rgba(108, 99, 255, 0.2)', 'rgba(108, 99, 255, 0.05)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.heroStatGradient}
                                >
                                    <Text style={styles.heroStatLabel}>TIME TO COMPLETE</Text>
                                    <Text style={styles.heroStatValue}>
                                        {(() => {
                                            const epDuration = animeData.duration ? parseInt(animeData.duration) : 24;
                                            const totalMins = (animeData.episodes || 12) * (isNaN(epDuration) ? 24 : epDuration);
                                            const hours = Math.floor(totalMins / 60);
                                            const mins = totalMins % 60;
                                            return `${hours}h ${mins}m`;
                                        })()}
                                    </Text>
                                </LinearGradient>
                            </Animated.View>

                            {/* Calculator Section */}
                            <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.calculatorCard}>
                                <Text style={styles.calcTitle}>Plan Your Watch 📅</Text>
                                <View style={styles.modeRow}>
                                    <TouchableOpacity onPress={() => setMode('daily_eps')} style={[styles.modeBtn, mode === 'daily_eps' && styles.activeMode]}>
                                        <Text style={[styles.modeText, mode === 'daily_eps' && styles.activeModeText]}>Eps/Day</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setMode('daily_time')} style={[styles.modeBtn, mode === 'daily_time' && styles.activeMode]}>
                                        <Text style={[styles.modeText, mode === 'daily_time' && styles.activeModeText]}>Time/Day</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setMode('target')} style={[styles.modeBtn, mode === 'target' && styles.activeMode]}>
                                        <Text style={[styles.modeText, mode === 'target' && styles.activeModeText]}>By Date</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.inputContainer}>
                                    {mode !== 'target' ? (
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            value={inputVal}
                                            onChangeText={setInputVal}
                                            placeholder={mode === 'daily_eps' ? "e.g. 3 episodes" : "e.g. 45 minutes"}
                                            placeholderTextColor="#666"
                                        />
                                    ) : (
                                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateBtn}>
                                            <Text style={styles.dateText}>{targetDate.toLocaleDateString()}</Text>
                                            <Ionicons name="calendar" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {showDatePicker && (
                                    <DateTimePicker value={targetDate} mode="date" onChange={(e, d) => { setShowDatePicker(false); if (d) setTargetDate(d); }} />
                                )}

                                <TouchableOpacity style={styles.calculateBtn} onPress={handleCalculate}>
                                    <Text style={styles.calculateBtnText}>{mutation.isPending ? "Calculating..." : "Calculate Plan"}</Text>
                                </TouchableOpacity>

                                {result && (
                                    <Animated.View entering={FadeInDown} style={styles.resultBox}>
                                        <Text style={styles.resultLabel}>Target Finish Date</Text>
                                        <Text style={styles.resultDate}>{result.finish_date}</Text>
                                        <View style={styles.resultStats}>
                                            <Text style={styles.statText}>{result.days_required} Days</Text>
                                            <Text style={styles.statText}>•</Text>
                                            <Text style={styles.statText}>{result.total_hours} Hours Total</Text>
                                        </View>
                                    </Animated.View>
                                )}
                            </Animated.View>

                            <View style={styles.divider} />

                            {/* Meta & Genres */}
                            <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.genreRow}>
                                {animeData.genres && animeData.genres.length > 0 ? (
                                    animeData.genres.map((g: any, i: number) => (
                                        <View key={i} style={styles.genreTag}>
                                            <Text style={styles.genreText}>{g.name}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <View style={styles.genreTag}>
                                        <Text style={styles.genreText}>Anime</Text>
                                    </View>
                                )}
                                <Text style={styles.metaText}>{animeData.year || 'N/A'}</Text>
                                <Text style={styles.metaText}>•</Text>
                                <Text style={styles.metaText}>{animeData.episodes || '?'} eps</Text>
                            </Animated.View>

                            {/* Collapsible Synopsis */}
                            <Animated.View entering={FadeInDown.delay(400).springify()}>
                                <TouchableOpacity onPress={() => setShowFullSynopsis(!showFullSynopsis)} activeOpacity={0.7} style={styles.synopsisContainer}>
                                    <Text style={styles.synopsis} numberOfLines={showFullSynopsis ? undefined : 3}>
                                        {animeData.synopsis}
                                    </Text>
                                    <Text style={styles.readMore}>
                                        {showFullSynopsis ? 'Show Less ▲' : 'Read More ▼'}
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </Animated.View>
                    </ScrollView>
                </View>
            ) : (
                // MOBILE: Traditional Scrolling Layout
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Hero Image */}
                    <View style={styles.mobileImageContainer}>
                        <Image source={{ uri: animeData.images?.jpg?.large_image_url }} style={styles.mobileImage} />
                        <LinearGradient
                            colors={['transparent', '#0f0f0f']}
                            style={styles.gradient}
                        />
                    </View>

                    {/* Content */}
                    <View style={styles.mobileContent}>
                        <Animated.View entering={FadeInDown.delay(200).springify()}>
                            {/* Title */}
                            <Text style={styles.title}>{animeData.title}</Text>

                            {/* HERO STAT: Total Time */}
                            <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.heroStatContainer}>
                                <LinearGradient
                                    colors={['rgba(108, 99, 255, 0.2)', 'rgba(108, 99, 255, 0.05)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.heroStatGradient}
                                >
                                    <Text style={styles.heroStatLabel}>TIME TO COMPLETE</Text>
                                    <Text style={styles.heroStatValue}>
                                        {(() => {
                                            const epDuration = animeData.duration ? parseInt(animeData.duration) : 24;
                                            const totalMins = (animeData.episodes || 12) * (isNaN(epDuration) ? 24 : epDuration);
                                            const hours = Math.floor(totalMins / 60);
                                            const mins = totalMins % 60;
                                            return `${hours}h ${mins}m`;
                                        })()}
                                    </Text>
                                </LinearGradient>
                            </Animated.View>

                            {/* Calculator Section */}
                            <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.calculatorCard}>
                                <Text style={styles.calcTitle}>Plan Your Watch 📅</Text>
                                <View style={styles.modeRow}>
                                    <TouchableOpacity onPress={() => setMode('daily_eps')} style={[styles.modeBtn, mode === 'daily_eps' && styles.activeMode]}>
                                        <Text style={[styles.modeText, mode === 'daily_eps' && styles.activeModeText]}>Eps/Day</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setMode('daily_time')} style={[styles.modeBtn, mode === 'daily_time' && styles.activeMode]}>
                                        <Text style={[styles.modeText, mode === 'daily_time' && styles.activeModeText]}>Time/Day</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setMode('target')} style={[styles.modeBtn, mode === 'target' && styles.activeMode]}>
                                        <Text style={[styles.modeText, mode === 'target' && styles.activeModeText]}>By Date</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.inputContainer}>
                                    {mode !== 'target' ? (
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            value={inputVal}
                                            onChangeText={setInputVal}
                                            placeholder={mode === 'daily_eps' ? "e.g. 3 episodes" : "e.g. 45 minutes"}
                                            placeholderTextColor="#666"
                                        />
                                    ) : (
                                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateBtn}>
                                            <Text style={styles.dateText}>{targetDate.toLocaleDateString()}</Text>
                                            <Ionicons name="calendar" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {showDatePicker && (
                                    <DateTimePicker value={targetDate} mode="date" onChange={(e, d) => { setShowDatePicker(false); if (d) setTargetDate(d); }} />
                                )}

                                <TouchableOpacity style={styles.calculateBtn} onPress={handleCalculate}>
                                    <Text style={styles.calculateBtnText}>{mutation.isPending ? "Calculating..." : "Calculate Plan"}</Text>
                                </TouchableOpacity>

                                {result && (
                                    <Animated.View entering={FadeInDown} style={styles.resultBox}>
                                        <Text style={styles.resultLabel}>Target Finish Date</Text>
                                        <Text style={styles.resultDate}>{result.finish_date}</Text>
                                        <View style={styles.resultStats}>
                                            <Text style={styles.statText}>{result.days_required} Days</Text>
                                            <Text style={styles.statText}>•</Text>
                                            <Text style={styles.statText}>{result.total_hours} Hours Total</Text>
                                        </View>
                                    </Animated.View>
                                )}
                            </Animated.View>

                            <View style={styles.divider} />

                            {/* Meta & Genres */}
                            <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.genreRow}>
                                {animeData.genres && animeData.genres.length > 0 ? (
                                    animeData.genres.map((g: any, i: number) => (
                                        <View key={i} style={styles.genreTag}>
                                            <Text style={styles.genreText}>{g.name}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <View style={styles.genreTag}>
                                        <Text style={styles.genreText}>Anime</Text>
                                    </View>
                                )}
                                <Text style={styles.metaText}>{animeData.year || 'N/A'}</Text>
                                <Text style={styles.metaText}>•</Text>
                                <Text style={styles.metaText}>{animeData.episodes || '?'} eps</Text>
                            </Animated.View>

                            {/* Collapsible Synopsis */}
                            <Animated.View entering={FadeInDown.delay(400).springify()}>
                                <TouchableOpacity onPress={() => setShowFullSynopsis(!showFullSynopsis)} activeOpacity={0.7} style={styles.synopsisContainer}>
                                    <Text style={styles.synopsis} numberOfLines={showFullSynopsis ? undefined : 3}>
                                        {animeData.synopsis}
                                    </Text>
                                    <Text style={styles.readMore}>
                                        {showFullSynopsis ? 'Show Less ▲' : 'Read More ▼'}
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </Animated.View>
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f0f'
    },
    twoColumnContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    leftColumn: {
        width: '40%',
        backgroundColor: '#000',
    },
    posterImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    rightColumn: {
        flex: 1,
        backgroundColor: '#0f0f0f',
    },
    rightColumnContent: {
        padding: 24,
        paddingBottom: 50,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10
    },
    backBtnBlur: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 50,
    },
    // Mobile Layout Styles
    mobileImageContainer: {
        position: 'relative',
        height: 400,
        width: '100%',
    },
    mobileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
    },
    mobileContent: {
        padding: 20,
        marginTop: -80,
        paddingBottom: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    genreRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    genreTag: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    genreText: {
        color: '#ccc',
        fontSize: 12,
        fontWeight: '600',
    },
    metaText: {
        color: '#888',
        fontSize: 14,
    },
    heroStatContainer: {
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: Colors.dark.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    heroStatGradient: {
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(108, 99, 255, 0.3)',
        borderRadius: 20,
    },
    heroStatLabel: {
        color: '#aaa',
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    heroStatValue: {
        color: '#fff',
        fontSize: 48,
        fontWeight: 'bold',
        letterSpacing: -2,
        textShadowColor: 'rgba(108, 99, 255, 0.6)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    synopsisContainer: {
        marginBottom: 30,
    },
    synopsis: {
        fontSize: 15,
        lineHeight: 24,
        color: '#bbb',
    },
    readMore: {
        color: Colors.dark.primary,
        fontWeight: 'bold',
        marginTop: 5,
    },
    divider: { height: 1, backgroundColor: '#222', marginVertical: 20 },
    calcTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
    calculatorCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(108, 99, 255, 0.2)',
        marginTop: 0,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    modeRow: { flexDirection: 'row', marginBottom: 20, justifyContent: 'space-between', backgroundColor: '#222', borderRadius: 12, padding: 4 },
    modeBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeMode: {
        backgroundColor: '#333',
    },
    modeText: { color: '#888', fontWeight: 'bold', fontSize: 12 },
    activeModeText: { color: '#fff' },
    inputContainer: { marginBottom: 20 },
    input: {
        backgroundColor: '#222',
        color: '#fff',
        padding: 16,
        borderRadius: 12,
        fontSize: 18,
        textAlign: 'center',
    },
    dateBtn: {
        backgroundColor: '#222',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    dateText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    calculateBtn: {
        backgroundColor: Colors.dark.primary,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: Colors.dark.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
        transform: [{ scale: 1 }],
    },
    calculateBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    resultBox: {
        marginTop: 20,
        padding: 20,
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(108, 99, 255, 0.2)',
    },
    resultLabel: { color: Colors.dark.primary, fontSize: 14, fontWeight: '600', marginBottom: 4 },
    resultDate: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
    resultStats: { flexDirection: 'row', gap: 10 },
    statText: { color: '#aaa', fontSize: 14 },
});
