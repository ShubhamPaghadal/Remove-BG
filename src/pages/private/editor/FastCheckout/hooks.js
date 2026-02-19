import { useEffect, useRef, useState } from 'react';
import { BUTTON_CONTAINER_HEIGHT } from './constants';

export function useStickyTop(smDown) {
	const dialogRef = useRef();
	const [dialogRefReady, setDialogRefReady] = useState(1);

	useEffect(() => {
		if (smDown) {
			return;
		}

		if (!dialogRef.current) {
			// if the user resizes the screen from smDown, dialogRef is not available yet
			setTimeout(() => {
				setDialogRefReady(v => v + 1);
			}, 100);
			return;
		}

		const container = dialogRef.current.querySelector(
			'.dialog-scrollbars > div'
		);

		if (!container) {
			return;
		}

		function handleScroll() {
			const { scrollTop, clientHeight } = container;
			container.style.setProperty(
				'--sticky-top',
				`${clientHeight + scrollTop - BUTTON_CONTAINER_HEIGHT}px`
			);
		}

		handleScroll();

		container.addEventListener('scroll', handleScroll);

		const observer = new ResizeObserver(entries => {
			const [entry] = entries;
			if (!entry) {
				return;
			}
			handleScroll();
		}).observe(container);

		return () => {
			container?.removeEventListener('scroll', handleScroll);
			observer?.disconnect();
		};
	}, [dialogRefReady, smDown]);

	return dialogRef;
}
