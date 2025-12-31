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
import { COLORS, globalStyles, SPACING } from '@/constants/GlobalStyles';
import Button from './Button';
import HandleContainer from './HandleContainer';
import ModalHeader from './ModalHeader';
import MyTextInput from './TextInput';
import { Player } from '@/model/Player';
import PlayerRow from './PlayerRow';

const defaultPlayers: Player[] = [
    { id: 'u1', name: 'Alex Padel', avatar: 'https://i.pravatar.cc/150?u=alex', latestRating: 1660 },
    { id: 'u2', name: 'Sarah Smash', avatar: 'https://i.pravatar.cc/150?u=sarah', latestRating: 1500 },
    { id: 'u3', name: 'Davide Vibora', avatar: 'https://i.pravatar.cc/150?u=davide', latestRating: 1420 },
    { id: 'u4', name: 'Marcus Lob', avatar: 'https://i.pravatar.cc/150?u=marcus', latestRating: 1820 },
    { id: 'u5', name: 'Gabriella De Azambuja Turmina', latestRating: 950 },
    { id: 'u6', name: 'Julia Love', latestRating: 950 },
    { id: 'u7', name: 'Julia Love', latestRating: 950 },
    { id: 'u8', name: 'Julia Love', latestRating: 950 },
    { id: 'u9', name: 'Julia Love', latestRating: 950 },
];

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
    const [teamMateId, setTeamMateId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

    // 1. Filter the list based on search query
    const filteredPlayers = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return players;
        return players.filter((p) => p.name.toLowerCase().includes(q));
    }, [players, query]);

    // 2. Derive the actual selected list from the IDs
    // We add the 'isTeammate' flag here dynamically
    const selectedList = useMemo(() => {
        return players
            .filter((p) => selectedIds[p.id])
            .map((p) => ({
                ...p,
                isTeammate: p.id === teamMateId,
            }));
    }, [players, selectedIds, teamMateId]);

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) => {
            const isRemoving = !!prev[id];
            // If we are unselecting the player who was the teammate, clear teammate status
            if (isRemoving && id === teamMateId) {
                setTeamMateId(null);
            }
            return { ...prev, [id]: !prev[id] };
        });
    };

    const handleToggleTeammate = (id: string) => {
        // If they aren't selected yet, select them first
        if (!selectedIds[id]) {
            toggleSelection(id);
        }
        // Toggle teammate ID: if already teammate, remove it; otherwise set it
        setTeamMateId((prev) => (prev === id ? null : id));
    };

    const handleAdd = () => {
        onAdd(selectedList); // This now contains the isTeammate attribute!
        setSelectedIds({});
        setTeamMateId(null);
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
                            data={filteredPlayers}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.listContainer}
                            renderItem={({ item }) => {
                                const isSelected = !!selectedIds[item.id];
                                const isTeammate = teamMateId === item.id;
                                const canAddMore = selectedList.length < 3;

                                return (
                                    <PlayerRow
                                        player={item}
                                        selected={isSelected}
                                        teamMate={teamMateId || ''} // Pass ID for highlight
                                        onToggle={() => {
                                            if (canAddMore || isSelected) toggleSelection(item.id);
                                        }}
                                        setTeamMate={() => handleToggleTeammate(item.id)}
                                        allowAddButton={canAddMore || isSelected}
                                        teamMateSelected={teamMateId !== null} />
                                );
                            }}
                            ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
                        />

                        <View style={globalStyles.footer}>
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


const styles = StyleSheet.create({
    sheet: {
        height: '90%',
        backgroundColor: COLORS.surfaceDark,
        borderTopLeftRadius: SPACING.lg,
        borderTopRightRadius: SPACING.lg,
        overflow: 'hidden',
        paddingHorizontal: SPACING.lg,
    },
    listContainer: {
        paddingHorizontal: SPACING.sm,
        paddingBottom: 100,
        paddingTop: SPACING.sm
    },
});
