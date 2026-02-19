import { Control, controlsUtils } from 'fabric';
import { loadImage } from './index';

let rotationImage;

async function getRotateControlDraw() {
	const svg = `
	 <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
	   <circle cx="20" cy="20" r="20" fill="#A182F3"/>
	   <path d="M19.8571 31C18.4881 31 17.2067 30.7371 16.0129 30.2224C14.819 29.7076 13.7786 28.9957 12.8914 28.1086C12.0043 27.2214 11.3033 26.181 10.7776 24.9871C10.2519 23.7933 10 22.5119 10 21.1429H12.1905C12.1905 23.2786 12.9352 25.0857 14.4248 26.5752C15.9143 28.0648 17.7214 28.8095 19.8571 28.8095C21.9929 28.8095 23.8 28.0648 25.2895 26.5752C26.779 25.0857 27.5238 23.2786 27.5238 21.1429C27.5238 19.0071 26.779 17.2 25.2895 15.7105C23.8 14.221 21.9929 13.4762 19.8571 13.4762H19.6929L21.3905 15.1738L19.8571 16.7619L15.4762 12.381L19.8571 8L21.3905 9.5881L19.6929 11.2857H19.8571C21.2262 11.2857 22.5076 11.5486 23.7014 12.0633C24.8952 12.5781 25.9357 13.29 26.8229 14.1771C27.71 15.0643 28.411 16.1048 28.9367 17.2986C29.4624 18.4924 29.7143 19.7738 29.7143 21.1429C29.7143 22.5119 29.4514 23.7933 28.9367 24.9871C28.411 26.181 27.71 27.2214 26.8229 28.1086C25.9357 28.9957 24.8952 29.6967 23.7014 30.2224C22.5076 30.7481 21.2262 31 19.8571 31Z" fill="white"/>
	 </svg>
   `;

	const imgSrc = 'data:image/svg+xml;base64,' + btoa(svg);

	if (!rotationImage) {
		rotationImage = await loadImage(imgSrc);
	}

	return rotationImage;
}

export const COLORS = {
	main: '#A182F3',
	white: '#FFFFFF'
};

const renderCornerControl = (ctx, left, top) => {
	ctx.save();
	ctx.fillStyle = COLORS.white;
	ctx.strokeStyle = COLORS.main;
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.arc(left, top, 6, 0, Math.PI * 2, true);
	ctx.fill();
	ctx.stroke();
	ctx.restore();
};

const renderRotateControl = async (ctx, left, top) => {
	const controlImage = await getRotateControlDraw();

	ctx.save();
	ctx.translate(left, top);
	ctx.drawImage(controlImage, -20, -20, 40, 40);
	ctx.restore();
};

const controlBigSide = 25.5;
const controlSmallSide = 9.5;

const renderCropControl = ({
	ctx,
	left,
	top,
	rotation = -90,
	width = controlBigSide,
	height = controlSmallSide,
	rectX = -10,
	rectY = -5
}) => {
	ctx.save();

	ctx.fillStyle = COLORS.white;
	ctx.strokeStyle = COLORS.main;
	ctx.lineWidth = 1.5;

	const rx = 4.75;

	const rad = rotation * (Math.PI / 180);

	ctx.translate(left, top);

	ctx.beginPath();
	ctx.moveTo(rectX + rx, rectY);
	ctx.lineTo(rectX + width - rx, rectY);
	ctx.arcTo(rectX + width, rectY, rectX + width, rectY + height, rx);
	ctx.lineTo(rectX + width, rectY + height - rx);
	ctx.arcTo(
		rectX + width,
		rectY + height,
		rectX + width - rx,
		rectY + height,
		rx
	);
	ctx.lineTo(rectX + rx, rectY + height);
	ctx.arcTo(rectX, rectY + height, rectX, rectY + height - rx, rx);
	ctx.lineTo(rectX, rectY + rx);
	ctx.arcTo(rectX, rectY, rectX + rx, rectY, rx);
	ctx.closePath();

	ctx.rotate(rad);

	ctx.fill();
	ctx.stroke();

	ctx.restore();
};

const renderCropControlMl = (ctx, left, top) => {
	renderCropControl({
		ctx,
		left,
		top,
		width: controlSmallSide,
		height: controlBigSide,
		rectX: -5
	});
};

const renderCropControlMr = (ctx, left, top) => {
	renderCropControl({
		ctx,
		left,
		top,
		width: controlSmallSide,
		height: controlBigSide,
		rectX: -6
	});
};
const renderCropControlMt = (ctx, left, top) => {
	renderCropControl({
		ctx,
		left,
		top,
		rectY: -5
	});
};

const renderCropControlMb = (ctx, left, top) => {
	renderCropControl({
		ctx,
		left,
		top,
		rectY: -6
	});
};

