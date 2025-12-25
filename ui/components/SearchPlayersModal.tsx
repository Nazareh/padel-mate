import React, { useMemo, useState } from 'react';
import {
    View,
    Modal,
    Text,
    Pressable,
    StyleSheet,
    TextInput,
    Image,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/GlobalStyles';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type Player = {
    id: string;
    name: string;
    avatar?: string;
    score?: number | string;
    isTeammate?: boolean;
};

type Props = {
    visible: boolean;
    onClose: () => void;
    onAdd: (selectedPlayers: Player[]) => void;
    players?: Player[];
};

export default function SearchPlayersModal({
    visible,
    onClose,
    onAdd,
    players = defaultPlayers,
}: Props) {
    const [query, setQuery] = useState('');
    const [teamMate, setTeamMate] = useState('');
    const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

    const mergedPlayers = useMemo(() => players, [players]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return mergedPlayers;
        return mergedPlayers.filter((p) => p.name.toLowerCase().includes(q));
    }, [mergedPlayers, query]);

    const toggle = (id: string) => {
        setSelectedIds((s) => ({ ...s, [id]: !s[id] }));
    };

    const selectedList = useMemo(() => mergedPlayers.filter((p) => selectedIds[p.id]), [mergedPlayers, selectedIds]);

    const handleAdd = () => {
        onAdd(selectedList);
        setSelectedIds({});
        onClose();
    };

    return (
        <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
            <View style={styles.backdrop}>
                <Pressable style={styles.backdropTouchable} onPress={onClose} accessibilityLabel="Close modal" />
                <View style={styles.sheet}>
                    <View style={styles.handleContainer}>
                        <View style={styles.handle} />
                    </View>

                    <View style={styles.headerRow}>
                        <Text style={styles.title}>Add Players</Text>
                        <Pressable onPress={onClose} hitSlop={8} style={styles.cancelBtn}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>
                    </View>

                    <View style={styles.searchContainer}>
                        <View style={styles.searchInner}>
                            <MaterialIcons name="search" size={22} color="#7c7c7c" />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search name, username..."
                                placeholderTextColor="#93c8a8"
                                value={query}
                                onChangeText={setQuery}
                                clearButtonMode="while-editing"
                                accessibilityLabel="Search players"
                            />
                        </View>
                    </View>

                    <FlatList
                        contentContainerStyle={styles.listContainer}
                        data={query ? filtered : recentSection(players, filtered)}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <PlayerRow player={item} onToggle={() => toggle(item.id)} selected={!!selectedIds[item.id]} setTeamMate={() => setTeamMate(item.id)} />
                        )}
                        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
                    />

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.addButton} onPress={handleAdd} disabled={selectedList.length === 0}>
                            <Text style={styles.addText}>Add {selectedList.length} Players</Text>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{selectedList.length}/3</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

