import { FabricText, Group, Rect, util } from 'fabric';
import { debounce } from '@/utils';

import { getVisibleBoundingBoxData } from './index';
import { getCustomControls, COLORS, setRotateUbication } from './controls';

export function fixPosition(smallObj, bigObj, initialOffset = { x: 0, y: 0 }) {
	const radian = util.degreesToRadians(smallObj.angle);
	const cos = Math.cos(radian);
	const sin = Math.sin(radian);

	const newOffsetX = initialOffset.x * cos - initialOffset.y * sin;
	const newOffsetY = initialOffset.x * sin + initialOffset.y * cos;

	bigObj.left = smallObj.left - newOffsetX * smallObj.scaleX;
	bigObj.top = smallObj.top - newOffsetY * smallObj.scaleY;
	bigObj.scaleX = smallObj.scaleX;
	bigObj.scaleY = smallObj.scaleY;

	bigObj.angle = smallObj.angle;

	bigObj.setCoords();
}

export function getRotationTooltip(text, width = 50, height = 28) {
	const tooltipBackground = new Rect({
		left: 0,
		top: 0,
		width,
		height,
		fill: 'black',
		rx: 10,
		ry: 10
	});

	const tooltipText = new FabricText(text, {
		left: tooltipBackground.width / 2 - 10,
		top: tooltipBackground.top / 2 + 5,
		width,
		height,
		fontSize: 16,
		fill: '#ffffff',
		fontFamily: 'Karla'
	});

	const group = new Group([tooltipBackground, tooltipText], {
		selectable: false,
		hoverCursor: 'default',
		visible: false,
		left: 20,
		top: 20,
		tooltipText,
		tooltipBackground,
		fixedSize: true
	});

	return group;
}

export function getAngleText(angle) {
	return `${angle.toFixed(0)}°`;
}

function getBoundingBoxFromCrop(data, ratio = 1) {
	const { top, left, width, height } = data;

	const visibleWidth = width * ratio;
	const visibleHeight = height * ratio;

	const centerX = left * ratio + visibleWidth / 2;
	const centerY = top * ratio + visibleHeight / 2;

	return {
		visibleWidth,
		visibleHeight,
		centerX,
		centerY
	};
}

export function getCropSelector({ img, canvas }) {
	const visibleBBData = getVisibleBoundingBoxData(img, { alphaMin: 10 });

	const { visibleWidth, visibleHeight, centerX, centerY } = visibleBBData;

	const rectLeft = centerX - visibleWidth / 2;
	const rectTop = centerY - visibleHeight / 2;

	const left = rectLeft + img.left;
	const top = rectTop + img.top;

	const cropSelector = new Rect({
		width: visibleWidth,
		height: visibleHeight,
		left,
		top,
		fill: 'transparent',
		borderColor: COLORS.main,
		borderOpacityWhenMoving: 1,
		cornerColor: COLORS.main,
		cornerSize: 12,
		cornerStyle: 'circle',
		transparentCorners: false,
		absolutePositioned: true,
		centeredRotation: true,
		selectable: true,
		scaleX: img.scaleX,
		scaleY: img.scaleY,
		angle: img.angle,
		lockMovementX: true,
		lockMovementY: true,
		lockRotation: true,
		lockScalingFlip: true
	});

	cropSelector.syncWithImage = () => {
		fixPosition(img, cropSelector, {
			x: -rectLeft,
			y: -rectTop
		});
	};

	cropSelector.syncWithImage();

	cropSelector.getCoords();

	cropSelector.controls = getCustomControls(cropSelector);

	cropSelector.setControlsVisibility({
		ml: true,
		mt: true,
		mr: true,
		mb: true,
		mtr: false,
		tl: false,
		tr: false,
		bl: false,
		br: false
	});

	canvas.renderAll();

	return { cropSelector };
}

