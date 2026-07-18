import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { globalStyles, COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/GlobalStyles';
import { useGlobalContext } from '@/auth/globalContext';
import { CONFIG } from '@/constants/config';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export type MessageType = 'welcome' | 'announcement' | 'event' | 'update';

export type InboxMessage = {
  id: string;
  type: MessageType;
  title: string;
  body: string;
  sentAt: string; // ISO date string
  read: boolean;
};


const TYPE_META: Record<MessageType, { icon: string; color: string; bg: string }> = {
  welcome:      { icon: 'waving-hand',    color: COLORS.yellow400,  bg: COLORS.yellowShade },
  event:        { icon: 'sports-tennis',  color: COLORS.primary,    bg: COLORS.primaryShade },
  announcement: { icon: 'campaign',       color: COLORS.lightBlue,  bg: 'rgba(96,165,250,0.15)' },
  update:       { icon: 'system-update',  color: COLORS.textGray,   bg: 'rgba(156,163,175,0.12)' },
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  < 7)   return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

type MessageRowProps = {
  message: InboxMessage;
  expanded: boolean;
  onPress: () => void;
};

function MessageRow({ message, expanded, onPress }: MessageRowProps) {
  const meta = TYPE_META[message.type];

  return (
    <TouchableOpacity
      style={[styles.row, !message.read && styles.rowUnread]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.iconBox, { backgroundColor: meta.bg }]}>
        <MaterialIcons name={meta.icon as any} size={22} color={meta.color} />
      </View>

      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <Text style={[styles.title, !message.read && styles.titleUnread]} numberOfLines={expanded ? undefined : 1}>
            {message.title}
          </Text>
          <View style={styles.rowMeta}>
            <Text style={styles.time}>{relativeTime(message.sentAt)}</Text>
            {!message.read && <View style={styles.unreadDot} />}
          </View>
        </View>

        <Text style={[styles.body, expanded && styles.bodyExpanded]} numberOfLines={expanded ? undefined : 2}>
          {message.body}
        </Text>

        {expanded && (
          <Text style={styles.fullDate}>
            {new Date(message.sentAt).toLocaleDateString('en-US', {
              weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
            })}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function InboxScreen() {
  const { setInboxUnreadCount, token } = useGlobalContext();
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`${CONFIG.apiBaseUrl}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data: InboxMessage[] = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('[inbox] fetchMessages error:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMessages();
    setRefreshing(false);
  };

  const unreadCount = messages.filter(m => !m.read).length;

  useEffect(() => { setInboxUnreadCount(unreadCount); }, [unreadCount]);

  const handlePress = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(prev => (prev === id ? null : id));

    const msg = messages.find(m => m.id === id);
    if (msg && !msg.read) {
      // Optimistic update
      setMessages(prev => prev.map(m => (m.id === id ? { ...m, read: true } : m)));
      fetch(`${CONFIG.apiBaseUrl}/messages/${id}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(err => console.error('[inbox] markRead error:', err));
    }
  };

  const markAllRead = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const unread = messages.filter(m => !m.read);
    setMessages(prev => prev.map(m => ({ ...m, read: true })));
    unread.forEach(m => {
      fetch(`${CONFIG.apiBaseUrl}/messages/${m.id}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(err => console.error('[inbox] markRead error:', err));
    });
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={globalStyles.headerTitle}>Inbox</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.empty}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : messages.length === 0 ? (
        <View style={styles.empty}>
          <MaterialIcons name="inbox" size={56} color={COLORS.borderDark} />
          <Text style={styles.emptyTitle}>All caught up</Text>
          <Text style={styles.emptySub}>No messages yet</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        >
          {messages.map(m => (
            <MessageRow
              key={m.id}
              message={m}
              expanded={expandedId === m.id}
              onPress={() => handlePress(m.id)}
            />
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: COLORS.primaryContent,
    fontSize: 11,
    fontWeight: '800',
  },
  markAllBtn: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  markAllText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },

  list: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },

  row: {
    flexDirection: 'row',
    gap: SPACING.md,
    backgroundColor: COLORS.surfaceDark,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    padding: SPACING.md,
  },
  rowUnread: {
    borderColor: COLORS.surfaceBorder,
    backgroundColor: '#1f3d2d',
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  rowContent: {
    flex: 1,
    gap: 4,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  title: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: COLORS.textGray,
  },
  titleUnread: {
    color: COLORS.textWhite,
    fontWeight: '700',
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  time: {
    fontSize: 11,
    color: COLORS.textGray,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },

  body: {
    fontSize: 13,
    color: COLORS.textGray,
    lineHeight: 18,
  },
  bodyExpanded: {
    color: COLORS.textLight,
  },
  fullDate: {
    marginTop: SPACING.sm,
    fontSize: 11,
    color: COLORS.textGray,
    fontStyle: 'italic',
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textGray,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.borderDark,
  },
});
