

type TItem = {
  id: string;
  title: string;
  subtitle: string;
  added: number;
  favorite: boolean;
  image: number;
};

/* eslint-disable @typescript-eslint/no-require-imports */
const IMAGES: Record<string, number> = {
  beach: require("../../assets/showcase/beach.jpg"),
  flowers: require("../../assets/showcase/flowers.jpg"),
  forest: require("../../assets/showcase/forest.jpg"),
  hills: require("../../assets/showcase/hills.jpg"),
  lake: require("../../assets/showcase/lake.jpg"),
  meadow: require("../../assets/showcase/meadow.jpg"),
  mirror: require("../../assets/showcase/mirror.jpg"),
  path: require("../../assets/showcase/path.jpg"),
  peaks: require("../../assets/showcase/peaks.jpg"),
  road: require("../../assets/showcase/road.jpg"),
  sky: require("../../assets/showcase/sky.jpg"),
  stars: require("../../assets/showcase/stars.jpg"),
  trees: require("../../assets/showcase/trees.jpg"),
  valley: require("../../assets/showcase/valley.jpg"),
  waterfall: require("../../assets/showcase/waterfall.jpg"),
};

const mk = (
  key: string,
  title: string,
  subtitle: string,
  added: number,
  favorite = false,
): TItem => ({ id: key, title, subtitle, added, favorite, image: IMAGES[key] });

const ITEMS: TItem[] = [
  mk("lake", "Morning Lake", "12 photos \u00B7 Today", 15, true),
  mk("peaks", "Alpine Peaks", "48 photos \u00B7 Yesterday", 14),
  mk("beach", "Beach Days", "31 photos \u00B7 Sunday", 13, true),
  mk("forest", "Deep Forest", "9 photos \u00B7 Last week", 12),
  mk("waterfall", "Waterfall Trail", "22 photos \u00B7 Last week", 11),
  mk("stars", "Night Sky", "17 photos \u00B7 October", 10, true),
  mk("meadow", "Spring Meadow", "26 photos \u00B7 October", 9),
  mk("valley", "Green Valley", "14 photos \u00B7 September", 8),
  mk("road", "Open Road", "38 photos \u00B7 September", 7),
  mk("sky", "Golden Hour", "11 photos \u00B7 August", 6, true),
  mk("hills", "Rolling Hills", "19 photos \u00B7 August", 5),
  mk("mirror", "Mirror Water", "7 photos \u00B7 July", 4),
  mk("trees", "Tall Trees", "16 photos \u00B7 July", 3),
  mk("path", "Quiet Path", "10 photos \u00B7 June", 2),
  mk("flowers", "Wild Flowers", "29 photos \u00B7 June", 1),
];

export { ITEMS, type TItem };
