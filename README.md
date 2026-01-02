# StrideX

**StrideX** is a clean, offline-first workout tracker built for runners who want a simple, fast way to log and plan their training.

### Features

- **Offline-first**: All workouts are stored locally — works perfectly without internet.
- **Monthly calendar view**: Navigate by month, see your training history at a glance.
- **Google Drive sync** (optional): One-click authorization to back up and sync your workouts across devices via a single JSON file in your personal Google Drive.
  - Auto-sync enabled when connected
  - Uses the restricted `drive.file` scope — StrideX only accesses the single file it creates
- **Import / Export**: Manual JSON backup/restore at any time.

### Google Drive Sync Details

- Click the Google Drive icon to connect.
- First time: Authorize StrideX → select a folder or existing `stridex-workouts.json` file.
- Once linked: Your workouts are automatically synced on every change.
- The sync file is stored **only in your own Google Drive** — no third-party servers.
- The access tokens expire after an hour.
- Disconnect anytime by clicking the green synced button.

**Important**: Sync is "last-write-wins". For best results, keep sync enabled while making changes. If you work offline for a long period and then reconnect, the remote file will overwrite local data.

### Privacy

StrideX never sends your workout data to any server. When Google Drive sync is enabled, your data is stored exclusively in a file in your personal Google Drive. No analytics, no tracking.

### Development

```bash
npm install
npm run dev
```
