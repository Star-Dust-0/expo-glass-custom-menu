import { StatusBar } from "expo-status-bar";
import { useState, type FC } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  BrowseScreen,
  FavoritesScreen,
  LibraryScreen,
  SettingsScreen,
} from "@/demo/screens";
import { useTheme } from "@/demo/theme";
import { TabBar } from "@/demo/ui";

const TABS = [
  { key: "library", label: "Library", icon: "albums-outline", iconOn: "albums" },
  { key: "browse", label: "Browse", icon: "compass-outline", iconOn: "compass" },
  { key: "favorites", label: "Favorites", icon: "heart-outline", iconOn: "heart" },
  { key: "settings", label: "Settings", icon: "settings-outline", iconOn: "settings" },
] as const;

const Index: FC = () => {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<string>("library");
  const p = { t, top: insets.top, bottom: insets.bottom };

  return (
    <View style={{ flex: 1, backgroundColor: t.grouped }}>
      <StatusBar style={t.dark ? "light" : "dark"} />
      {tab === "library" ? <LibraryScreen {...p} /> : null}
      {tab === "browse" ? <BrowseScreen {...p} /> : null}
      {tab === "favorites" ? <FavoritesScreen {...p} /> : null}
      {tab === "settings" ? <SettingsScreen {...p} /> : null}
      <TabBar
        t={t}
        bottom={insets.bottom}
        tabs={TABS as never}
        active={tab}
        onChange={setTab}
      />
    </View>
  );
};

export default Index;
