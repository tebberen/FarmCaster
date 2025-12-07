export const SEED_DATA = {
  gm: [
    { id: 0, icon: "🌱", name: "Fresh Sprout" }, { id: 1, icon: "🌿", name: "Soft Leaf" }, { id: 2, icon: "🍃", name: "Windy Leaf" }, { id: 3, icon: "☘️", name: "Lucky Leaf" }
  ],
  deploy: [
    { id: 10, icon: "🌸", name: "Pink Bloom" }, { id: 11, icon: "🌺", name: "Wild Flower" }, { id: 12, icon: "🌼", name: "Yellow Bloom" }, { id: 13, icon: "🌻", name: "Sunflower" },
    { id: 14, icon: "🌷", name: "Tulip" }, { id: 15, icon: "🪷", name: "Lotus" }, { id: 16, icon: "💐", name: "Bouquet" }, { id: 17, icon: "🏵️", name: "Medal" }, { id: 18, icon: "🪻", name: "Violet" }, { id: 19, icon: "🌹", name: "Rose" }
  ],
  launch: [
    { id: 20, icon: "🌲", name: "Pine" }, { id: 21, icon: "🌳", name: "Oak" }, { id: 22, icon: "🌴", name: "Palm" }, { id: 23, icon: "🎄", name: "Festive" },
    { id: 24, icon: "🌵", name: "Cactus" }, { id: 25, icon: "🎋", name: "Bamboo" }, { id: 26, icon: "🎍", name: "New Year" }, { id: 27, icon: "🪵", name: "Timber" }, { id: 28, icon: "🌾", name: "Field" }, { id: 29, icon: "🪴", name: "Grown" }
  ],
  donate: [
    { id: 30, icon: "🍒", name: "Cherry" }, { id: 31, icon: "🍓", name: "Berry" }, { id: 32, icon: "🍇", name: "Grapes" }, { id: 33, icon: "🍉", name: "Watermelon" },
    { id: 34, icon: "🍎", name: "Red Apple" }, { id: 35, icon: "🍏", name: "Green Apple" }, { id: 36, icon: "🍊", name: "Orange" }, { id: 37, icon: "🍋", name: "Lemon" }, { id: 38, icon: "🍍", name: "Pineapple" }, { id: 39, icon: "🥭", name: "Mango" }
  ]
};

// Helper to find emoji by ID
export const getEmojiById = (id: number) => {
  const all = [...SEED_DATA.gm, ...SEED_DATA.deploy, ...SEED_DATA.launch, ...SEED_DATA.donate];
  return all.find(s => s.id === id)?.icon || "❓";
};
