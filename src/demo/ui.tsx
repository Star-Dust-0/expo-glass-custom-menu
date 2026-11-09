import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-backdrop";
import { Image } from "expo-image";
import type { ComponentProps, FC, ReactNode } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Menu } from "@modules/glass-menu-android";
import { MenuPressTarget } from "@/components/ui/menu-press-target";

import type { TTheme } from "./theme";

type TIcon = ComponentProps<typeof Ionicons>["name"];

const LargeTitle: FC<{ t: TTheme; title: string; top: number; right?: ReactNode }> = ({
  t,
  title,
  top,
  right,
}) => (
  <View style={[s.titleRow, { paddingTop: top + 10 }]}>
    <Text style={[s.largeTitle, { color: t.label }]}>{title}</Text>
    {right}
  </View>
);

const GlassCircle: FC<{ t: TTheme; icon: TIcon; label: string; children?: ReactNode; glass?: boolean }> = ({
  t,
  icon,
  label,
  children,
  glass = true,
}) => (
  <Menu colorScheme="auto">
    <MenuPressTarget accessibilityLabel={label} glass={glass} style={s.circleFill}>
      <View style={s.center}>
        <Ionicons name={icon} size={22} color={t.label} />
      </View>
    </MenuPressTarget>
    {children}
  </Menu>
);

const SearchField: FC<{ t: TTheme; placeholder: string; value: string; onChangeText: (text: string) => void }> = ({ t, placeholder, value, onChangeText }) => (
  <View style={[s.search, { backgroundColor: t.fill }]}>
    <Ionicons name="search" size={17} color={t.secondary} />
    <TextInput placeholder={placeholder} placeholderTextColor={t.secondary} value={value} onChangeText={onChangeText} style={[s.searchText, { flex: 1, color: t.label, padding: 0 }]} />
  </View>
);

const Segmented: FC<{
  t: TTheme;
  options: string[];
  value: number;
  onChange: (i: number) => void;
}> = ({ t, options, value, onChange }) => (
  <View style={[s.segment, { backgroundColor: t.fill }]}>
    {options.map((o, i) => (
      <Pressable
        key={o}
        onPress={() => onChange(i)}
        style={[
          s.segmentItem,
          i === value && {
            backgroundColor: t.dark ? "#636366" : "#FFFFFF",
            ...s.segmentOn,
          },
        ]}
      >
        <Text
          style={[
            s.segmentText,
            { color: t.label, fontWeight: i === value ? "600" : "500" },
          ]}
        >
          {o}
        </Text>
      </Pressable>
    ))}
  </View>
);

const Section: FC<{ t: TTheme; header?: string; footer?: string; children: ReactNode }> = ({
  t,
  header,
  footer,
  children,
}) => (
  <View style={s.section}>
    {header ? (
      <Text style={[s.sectionHeader, { color: t.secondary }]}>{header.toUpperCase()}</Text>
    ) : null}
    <View style={[s.group, { backgroundColor: t.card }]}>{children}</View>
    {footer ? <Text style={[s.sectionFooter, { color: t.secondary }]}>{footer}</Text> : null}
  </View>
);

const Sep: FC<{ t: TTheme; inset?: number }> = ({ t, inset = 16 }) => (
  <View style={[s.sep, { backgroundColor: t.separator, marginLeft: inset }]} />
);

const IconBadge: FC<{ icon: TIcon; color: string }> = ({ icon, color }) => (
  <View style={[s.badge, { backgroundColor: color }]}>
    <Ionicons name={icon} size={17} color="#FFFFFF" />
  </View>
);

const Toggle: FC<{ t: TTheme; on: boolean; onChange: (v: boolean) => void }> = ({
  t,
  on,
  onChange,
}) => (
  <Pressable
    onPress={() => onChange(!on)}
    style={[s.toggle, { backgroundColor: on ? t.green : t.fill }]}
  >
    <View style={[s.knob, on && { transform: [{ translateX: 20 }] }]} />
  </Pressable>
);

