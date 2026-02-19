export const localBackgrounds = [];

const TOTAL_BACKGORUNDS = 60;

for (let i = 1; i <= TOTAL_BACKGORUNDS; i++) {
	localBackgrounds.push({
		id: i,
		local: true,
		path: new URL(`../../images/samples/bg/bg-${i}.webp`, import.meta.url)
			.href
	});
}
