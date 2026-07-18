# Padel Mate — Feature Roadmap

Post-launch backlog. Add, reorder, and cross off as priorities shift.

---

## Inbox & Messaging

Send targeted messages to players — onboarding nudges, event announcements, app update notices.

**Ideas to explore**
- Admin-side inbox: compose a message, pick recipients (all / by club / by rating band)
- Player-side: a bell icon or "Inbox" tab showing unread messages
- Push notifications via SNS or Expo Push to surface messages even when the app is closed
- First use case: onboarding message automatically sent when a player creates their account

**Open questions**
- One-way (admin → player) or two-way (players can reply)?
- Store messages in DynamoDB with a `read` flag, or use a third-party service (e.g. OneSignal)?

---

## Internationalisation (i18n)

Add Portuguese (pt-BR / pt-PT) and Spanish (es) translations.

**Ideas to explore**
- Use `i18next` + `react-i18next` — the standard React Native i18n stack
- Detect device locale on first launch, allow manual override in settings
- Extract all UI strings into translation files (`en.json`, `pt.json`, `es.json`)
- Backend error messages may also need translating

**Open questions**
- Brazil Portuguese vs European Portuguese — same file or separate?
- Date/number formatting (e.g. rating charts, match dates) via `Intl` APIs

---

## Player Discovery & Profiles

As the player base grows, finding the right person becomes harder — especially with duplicate names.

**Ideas to explore**

### Search & Filtering
- Search bar on the Ranking screen filtering by name in real time
- Filter by club, location, or rating band
- "Players near me" using optional location permission

### Richer Profiles
- Profile photo upload (the avatar picker feature flag is already in the codebase)
- Location / home club field on the player profile
- Short bio or skill level tag (beginner / intermediate / advanced)
- Public profile URL or QR code to share with new players

### Preventing Name Confusion
- Display full name + club/location as a subtitle in lists
- Fallback initials avatar with a unique colour derived from player ID (already partially there)
- Verified badge for players who have played a minimum number of approved matches

## Other Ideas (Parking Lot)

- **Match scheduling** — propose a match time, invite players, confirm attendance
- **Tournaments** — bracket-style competitions within a group
- **Club management** — group players under a club, club-level leaderboard
- **ELO history export** — download your rating history as CSV
- **Apple Sign-In** — already feature-flagged, just needs the IDP configured
