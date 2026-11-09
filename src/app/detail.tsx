import Ionicons from "@expo/vector-icons/Ionicons";
import { Menu } from "@modules/glass-menu-android";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import type { FC } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ITEMS } from "@/demo/data";
import { useTheme } from "@/demo/theme";
import { Cell, GlassCircle, IconBadge, Section, Sep } from "@/demo/ui";

const Detail: FC = () => {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = ITEMS.find((i) => i.id === id) ?? ITEMS[0];

  return (
    <View style={{ flex: 1, backgroundColor: t.grouped }}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}>
        <View style={{ height: 380 }}>
          <Image source={item.image} contentFit="cover" style={{ flex: 1 }} />
          <View
            style={{
              position: "absolute",
              top: insets.top + 8,
              left: 16,
              right: 16,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Pressable
              onPress={() => router.back()}
              accessibilityLabel="Back"
              style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.3)", alignItems: "center", justifyContent: "center" }}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </Pressable>
            <GlassCircle t={{ ...t, label: "#FFFFFF" }} icon="ellipsis-horizontal" label="More">
              <Menu.Content alignment="end">
                <Menu.Item id="share">
                  <Menu.Item.Icon name="share" />
                  <Menu.Item.Title>Share</Menu.Item.Title>
                </Menu.Item>
                <Menu.Item id="copy">
                  <Menu.Item.Icon name="copy" />
                  <Menu.Item.Title>Copy Link</Menu.Item.Title>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Item id="delete" destructive>
                  <Menu.Item.Icon name="trash" />
                  <Menu.Item.Title>Delete Album</Menu.Item.Title>
                </Menu.Item>
              </Menu.Content>
            </GlassCircle>
          </View>
        </View>
        <View style={{ padding: 20 }}>
          <Text style={{ color: t.label, fontSize: 30, fontWeight: "700" }}>{item.title}</Text>
          <Text style={{ color: t.secondary, fontSize: 16, marginTop: 4 }}>{item.subtitle}</Text>
        </View>
        <Section t={t}>
          <Cell t={t} title="Add to Favorites" left={<IconBadge icon="heart" color="#FF3B30" />} chevron />
          <Sep t={t} inset={58} />
          <Cell t={t} title="Share Album" left={<IconBadge icon="share" color="#007AFF" />} chevron />
          <Sep t={t} inset={58} />
          <Cell t={t} title="Details" subtitle="Location, date, camera" left={<IconBadge icon="information" color="#8E8E93" />} chevron />
        </Section>
      </ScrollView>
    </View>
  );
};

export default Detail;
