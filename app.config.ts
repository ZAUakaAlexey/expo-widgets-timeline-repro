import type { ExpoConfig } from "expo/config";

const bundleIdentifier =
  process.env.BUNDLE_ID ?? "com.example.widgettimelinerepro";

const config: ExpoConfig = {
  name: "Widget Timeline Repro",
  slug: "expo-widgets-timeline-repro",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  ios: {
    bundleIdentifier,
    appleTeamId: process.env.APPLE_TEAM_ID,
    supportsTablet: false,
  },
  plugins: [
    [
      "expo-widgets",
      {
        groupIdentifier: `group.${bundleIdentifier}`,
        widgets: [
          {
            name: "ReproWidget",
            displayName: "Timeline Repro",
            description: "Four buttons, timeline length set from the app.",
            supportedFamilies: ["systemLarge"],
          },
        ],
      },
    ],
  ],
};

export default config;
