import { useColorScheme } from "react-native";

type TTheme = {
  dark: boolean;
  bg: string;
  grouped: string;
  card: string;
  label: string;
  secondary: string;
  tertiary: string;
  separator: string;
  blue: string;
  red: string;
  green: string;
  fill: string;
  tint: "systemThinMaterialLight" | "systemThinMaterialDark";
};

const LIGHT: TTheme = {
  dark: false,
  bg: "#FFFFFF",
  grouped: "#F2F2F7",
  card: "#FFFFFF",
  label: "#000000",
  secondary: "rgba(60,60,67,0.6)",
  tertiary: "rgba(60,60,67,0.3)",
  separator: "rgba(60,60,67,0.18)",
  blue: "#007AFF",
  red: "#FF3B30",
  green: "#34C759",
  fill: "rgba(118,118,128,0.12)",
  tint: "systemThinMaterialLight",
};

const DARK: TTheme = {
  dark: true,
  bg: "#000000",
  grouped: "#000000",
  card: "#1C1C1E",
  label: "#FFFFFF",
  secondary: "rgba(235,235,245,0.6)",
  tertiary: "rgba(235,235,245,0.3)",
  separator: "rgba(84,84,88,0.65)",
  blue: "#0A84FF",
  red: "#FF453A",
  green: "#30D158",
  fill: "rgba(118,118,128,0.24)",
  tint: "systemThinMaterialDark",
};

const useTheme = (): TTheme => (useColorScheme() === "dark" ? DARK : LIGHT);

export { useTheme, type TTheme };
