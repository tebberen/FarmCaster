export const SEED_DATA = {
  gm: [
    { id: 0, icon: "🌱", name: "Fresh Sprout", desc: "Start fresh" },
    { id: 1, icon: "🌿", name: "Soft Leaf", desc: "Growing" },
    { id: 2, icon: "🍃", name: "Windy Leaf", desc: "Just checking in" },
    { id: 3, icon: "☘️", name: "Lucky Leaf", desc: "Feeling lucky" },
  ],
  deploy: [
    { id: 10, icon: "🌸", name: "Pink Bloom", desc: "Simple deploy" },
    { id: 11, icon: "🌺", name: "Wild Flower", desc: "Colorful update" },
    { id: 12, icon: "🌼", name: "Yellow Bloom", desc: "Visible action" },
    { id: 13, icon: "🌻", name: "Sunflower", desc: "Good deploy day" },
    { id: 14, icon: "🌷", name: "Tulip Shot", desc: "Trying new things" },
    { id: 15, icon: "🪷", name: "Lotus", desc: "Calm action" },
    { id: 16, icon: "💐", name: "Bouquet", desc: "Multiple features" },
    { id: 17, icon: "🏵️", name: "Medal Flower", desc: "Rewarded feel" },
    { id: 18, icon: "🪻", name: "Violet Stem", desc: "Niche experiment" },
    { id: 19, icon: "🌹", name: "Red Rose", desc: "Important deploy" },
  ],
  launch: [
    { id: 20, icon: "🌲", name: "Pine Launch", desc: "First big launch" },
    { id: 21, icon: "🌳", name: "Strong Oak", desc: "Solid foundation" },
    { id: 22, icon: "🌴", name: "Palm Launch", desc: "Exotic protocol" },
    { id: 23, icon: "🎄", name: "Festive Tree", desc: "Special event" },
    { id: 24, icon: "🌵", name: "Cactus Launch", desc: "Risky but fun" },
    { id: 25, icon: "🎋", name: "Bamboo Shoot", desc: "Rapid growth" },
    { id: 26, icon: "🎍", name: "New Year", desc: "Fresh start" },
    { id: 27, icon: "🪵", name: "Timber Day", desc: "Pivot / Restart" },
    { id: 28, icon: "🌾", name: "Field Grown", desc: "Long prep" },
    { id: 29, icon: "🪴", name: "Grown Plant", desc: "Serious business" },
  ],
  donate: [
    { id: 30, icon: "🍒", name: "Cherry Drop", desc: "Sweet support" },
    { id: 31, icon: "🍓", name: "Berry Boost", desc: "Creator support" },
    { id: 32, icon: "🍇", name: "Grapes", desc: "Multiple supports" },
    { id: 33, icon: "🍉", name: "Watermelon", desc: "Summer vibes" },
    { id: 34, icon: "🍎", name: "Red Apple", desc: "Classic support" },
    { id: 35, icon: "🍏", name: "Green Apple", desc: "Niche project" },
    { id: 36, icon: "🍊", name: "Orange Gift", desc: "Daily vitamin" },
    { id: 37, icon: "🍋", name: "Lemon Squeeze", desc: "Necessary help" },
    { id: 38, icon: "🍍", name: "Pineapple", desc: "Big share" },
    { id: 39, icon: "🥭", name: "Mango", desc: "Great feeling" },
  ],
};

// Helper to find emoji by ID (Used for History Grid)
export const getEmojiById = (id: number) => {
  const all = [...SEED_DATA.gm, ...SEED_DATA.deploy, ...SEED_DATA.launch, ...SEED_DATA.donate];
  return all.find(s => s.id === id)?.icon || "❓";
};