const Cell: FC<{
  t: TTheme;
  title: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  chevron?: boolean;
  destructive?: boolean;
  onPress?: () => void;
}> = ({ t, title, subtitle, left, right, chevron, destructive, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [s.cell, pressed && { backgroundColor: t.fill }]}
  >
    {left}
    <View style={s.cellBody}>
      <Text style={[s.cellTitle, { color: destructive ? t.red : t.label }]} numberOfLines={1}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={[s.cellSub, { color: t.secondary }]} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </View>
    {right}
    {chevron ? <Ionicons name="chevron-forward" size={18} color={t.tertiary} /> : null}
  </Pressable>
);

const Thumb: FC<{ source: number; size: number; radius?: number }> = ({
  source,
  size,
  radius = 8,
}) => (
  <Image source={source} contentFit="cover" style={{ width: size, height: size, borderRadius: radius }} />
);

const TabBar: FC<{
  t: TTheme;
  bottom: number;
  tabs: readonly { key: string; label: string; icon: TIcon; iconOn: TIcon }[];
  active: string;
  onChange: (k: string) => void;
}> = ({ t, bottom, tabs, active, onChange }) => (
  <View style={[s.barWrap, { bottom: bottom + 8 }]} pointerEvents="box-none">
    <BlurView
      intensity={80}
      tint={t.tint}
      cornerRadius={36}
      style={s.bar}
    >
      <View style={s.barRow}>
        {tabs.map((tab) => {
          const on = tab.key === active;
          return (
            <Pressable
              key={tab.key}
              accessibilityLabel={tab.label}
              onPress={() => onChange(tab.key)}
              style={[s.barItem, on && { backgroundColor: t.fill }]}
            >
              <Ionicons
                name={on ? tab.iconOn : tab.icon}
                size={24}
                color={on ? t.blue : t.label}
              />
              <Text style={[s.barLabel, { color: on ? t.blue : t.label }]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </BlurView>
  </View>
);

const s = StyleSheet.create({
  titleRow: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  largeTitle: { fontSize: 34, fontWeight: "700", letterSpacing: 0.4 },
  circle: { width: 44, height: 44 },
  circleFill: { width: 44, height: 44 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  search: {
    marginHorizontal: 16,
    height: 38,
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 6,
  },
  searchText: { fontSize: 17 },
  segment: {
    marginHorizontal: 16,
    height: 34,
    borderRadius: 9,
    padding: 2,
    flexDirection: "row",
  },
  segmentItem: { flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 7 },
  segmentOn: { elevation: 2 },
  segmentText: { fontSize: 13 },
  section: { marginTop: 22, paddingHorizontal: 16 },
  sectionHeader: { fontSize: 13, marginLeft: 16, marginBottom: 7 },
  sectionFooter: { fontSize: 13, marginHorizontal: 16, marginTop: 7 },
  group: { borderRadius: 26, overflow: "hidden" },
  sep: { height: StyleSheet.hairlineWidth },
  badge: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  toggle: { width: 51, height: 31, borderRadius: 16, padding: 2 },
  knob: { width: 27, height: 27, borderRadius: 14, backgroundColor: "#FFFFFF", elevation: 2 },
  cell: {
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cellBody: { flex: 1 },
  cellTitle: { fontSize: 17 },
  cellSub: { fontSize: 14, marginTop: 1 },
  barWrap: { position: "absolute", left: 20, right: 20 },
  bar: { height: 72, borderRadius: 36, overflow: "hidden" },
  barRow: { flex: 1, flexDirection: "row", alignItems: "center", padding: 5, gap: 2 },
  barItem: {
    flex: 1,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  barLabel: { fontSize: 10, fontWeight: "600" },
});

export {
  Cell,
  GlassCircle,
  IconBadge,
  LargeTitle,
  SearchField,
  Section,
  Segmented,
  Sep,
  TabBar,
  Thumb,
  Toggle,
  type TIcon,
};
