export const localBackgrounds = [];

const TOTAL_BACKGORUNDS = 60;
const BASE = import.meta.env.BASE_URL || '/';

for (let i = 1; i <= TOTAL_BACKGORUNDS; i++) {
	localBackgrounds.push({
		id: i,
		local: true,
		path: `${BASE}images/samples/bg/bg-${i}.webp`
	});
}
