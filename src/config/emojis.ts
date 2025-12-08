export const SEED_DATA = {
  gm: [
    { id: 0, icon: "🌱", name: "Seed / Gm", price: "Free", function: "gm" },
    { id: 1, icon: "🌿", name: "Sprout / Gm", price: "Free", function: "gm" },
    { id: 2, icon: "☘️", name: "Shamrock / Gm", price: "Free", function: "gm" },
    { id: 3, icon: "🍀", name: "Clover / Gm", price: "Free", function: "gm" },
    { id: 4, icon: "🍃", name: "Leaf / Gm", price: "Free", function: "gm" },
    { id: 5, icon: "🍂", name: "Fallen Leaf / Gm", price: "Free", function: "gm" },
    { id: 6, icon: "🍁", name: "Maple / Gm", price: "Free", function: "gm" },
    { id: 7, icon: "🌾", name: "Rice / Gm", price: "Free", function: "gm" },
    { id: 8, icon: "🎋", name: "Tanabata / Gm", price: "Free", function: "gm" },
    { id: 9, icon: "🎍", name: "Decoration / Gm", price: "Free", function: "gm" },
  ],
  deploy: [
    { id: 10, icon: "💐", name: "Bouquet / Deploy", price: "0.00003 ETH", function: "deploy" },
    { id: 11, icon: "🌷", name: "Tulip / Deploy", price: "0.00003 ETH", function: "deploy" },
    { id: 12, icon: "🌹", name: "Rose / Deploy", price: "0.00003 ETH", function: "deploy" },
    { id: 13, icon: "🥀", name: "Wilted / Deploy", price: "0.00003 ETH", function: "deploy" },
    { id: 14, icon: "🌺", name: "Hibiscus / Deploy", price: "0.00003 ETH", function: "deploy" },
    { id: 15, icon: "🌸", name: "Cherry / Deploy", price: "0.00003 ETH", function: "deploy" },
    { id: 16, icon: "🌼", name: "Blossom / Deploy", price: "0.00003 ETH", function: "deploy" },
    { id: 17, icon: "🌻", name: "Sunflower / Deploy", price: "0.00003 ETH", function: "deploy" },
    { id: 18, icon: "🌞", name: "Sun / Deploy", price: "0.00003 ETH", function: "deploy" },
    { id: 19, icon: "🌝", name: "Moon / Deploy", price: "0.00003 ETH", function: "deploy" },
  ],
  launch: [
    { id: 20, icon: "🎄", name: "Tree / Launch", price: "0.000045 ETH", function: "launch" },
    { id: 21, icon: "🌲", name: "Evergreen / Launch", price: "0.000045 ETH", function: "launch" },
    { id: 22, icon: "🌳", name: "Deciduous / Launch", price: "0.000045 ETH", function: "launch" },
    { id: 23, icon: "🌴", name: "Palm / Launch", price: "0.000045 ETH", function: "launch" },
    { id: 24, icon: "🌵", name: "Cactus / Launch", price: "0.000045 ETH", function: "launch" },
    { id: 25, icon: "🌾", name: "Rice / Launch", price: "0.000045 ETH", function: "launch" },
    { id: 26, icon: "🌿", name: "Herb / Launch", price: "0.000045 ETH", function: "launch" },
    { id: 27, icon: "☘️", name: "Shamrock / Launch", price: "0.000045 ETH", function: "launch" },
    { id: 28, icon: "🍀", name: "Clover / Launch", price: "0.000045 ETH", function: "launch" },
    { id: 29, icon: "🍁", name: "Maple / Launch", price: "0.000045 ETH", function: "launch" },
  ],
  donate: [
    { id: 30, icon: "🍒", name: "Fruit / Donate", price: "0.00006 ETH", function: "donate" },
    { id: 31, icon: "🍓", name: "Berry / Donate", price: "0.00006 ETH", function: "donate" },
    { id: 32, icon: "🍇", name: "Grapes / Donate", price: "0.00006 ETH", function: "donate" },
    { id: 33, icon: "🍎", name: "Apple / Donate", price: "0.00006 ETH", function: "donate" },
    { id: 34, icon: "watermelon", name: "Watermelon / Donate", price: "0.00006 ETH", function: "donate" },
    { id: 35, icon: "🍊", name: "Tangerine / Donate", price: "0.00006 ETH", function: "donate" },
    { id: 36, icon: "🍋", name: "Lemon / Donate", price: "0.00006 ETH", function: "donate" },
    { id: 37, icon: "🍌", name: "Banana / Donate", price: "0.00006 ETH", function: "donate" },
    { id: 38, icon: "🍍", name: "Pineapple / Donate", price: "0.00006 ETH", function: "donate" },
    { id: 39, icon: "🍐", name: "Pear / Donate", price: "0.00006 ETH", function: "donate" },
  ]
};

export const CATEGORY_LABELS = {
  gm: "🌱 Seed / Gm",
  deploy: "💐 Flower / Deploy",
  launch: "🎄 Tree / Launch",
  donate: "🍒 Fruit / Donate",
};

export function getEmojiById(id: number) {
  for (const category of Object.values(SEED_DATA)) {
    const found = category.find((item) => item.id === id);
    if (found) return found;
  }
  return SEED_DATA.gm[0];
}
