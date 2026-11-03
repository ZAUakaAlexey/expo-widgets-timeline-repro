# expo-widgets timeline repro

Minimal reproduction for an expo-widgets issue on iOS: a widget button tap gets slower as the
widget timeline gets longer.

`WidgetsTimelineProvider.getTimeline` hands WidgetKit every stored entry. WidgetKit archives every
entry it receives on each reload, and a button tap reloads the timeline, so every tap pays for the
whole timeline. In addition, `WidgetUserInteraction.perform()` calls
`WidgetCenter.shared.reloadTimelines(ofKind:)`, although WidgetKit already reloads the widget after
an interaction intent.

## Setup

- Expo SDK 58 (`expo` 58.0.22, `expo-widgets` 58.0.26, `@expo/ui` 58.0.26), React Native 0.88.1
- One `systemLarge` widget, `ReproWidget`, with four buttons. Each button increments a counter in
  the current entry.
- The app publishes a timeline of 1 or 24 entries, 15 minutes apart.

## Steps to reproduce

1. Set your bundle id and team, then build a Release build on a device:

   ```
   npm install
   BUNDLE_ID=<your.bundle.id> APPLE_TEAM_ID=<your team id> npx expo run:ios --configuration Release --device
   ```

2. Add the large "Timeline Repro" widget to the Home Screen.
3. Open the app, tap **Publish 1 entry**, go to the Home Screen and tap the widget buttons a few
   times. The counter updates almost at once.
4. Open the app, tap **Publish 24 entries**, go to the Home Screen and tap the widget buttons again.
   Each tap now takes visibly longer.
5. To measure, collect the device log right after tapping
   (`sudo log collect --device-udid <udid> --last 10m --output repro.logarchive`) and look at the
   `ExpoWidgetsTarget` process. Each render runs from `Request began for ReproWidget:systemLarge` to
   `Request ended for ReproWidget:systemLarge`. The `Prepared source to String(nil))` lines inside a
   render come 8 per archived entry in this widget, so they show how many entries WidgetKit
   archived.

## Results

iPhone 12 mini, iOS 26.7.1, Release build:

| Timeline   | Entries archived per render | Render time per tap |
| ---------- | --------------------------- | ------------------- |
| 1 entry    | 1                           | 0.06 to 0.08 s      |
| 24 entries | 24                          | 0.69 to 0.74 s      |

The same happens in a production app (Lethe Cards) with a heavier widget on expo-widgets 57.0.15:
about 1 s per render on an iPhone 12 mini and an iPhone 11, and about 3 s per tap on the iPhone 11,
where each tap was also reloaded twice and a Lock Screen family was rendered as well.

## Workaround that fixed it

A patch on expo-widgets 57.0.15 (`TimelineProvider.swift` and `AppIntent.swift`):

- `getTimeline` sorts the entries and returns only 3, starting at the entry in effect now, keeping
  their original `entryIndex`. The policy is `.atEnd` while more entries remain and `.never` when
  the window reaches the end of the stored timeline.
- `WidgetUserInteraction.perform()` no longer calls `reloadTimelines`.

With it, a render went from about 0.9 s to 0.10 to 0.15 s per tap, there was one reload per tap, and
with the app closed WidgetKit asked for the next window by itself, so time-based changes kept
working.