function PlayerRow({ player, onToggle, setTeamMate, selected }: { player: Player; onToggle: () => void; selected: boolean; setTeamMate: () => void; }) {
    return (
        <View style={styles.row}>
            <View style={styles.rowLeft}>
                <View style={styles.avatarWrap}>
                    {player.avatar ? (
                        <Image source={{ uri: player.avatar }} style={styles.avatar} />
                    ) : (
                        <View style={styles.initials}>{getInitials(player.name)}</View>
                    )}
                    {typeof player.score !== 'undefined' && (
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>{player.score}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.nameWrap}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <View style={styles.tagRow}>
                        {player.isTeammate && (
                            <Pressable onPress={() => {
                                setTeamMate(player.id);
                                onToggle()
                            }}
                                style={[styles.checkbox, selected && styles.checkboxSelected]} accessibilityRole="checkbox" accessibilityState={{ checked: selected }}>
                                {selected ? <MaterialIcons name="check" size={18} color="#000" /> : null}
                            </Pressable>
                            // <View style={styles.teammateTag}>
                            //     <Text style={styles.teammateText}>Teammate</Text>
                            // </View>
                        )}
                    </View>
                </View>
            </View>

            <Pressable onPress={onToggle} style={[styles.checkbox, selected && styles.checkboxSelected]} accessibilityRole="checkbox" accessibilityState={{ checked: selected }}>
                {selected ? <MaterialIcons name="check" size={18} color="#000" /> : null}
            </Pressable>
        </View>
    );
}

function getInitials(name: string) {
    const parts = name.split(' ');
    return ((parts[0] || '').charAt(0) + (parts[1] || '').charAt(0)).toUpperCase();
}

function recentSection(recent: Player[], remaining: Player[]) {
    if (!recent || recent.length === 0) return remaining;
    return [...recent, ...remaining.filter((r) => !recent.find((x) => x.id === r.id))];
}


const defaultPlayers: Player[] = [
    { id: 'u1', name: 'Alex Padel', avatar: 'https://i.pravatar.cc/150?u=alex', score: 1660, isTeammate: true },
    { id: 'u2', name: 'Sarah Smash', avatar: 'https://i.pravatar.cc/150?u=sarah', score: 1500 },
    { id: 'u3', name: 'Davide Vibora', avatar: 'https://i.pravatar.cc/150?u=davide', score: 1420 },
    { id: 'u4', name: 'Marcus Lob', avatar: 'https://i.pravatar.cc/150?u=marcus', score: 1820 },
    { id: 'u5', name: 'Julia Love', score: 950 },
];

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'flex-end',
    },
    backdropTouchable: { flex: 1 },
    sheet: {
        height: Math.round(SCREEN_HEIGHT * 0.92),
        backgroundColor: '#f6f8f7',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    handleContainer: { alignItems: 'center', paddingVertical: 8 },
    handle: { width: 48, height: 6, borderRadius: 10, backgroundColor: '#cfcfcf' },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    title: { fontSize: 20, fontWeight: '700', color: '#111' },
    cancelBtn: { padding: 6 },
    cancelText: { color: '#6b6b6b', fontSize: 14 },
    searchContainer: { paddingHorizontal: 20, paddingVertical: 8 },
    searchInner: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        backgroundColor: '#fff',
        borderRadius: 999,
        paddingHorizontal: 12,
        elevation: 1,
    },
    searchInput: { flex: 1, marginLeft: 8, color: '#111', fontSize: 16 },
    listContainer: { paddingHorizontal: 8, paddingBottom: 160, paddingTop: 6 },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginHorizontal: 6,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    rowLeft: { flexDirection: 'row', alignItems: 'center' },
    avatarWrap: { width: 56, height: 56, marginRight: 12 },
    avatar: { width: 56, height: 56, borderRadius: 999 },
    initials: {
        width: 56,
        height: 56,
        borderRadius: 999,
        backgroundColor: '#244732',
        alignItems: 'center',
        justifyContent: 'center',
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: 18,
    },
    countBadge: {
        position: 'absolute',
        right: -6,
        bottom: -6,
        height: 22,
        minWidth: 22,
        paddingHorizontal: 6,
        borderRadius: 12,
        backgroundColor: '#1a2c22',
        borderColor: '#112218',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countText: { color: '#19e66b', fontSize: 10, fontWeight: '700' },
    nameWrap: { flexDirection: 'column' },
    playerName: { fontSize: 16, fontWeight: '700', color: '#111' },
    tagRow: { flexDirection: 'row', marginTop: 4 },
    teammateTag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e6e6e6',
    },
    teammateText: { fontSize: 10, fontWeight: '700', color: '#6b6b6b' },
    checkbox: {
        width: 44,
        height: 44,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: '#d1d1d1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxSelected: { borderColor: '#19e66b', backgroundColor: '#19e66b' },
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        backgroundColor: 'transparent',
    },
    addButton: {
        height: 56,
        borderRadius: 999,
        backgroundColor: '#19e66b',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 12,
    },
    addText: { color: '#000', fontWeight: '800', fontSize: 16 },
    badge: { marginLeft: 12, backgroundColor: 'rgba(0,0,0,0.08)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeText: { color: '#111', fontWeight: '700' },
});
