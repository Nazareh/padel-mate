import React, { useMemo, useState } from 'react';
import {
    View,
    Modal,
    Pressable,
    StyleSheet,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { COLORS, FONT_SIZE, globalStyles, SPACING } from '@/constants/GlobalStyles';
import Button from './Button';
import HandleContainer from './HandleContainer';
import ModalHeader from './ModalHeader';
import MyTextInput from './TextInput';
import { Player } from '@/model/Player';
import PlayerRow from './PlayerRow';

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
    const [teamMateSelected, setTeamMateSelected] = useState(false);
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
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={globalStyles.safeArea}>
                <View style={globalStyles.safeArea}>
                    <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Close modal" />
                    <View style={styles.sheet}>
                        <HandleContainer />
                        <ModalHeader onClose={onClose} title="Add Players" />
                        <MyTextInput
                            icon={'search'}
                            value={query}
                            placeholder={'Search name...'}
                            onValueChange={setQuery} />
                        <FlatList
                            contentContainerStyle={styles.listContainer}
                            data={query ? filtered : recentSection(players, filtered)}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <PlayerRow player={item}
                                    onToggle={() => {
                                        if (selectedList.length < 3 || selectedList.find((p) => p.id === item.id)) {
                                            toggle(item.id)
                                        }
                                    }}
                                    selected={!!selectedIds[item.id]}
                                    teamMateSelected={teamMateSelected}
                                    setTeamMate={() => {
                                        if (selectedList.length < 3 || selectedList.find((p) => p.id === item.id)) {
                                            setTeamMateSelected(!teamMateSelected);
                                            setTeamMate(!teamMateSelected ? item.id : '');
                                        }
                                    }}
                                    teamMate={teamMate}
                                    allowAddButton={selectedList.length < 3 || selectedList.length === 3 && selectedIds[item.id]}
                                />
                            )}
                            ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
                        />

                        <View style={styles.footer}>
                            <Button onPress={handleAdd} label={`Add ${selectedList.length} Players`}
                                badgeText={`${selectedList.length}/3`} />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

function recentSection(recent: Player[], remaining: Player[]) {
    if (!recent || recent.length === 0) return remaining;
    return [...recent, ...remaining.filter((r) => !recent.find((x) => x.id === r.id))];
}


const defaultPlayers: Player[] = [
    { id: 'u1', name: 'Alex Padel', avatar: 'https://i.pravatar.cc/150?u=alex', latestRating: 1660 },
    { id: 'u2', name: 'Sarah Smash', avatar: 'https://i.pravatar.cc/150?u=sarah', latestRating: 1500 },
    { id: 'u3', name: 'Davide Vibora', avatar: 'https://i.pravatar.cc/150?u=davide', latestRating: 1420 },
    { id: 'u4', name: 'Marcus Lob', avatar: 'https://i.pravatar.cc/150?u=marcus', latestRating: 1820 },
    { id: 'u5', name: 'Julia Love', latestRating: 950 },
    { id: 'u6', name: 'Julia Love', latestRating: 950 },
    { id: 'u7', name: 'Julia Love', latestRating: 950 },
    { id: 'u8', name: 'Julia Love', latestRating: 950 },
    { id: 'u9', name: 'Julia Love', latestRating: 950 },
];

const styles = StyleSheet.create({
    sheet: {
        height: '90%',
        backgroundColor: COLORS.surfaceDark,
        borderTopLeftRadius: SPACING.lg,
        borderTopRightRadius: SPACING.lg,
        overflow: 'hidden',
        paddingHorizontal: SPACING.lg,
    },
    title: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: '#111' },
    listContainer: { paddingHorizontal: 8, paddingBottom: 100, paddingTop: 6 },
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        backgroundColor: 'transparent',
    },
});
