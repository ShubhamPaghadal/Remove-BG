import { useScrollToTop } from '@/hooks';
import { useEffect } from 'react';

export function Page({ title, children }) {
	useScrollToTop();

	useEffect(() => {
		document.title = title;
	}, [title]);

	return children;
}