export function getVisibleZoneSelector({
	img,
	canvas,
	callbacks,
	crop,
	ratio,
	dirty = false
}) {
	const {
		onRotate = () => {},
		onScale = () => {},
		onMove = () => {}
	} = callbacks || {};

	let visibleBBData =
		crop && !dirty ? getBoundingBoxFromCrop(crop, ratio) : null;

	if (!visibleBBData) {
		visibleBBData = getVisibleBoundingBoxData(img, { alphaMin: 10 });
	}

	const { visibleWidth, visibleHeight, centerX, centerY } = visibleBBData;

	const rectLeft = centerX - visibleWidth / 2;
	const rectTop = centerY - visibleHeight / 2;

	const left = rectLeft + img.left;
	const top = rectTop + img.top;

	const strokeFactor = 1;

	const customSelector = new Rect({
		width: visibleWidth,
		height: visibleHeight,
		left,
		top,
		fill: 'transparent',
		borderColor: COLORS.main,
		borderOpacityWhenMoving: 1,
		borderScaleFactor: -strokeFactor,
		strokeWidth: strokeFactor,
		cornerColor: COLORS.main,
		cornerSize: 12,
		cornerStyle: 'circle',
		transparentCorners: false,
		absolutePositioned: true,
		centeredRotation: true,
		selectable: true,
		scaleX: img.scaleX,
		scaleY: img.scaleY,
		angle: img.angle
	});

	const debouncedRotationUbication = debounce(() => {
		setRotateUbication?.(canvas, customSelector);
	}, 200);

	const rotationTooltip = getRotationTooltip(
		getAngleText(customSelector.angle)
	);

	customSelector.closeTooltips = () => {
		rotationTooltip.set({ visible: false });
	};

	customSelector.syncWithImage = () => {
		fixPosition(img, customSelector, {
			x: -rectLeft,
			y: -rectTop
		});
	};

	customSelector.syncWithImage();

	customSelector.controls = getCustomControls(customSelector);

	customSelector.setControlsVisibility({
		ml: false,
		mt: false,
		mr: false,
		mb: false,
		mtr: true
	});

	const initialOffset = {
		x: rectLeft,
		y: rectTop
	};

	customSelector.fixImagePosition = () => {
		fixPosition(customSelector, img, initialOffset);
	};

	// Events sincronization
	customSelector.on('rotating', () => {
		const centerPoint = customSelector.getCenterPoint();

		rotationTooltip.bringObjectToFront();
		rotationTooltip.tooltipText.set({
			text: getAngleText(customSelector.angle)
		});
		const textWidth = rotationTooltip.tooltipText.width;

		rotationTooltip.tooltipBackground.set({ width: textWidth + 26 });

		if (!rotationTooltip.visible) {
			const MIN_GAP = 10;

			const tooltipLeft = Math.min(
				Math.max(MIN_GAP, centerPoint.x - rotationTooltip.width / 2),
				canvas.width - rotationTooltip.width - MIN_GAP
			);

			const tooltipTop = Math.min(
				Math.max(MIN_GAP, centerPoint.y - rotationTooltip.height / 2),
				canvas.height - rotationTooltip.height - MIN_GAP
			);

			rotationTooltip.set({
				visible: true,
				left: tooltipLeft,
				top: tooltipTop
			});
		}

		customSelector.setControlsVisibility({
			tl: false,
			tr: false,
			bl: false,
			br: false
		});

		customSelector.fixImagePosition?.();

		onRotate?.({ img, customSelector });
	});

	customSelector.on('scaling', eventData => {
		const { transform = {} } = eventData;
		const { action } = transform;
		customSelector.setCoords();

		if (['scale', 'tl', 'tr', 'bl', 'br'].includes(action)) {
			customSelector.fixImagePosition?.();
			onScale?.({ img, customSelector });
			canvas.renderAll();
		}
	});

	customSelector.on('moving', () => {
		customSelector.fixImagePosition?.();
		onMove?.({ img, customSelector });
	});

	customSelector.on('mouseover', function () {
		if (customSelector.isSelected) return;

		const strokeWidth = strokeFactor / customSelector.scaleX;

		customSelector.set({
			stroke: COLORS.main,
			strokeWidth
		});

		canvas.renderAll();
	});

	customSelector.on('mouseout', function () {
		customSelector.set({ stroke: 'transparent' });

		canvas.renderAll();
	});

	customSelector.on('selected', function () {
		customSelector.isSelected = true;
		customSelector.set({ stroke: 'transparent' });

		canvas.renderAll();
	});

	customSelector.on('deselected', function () {
		customSelector.isSelected = false;
	});

	customSelector.on('mouseup', () => {
		customSelector.closeTooltips?.();
		customSelector.setControlsVisibility({
			tl: true,
			tr: true,
			bl: true,
			br: true
		});

		debouncedRotationUbication?.();
	});

	canvas.on('image:centered', () => {
		debouncedRotationUbication?.();
	});

	return { customSelector, rotationTooltip };
}
