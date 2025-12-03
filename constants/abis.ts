export const HUB_ABI = [
	{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
	{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},
	{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},
	{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"feature","type":"address"},{"indexed":false,"internalType":"uint256","name":"points","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"streak","type":"uint256"}],"name":"ActivityRecorded","type":"event"},
	{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserStats","outputs":[{"components":[{"internalType":"uint256","name":"totalPoints","type":"uint256"},{"internalType":"uint256","name":"currentStreak","type":"uint256"},{"internalType":"uint256","name":"maxStreak","type":"uint256"},{"internalType":"uint256","name":"totalTxCount","type":"uint256"},{"internalType":"uint256","name":"lastActivityTime","type":"uint256"},{"internalType":"uint256","name":"joinedAt","type":"uint256"}],"internalType":"struct FarmcasterHub.UserStats","name":"","type":"tuple"}],"stateMutability":"view","type":"function"}
] as const;

export const GARDEN_ABI = [
	{"inputs":[{"internalType":"address","name":"_hubAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
	{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"seedId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"pricePaid","type":"uint256"}],"name":"SeedPlanted","type":"event"},
	{"inputs":[{"internalType":"uint256","name":"seedId","type":"uint256"}],"name":"plant","outputs":[],"stateMutability":"payable","type":"function"},
	{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"seedPrices","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
] as const;
