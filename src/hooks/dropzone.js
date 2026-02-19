import { useDropzone as useReactDropzone } from 'react-dropzone';
import { getImageAccepted } from '@/utils';
import { DEFAULT_MAX_IN_BYTES } from '@/utils/transaction';

export function useDropzone({ split, disabled, ...props }) {
	const data = useReactDropzone({
		maxFiles: 1,
		maxSize: DEFAULT_MAX_IN_BYTES,
		accept: getImageAccepted(),
		...props
	});

	if (split) {
		const {
			onDragEnter,
			onDragOver,
			onDragLeave,
			onDrop,
			onClick,
			onBlur,
			onFocus,
			onKeyDown,
			...rootProps
		} = data.getRootProps();

		const getDropProps = () => ({
			onDragEnter,
			onDragOver,
			onDragLeave,
			onDrop,
			...rootProps
		});

		const getClickProps = () => ({
			onClick,
			onBlur,
			onFocus,
			onKeyDown,
			...rootProps
		});

		data.getClickRootProps = getClickProps;
		data.getDropRootProps = getDropProps;
	}

	data.disabled = !!disabled;

	return data;
}