const rotatePositions = {
	bottom: { x: 0, y: 0.5, offsetY: 40, offsetX: 0 },
	top: { x: 0, y: -0.5, offsetY: -40, offsetX: 0 },
	left: { x: -0.5, y: 0, offsetX: -40, offsetY: 0 },
	right: { x: 0.5, y: 0, offsetX: 40, offsetY: 0 }
};

function getMidPoint(point1, point2) {
	const { x: x1, y: y1 } = point1;
	const { x: x2, y: y2 } = point2;

	return {
		x: (x1 + x2) / 2,
		y: (y1 + y2) / 2
	};
}

function getSideMidPoints(obj) {
	const { aCoords } = obj;
	const { tl, tr, bl, br } = aCoords;

	return {
		top: getMidPoint(tl, tr),
		left: getMidPoint(tl, bl),
		right: getMidPoint(tr, br),
		bottom: getMidPoint(bl, br)
	};
}

function calculateDistance(p1, p2) {
	return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function findClosestPointData(center, points) {
	let closestPoint = null;
	let closestKey = null;
	let minDistance = Infinity;

	const pointsKeys = Object.keys(points);

	for (const pointKey of pointsKeys) {
		const pointCoords = points[pointKey];

		const distance = calculateDistance(center, pointCoords);

		if (distance < minDistance) {
			minDistance = distance;
			closestKey = pointKey;
			closestPoint = pointCoords;
		}
	}

	return { closestKey, closestPoint };
}

function getDefaultPosition(obj, canvas = window.mainCanvas) {
	if (!canvas || !obj) return 'bottom';

	const allMidPoints = getSideMidPoints(obj);
	const centerObj = canvas.getCenterPoint();
	const closestPointData = findClosestPointData(centerObj, allMidPoints);

	const { closestKey } = closestPointData;

	return closestKey;
}

export function getCustomControls(obj) {
	const rotateDefaultPosition = getDefaultPosition(obj);

	return {
		// Scale
		...(obj?.controls || {}),
		tl: new Control({
			...(obj?.controls?.tl || {}),
			x: -0.5,
			y: -0.5,
			offsetX: 0,
			offsetY: 0,
			actionName: 'tl',
			render: renderCornerControl,
			sizeY: 16,
			sizeX: 16
		}),
		tr: new Control({
			...(obj?.controls?.tr || {}),
			x: 0.5,
			y: -0.5,
			offsetX: 0,
			offsetY: 0,
			actionName: 'tr',
			render: renderCornerControl,
			sizeY: 16,
			sizeX: 16
		}),
		bl: new Control({
			...(obj?.controls?.bl || {}),
			x: -0.5,
			y: 0.5,
			offsetX: 0,
			offsetY: 0,
			actionName: 'bl',
			render: renderCornerControl,
			sizeY: 16,
			sizeX: 16
		}),
		br: new Control({
			...(obj?.controls?.br || {}),
			x: 0.5,
			y: 0.5,
			offsetX: 0,
			offsetY: 0,
			actionName: 'br',
			render: renderCornerControl,
			sizeY: 16,
			sizeX: 16
		}),
		// Crop
		ml: new Control({
			...(obj?.controls?.ml || {}),
			x: -0.5,
			y: 0,
			offsetX: 0,
			offsetY: 0,
			actionName: 'ml',
			render: renderCropControlMl,
			sizeY: 24,
			sizeX: 8
		}),
		mr: new Control({
			...(obj?.controls?.mr || {}),
			x: 0.5,
			y: 0,
			offsetX: 2,
			offsetY: 0,
			actionName: 'mr',
			render: renderCropControlMr,
			sizeY: 24,
			sizeX: 8
		}),
		mt: new Control({
			...(obj?.controls?.mt || {}),
			x: 0,
			y: -0.5,
			offsetX: 0,
			offsetY: 0,
			actionName: 'mt',
			render: renderCropControlMt,
			sizeY: 8,
			sizeX: 24
		}),
		mb: new Control({
			...(obj?.controls?.mb || {}),
			x: 0,
			y: 0.5,
			offsetX: 0,
			offsetY: 2,
			actionName: 'mb',
			render: renderCropControlMb,
			sizeY: 8,
			sizeX: 24
		}),
		// Rotate
		mtr: new Control({
			...rotatePositions?.[rotateDefaultPosition],
			cursorStyle: 'crosshair',
			actionHandler: controlsUtils.rotationWithSnapping,
			actionName: 'rotate',
			render: renderRotateControl,
			sizeY: 40,
			sizeX: 40
		})
	};
}

export function setRotateUbication(canvas = window.mainCanvas, obj) {
	if (!obj) return;

	const ubication = getDefaultPosition(obj, canvas);

	obj.controls.mtr = new Control({
		...(obj?.controls?.mtr || {}),
		...(rotatePositions?.[ubication] || rotatePositions.bottom)
	});

	canvas.discardActiveObject();
	canvas.setActiveObject(obj);
	canvas.requestRenderAll();
}
