import Ionicons from "@expo/vector-icons/Ionicons";
import { Menu } from "@modules/glass-menu-android";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo, useState, type FC } from "react";
import { Appearance, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { MenuPressTarget } from "@/components/ui/menu-press-target";

import { ITEMS, type TItem } from "./data";
import type { TTheme } from "./theme";
import {
  Cell,
  GlassCircle,
  IconBadge,
  LargeTitle,
  SearchField,
  Section,
  Segmented,
  Sep,
  Thumb,
  Toggle,
} from "./ui";

type TProps = { t: TTheme; top: number; bottom: number };

const SORTS = ["Title", "Date Added", "Recently Updated"] as const;

const RowMenu: FC<{ t: TTheme; item: TItem; onFavorite: (id: string) => void; onDelete: (id: string) => void }> = ({
  t,
  item,
  onFavorite,
  onDelete,
}) => (
  <Menu colorScheme="auto">
    <MenuPressTarget accessibilityLabel={`Options for ${item.title}`} style={st.dots}>
      <View style={st.dotsInner}>
        <Ionicons name="ellipsis-horizontal" size={20} color={t.blue} />
      </View>
    </MenuPressTarget>
    <Menu.Content alignment="end">
      <Menu.Item id="share">
        <Menu.Item.Icon name="share" />
        <Menu.Item.Title>Share</Menu.Item.Title>
      </Menu.Item>
      <Menu.Item id="fav" onSelect={() => onFavorite(item.id)}>
        <Menu.Item.Icon name="heart" />
        <Menu.Item.Title>{item.favorite ? "Remove Favorite" : "Add to Favorites"}</Menu.Item.Title>
      </Menu.Item>
      <Menu.Item id="rename">
        <Menu.Item.Icon name="pencil" />
        <Menu.Item.Title>Rename</Menu.Item.Title>
      </Menu.Item>
      <Menu.Separator />
      <Menu.Item id="delete" destructive onSelect={() => onDelete(item.id)}>
        <Menu.Item.Icon name="trash" />
        <Menu.Item.Title>Delete</Menu.Item.Title>
      </Menu.Item>
    </Menu.Content>
  </Menu>
);

const LibraryScreen: FC<TProps> = ({ t, top, bottom }) => {
  const [items, setItems] = useState<TItem[]>(ITEMS);
  const [seg, setSeg] = useState(0);
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Date Added");
  const [grid, setGrid] = useState(false);
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    let list = items.filter((i) => (seg === 1 ? i.favorite : seg === 2 ? i.added >= 12 : true) && i.title.toLowerCase().includes(query.toLowerCase()));
    list = [...list].sort((a, b) =>
      sort === "Title" ? a.title.localeCompare(b.title) : b.added - a.added,
    );
    return list;
  }, [items, seg, sort, query]);

  const toggleFav = (id: string) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, favorite: !i.favorite } : i)));
  const remove = (id: string) => setItems((p) => p.filter((i) => i.id !== id));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.grouped }}
      contentContainerStyle={{ paddingBottom: bottom + 110 }}
    >
      <LargeTitle
        t={t}
        title="Library"
        top={top}
        right={
          <GlassCircle t={t} icon="ellipsis-horizontal" label="View and sort options">
            <Menu.Content alignment="end">
              <Menu.Label>View</Menu.Label>
              <Menu.Item id="list" checked={!grid} onSelect={() => setGrid(false)}>
                <Menu.Item.Icon name="list" />
                <Menu.Item.Title>List</Menu.Item.Title>
              </Menu.Item>
              <Menu.Item id="grid" checked={grid} onSelect={() => setGrid(true)}>
                <Menu.Item.Icon name="grid" />
                <Menu.Item.Title>Grid</Menu.Item.Title>
              </Menu.Item>
              <Menu.Separator />
              <Menu.Label>Sort by</Menu.Label>
              {SORTS.map((o) => (
                <Menu.Item key={o} id={o} checked={sort === o} onSelect={() => setSort(o)}>
                  <Menu.Item.Title>{o}</Menu.Item.Title>
                </Menu.Item>
              ))}
            </Menu.Content>
          </GlassCircle>
        }
      />
      <SearchField t={t} placeholder="Search albums" value={query} onChangeText={setQuery} />
      <View style={{ height: 14 }} />
      <Segmented t={t} options={["All", "Favorites", "Recent"]} value={seg} onChange={setSeg} />

      {grid ? (
        <View style={st.grid}>
          {shown.map((i) => (
            <Pressable key={i.id} style={st.gridItem} onPress={() => router.push({ pathname: "/detail", params: { id: i.id } })}>
              <Image source={i.image} contentFit="cover" style={st.gridImg} />
              <Text style={[st.gridTitle, { color: t.label }]} numberOfLines={1}>
                {i.title}
              </Text>
              <Text style={[st.gridSub, { color: t.secondary }]} numberOfLines={1}>
                {i.subtitle}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <Section t={t} header={`${shown.length} albums`}>
          {shown.map((i, idx) => (
            <View key={i.id}>
              {idx > 0 ? <Sep t={t} inset={80} /> : null}
              <Cell
                t={t}
                title={i.title}
                subtitle={i.subtitle}
                left={<Thumb source={i.image} size={52} radius={10} />}
                onPress={() => router.push({ pathname: "/detail", params: { id: i.id } })}
                right={
                  <>
                    {i.favorite ? <Ionicons name="heart" size={16} color={t.red} /> : null}
                    <RowMenu t={t} item={i} onFavorite={toggleFav} onDelete={remove} />
                  </>
                }
              />
            </View>
          ))}
        </Section>
      )}
    </ScrollView>
  );
};

const BrowseScreen: FC<TProps> = ({ t, top, bottom }) => {
  const feature = ITEMS[1];
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.grouped }}
      contentContainerStyle={{ paddingBottom: bottom + 110 }}
    >
      <LargeTitle t={t} title="Browse" top={top} />
      <Pressable
        style={st.hero}
        onPress={() => router.push({ pathname: "/detail", params: { id: feature.id } })}
      >
        <Image source={feature.image} contentFit="cover" style={StyleSheet.absoluteFill} />
        <View style={st.heroShade} />
        <Text style={st.heroKicker}>FEATURED</Text>
        <Text style={st.heroTitle}>{feature.title}</Text>
        <Text style={st.heroSub}>{feature.subtitle}</Text>
      </Pressable>
      <Text style={[st.rowHeader, { color: t.label }]}>Recently Added</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.hList}>
        {ITEMS.slice(2, 9).map((i) => (
          <Pressable key={i.id} style={st.card} onPress={() => router.push({ pathname: "/detail", params: { id: i.id } })}>
            <Image source={i.image} contentFit="cover" style={st.cardImg} />
            <Text style={[st.gridTitle, { color: t.label }]} numberOfLines={1}>
              {i.title}
            </Text>
            <Text style={[st.gridSub, { color: t.secondary }]} numberOfLines={1}>
              {i.subtitle}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <Text style={[st.rowHeader, { color: t.label }]}>Categories</Text>
      <Section t={t}>
        {[
          ["Mountains", "triangle", "#5E5CE6"],
          ["Water", "water", "#0A84FF"],
          ["Forests", "leaf", "#30B455"],
          ["Sky", "cloud", "#FF9F0A"],
        ].map(([name, icon, color], idx) => (
          <View key={name}>
            {idx > 0 ? <Sep t={t} inset={58} /> : null}
            <Cell
              t={t}
              title={name}
              left={<IconBadge icon={icon as never} color={color} />}
              chevron
            />
          </View>
        ))}
      </Section>
    </ScrollView>
  );
};

const FavoritesScreen: FC<TProps> = ({ t, top, bottom }) => {
  const [on, setOn] = useState({ notify: true, sync: true, wifi: false });
  const favs = ITEMS.filter((i) => i.favorite);
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.grouped }}
      contentContainerStyle={{ paddingBottom: bottom + 110 }}
    >
      <LargeTitle
        t={t}
        title="Favorites"
        top={top}
        right={
          <GlassCircle t={t} icon="add" label="New">
            <Menu.Content alignment="end">
              <Menu.Item id="album">
                <Menu.Item.Icon name="plus" />
                <Menu.Item.Title>New Album</Menu.Item.Title>
              </Menu.Item>
              <Menu.Item id="folder">
                <Menu.Item.Icon name="folder" />
                <Menu.Item.Title>New Folder</Menu.Item.Title>
              </Menu.Item>
              <Menu.Item id="import">
                <Menu.Item.Icon name="copy" />
                <Menu.Item.Title>Import</Menu.Item.Title>
              </Menu.Item>
            </Menu.Content>
          </GlassCircle>
        }
      />
      <Section t={t} header="Pinned">
        {favs.map((i, idx) => (
          <View key={i.id}>
            {idx > 0 ? <Sep t={t} inset={80} /> : null}
            <Cell
              t={t}
              title={i.title}
              subtitle={i.subtitle}
              left={<Thumb source={i.image} size={52} radius={10} />}
              chevron
              onPress={() => router.push({ pathname: "/detail", params: { id: i.id } })}
            />
          </View>
        ))}
      </Section>
      <Section t={t} header="Sharing" footer="Changes apply to all favorite albums.">
        <Cell
          t={t}
          title="Notifications"
          left={<IconBadge icon="notifications" color="#FF3B30" />}
          right={<Toggle t={t} on={on.notify} onChange={(v) => setOn({ ...on, notify: v })} />}
        />
        <Sep t={t} inset={58} />
        <Cell
          t={t}
          title="Sync Across Devices"
          left={<IconBadge icon="sync" color="#007AFF" />}
          right={<Toggle t={t} on={on.sync} onChange={(v) => setOn({ ...on, sync: v })} />}
        />
        <Sep t={t} inset={58} />
        <Cell
          t={t}
          title="Wi-Fi Only"
          left={<IconBadge icon="wifi" color="#34C759" />}
          right={<Toggle t={t} on={on.wifi} onChange={(v) => setOn({ ...on, wifi: v })} />}
        />
      </Section>
    </ScrollView>
  );
};

const THEMES = ["System", "Light", "Dark"] as const;

const SettingsScreen: FC<TProps> = ({ t, top, bottom }) => {
  const [appearance, setAppearance] = useState<(typeof THEMES)[number]>("System");
  const [haptics, setHaptics] = useState(true);
  const [autoplay, setAutoplay] = useState(false);
  const [quality, setQuality] = useState("High");
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.grouped }}
      contentContainerStyle={{ paddingBottom: bottom + 110 }}
    >
      <LargeTitle t={t} title="Settings" top={top} />
      <Section t={t}>
        <Cell
          t={t}
          title="Demo Account"
          subtitle="Local demo, no account connected"
          left={
            <View style={st.avatar}>
              <Text style={st.avatarText}>M</Text>
            </View>
          }
          chevron
        />
      </Section>
      <Section t={t} header="Display">
        <Menu colorScheme="auto">
          <MenuPressTarget accessibilityLabel="Appearance" style={st.rowTrigger}>
            <View pointerEvents="none"><Cell
              t={t}
              title="Appearance"
              left={<IconBadge icon="contrast" color="#5E5CE6" />}
              right={
                <View style={st.valueRow}>
                  <Text style={[st.value, { color: t.secondary }]}>{appearance}</Text>
                  <Ionicons name="chevron-expand" size={16} color={t.tertiary} />
                </View>
              }
            /></View>
          </MenuPressTarget>
          <Menu.Content alignment="end">
            {THEMES.map((o) => (
              <Menu.Item key={o} id={o} checked={appearance === o} onSelect={() => { setAppearance(o); Appearance.setColorScheme(o === "System" ? "auto" : o.toLowerCase() as "light" | "dark"); }}>
                <Menu.Item.Title>{o}</Menu.Item.Title>
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu>
        <Sep t={t} inset={58} />
        <Menu colorScheme="auto">
          <MenuPressTarget accessibilityLabel="Quality" style={st.rowTrigger}>
            <View pointerEvents="none"><Cell
              t={t}
              title="Image Quality"
              left={<IconBadge icon="image" color="#FF9F0A" />}
              right={
                <View style={st.valueRow}>
                  <Text style={[st.value, { color: t.secondary }]}>{quality}</Text>
                  <Ionicons name="chevron-expand" size={16} color={t.tertiary} />
                </View>
              }
            /></View>
          </MenuPressTarget>
          <Menu.Content alignment="end">
            {["Standard", "High", "Original"].map((o) => (
              <Menu.Item key={o} id={o} checked={quality === o} onSelect={() => setQuality(o)}>
                <Menu.Item.Title>{o}</Menu.Item.Title>
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu>
      </Section>
      <Section t={t} header="General">
        <Cell
          t={t}
          title="Haptic Feedback"
          left={<IconBadge icon="phone-portrait" color="#34C759" />}
          right={<Toggle t={t} on={haptics} onChange={setHaptics} />}
        />
        <Sep t={t} inset={58} />
        <Cell
          t={t}
          title="Autoplay Videos"
          left={<IconBadge icon="play" color="#FF2D55" />}
          right={<Toggle t={t} on={autoplay} onChange={setAutoplay} />}
        />
        <Sep t={t} inset={58} />
        <Cell t={t} title="Storage" subtitle="3.2 GB used" left={<IconBadge icon="server" color="#8E8E93" />} chevron />
        <Sep t={t} inset={58} />
        <Cell t={t} title="About" left={<IconBadge icon="information" color="#007AFF" />} chevron />
      </Section>
      <Section t={t}>
        <Cell t={t} title="Sign Out" destructive />
      </Section>
      <Text style={[st.version, { color: t.secondary }]}>
        Glass Menu Demo v1.1 · Android re-creation of iOS Liquid Glass
      </Text>
    </ScrollView>
  );
};

const st = StyleSheet.create({
  dots: { width: 36, height: 36 },
  dotsInner: { flex: 1, alignItems: "center", justifyContent: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, gap: 14, marginTop: 20 },
  gridItem: { width: "47.5%" },
  gridImg: { width: "100%", aspectRatio: 1, borderRadius: 22 },
  gridTitle: { fontSize: 15, fontWeight: "600", marginTop: 8 },
  gridSub: { fontSize: 13, marginTop: 1 },
  hero: {
    marginHorizontal: 16,
    marginTop: 8,
    height: 230,
    borderRadius: 30,
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: 20,
  },
  heroShade: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.28)" },
  heroKicker: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "700", letterSpacing: 0.6 },
  heroTitle: { color: "#fff", fontSize: 28, fontWeight: "700", marginTop: 2 },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: 15, marginTop: 2 },
  rowHeader: { fontSize: 22, fontWeight: "700", marginTop: 26, marginLeft: 20 },
  hList: { paddingHorizontal: 16, gap: 14, paddingTop: 12 },
  card: { width: 150 },
  cardImg: { width: 150, height: 150, borderRadius: 22 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#8E8E93", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 24, fontWeight: "600" },
  rowTrigger: { height: 56 },
  valueRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  value: { fontSize: 17 },
  version: { textAlign: "center", fontSize: 12, marginTop: 20 },
});

export { BrowseScreen, FavoritesScreen, LibraryScreen, SettingsScreen };
