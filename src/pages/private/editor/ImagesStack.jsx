import Scrollbars from 'react-custom-scrollbars-2';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { Stack } from '@mui/material';
import { removeImage, selectImage } from '@/store/editor';
import { getImageAccepted, showError } from '@/utils';
import transactionModel from '@/models/transaction';
import { useMedia } from '@/hooks/responsive';
import { DEFAULT_MAX_IN_BYTES, getErrorParams } from '@/utils/transaction';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSubscribed } from '@/hooks';

import { getImageUrl } from './utils';
import { ImageButton } from './ImageButton';
import { AddFileButton } from './AddFileButton';
import { useAvailableCredits, useUploadFileFn } from './hooks';
import { BULK_IMAGES_LIMIT, IMAGES_LIMIT } from './constants';

export function ImagesStack() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const isSubscribed = useSubscribed();

	const {
		images = [],
		selectedImage,
		localFiles = []
	} = useSelector(state => state.editor);

	const { availableCredits } = useAvailableCredits();

	const mdDown = useMedia('mdDown');

	const { uploadFile, bulkUpload } = useUploadFileFn(false);

	const allowMultiFiles = isSubscribed || availableCredits;

	const handleDrop = (files, rejectedFiles = []) => {
		const allFiles = [...files, ...rejectedFiles];

		if (allFiles.length > 1) {
			return bulkUpload(allFiles, rejectedFiles);
		}

		const [file] = allFiles;

		uploadFile(file, rejectedFiles);
	};

	const [deleting, setDeleting] = useState(false);

	const { getRootProps, getInputProps } = useDropzone({
		maxFiles: allowMultiFiles ? BULK_IMAGES_LIMIT : 1,
		multiple: allowMultiFiles,
		accept: getImageAccepted(),
		maxSize: DEFAULT_MAX_IN_BYTES,
		onDrop: handleDrop
	});

	const handleDelete = async (id, sync = true) => {
		try {
			setDeleting(true);
			dispatch(removeImage(id));

			if (sync) {
				await transactionModel.deleteTransaction(id);
			}
		} catch (err) {
			showError(err);
		} finally {
			setDeleting(false);
		}
	};

	const limitedImages = [...images].slice(-IMAGES_LIMIT);

	const parsedImages = mdDown ? [...limitedImages].reverse() : limitedImages;

	const imagesRender = parsedImages?.length
		? parsedImages.map(item => {
				const selected = item.id === selectedImage;

				const errorMessage =
					(item.error &&
						getErrorParams(item.error, t, navigate)?.[1]?.message) ||
					'';

				const itemProps =
					selected || item.error
						? {
								selected,
								loading: deleting,
								error: item.error,
								tooltipTitle: errorMessage,
								hoverDelete: () => handleDelete(item.id, !item.error)
							}
						: {
								onClick: () => {
									dispatch(selectImage(item.id));
								}
							};

				return (
					<ImageButton
						key={`uploaded-image-${item.id}`}
						imgSrc={item.tempBlob || getImageUrl(item.base?.path)}
						{...itemProps}
					/>
				);
			})
		: null;

	const localImagesRender = localFiles?.length
		? localFiles.map((item, idx) => {
				if (item.hideThumb) {
					return null;
				}

				return (
					<ImageButton
						key={`local-image-${idx}`}
						imgSrc={item.blob}
						imgAlt={item.path}
						loading
					/>
				);
			})
		: null;

	const addImageRender = (
		<AddFileButton {...getRootProps()} inputProps={getInputProps()} />
	);

	return (
		<Stack
			direction="row"
			justifyContent="flex-start"
			alignItems="center"
			gap={1}
		>
			{mdDown && addImageRender}

			{mdDown ? (
				<Scrollbars
					hideTracksWhenNotNeeded
					style={{ width: 'calc(100vw - 158px)', height: 48 }}
				>
					<Stack
						direction="row"
						justifyContent="flex-start"
						alignItems="center"
						gap={1}
					>
						{localImagesRender}
						{imagesRender}
					</Stack>
				</Scrollbars>
			) : (
				<>
					{imagesRender}
					{localImagesRender}
				</>
			)}

			{!mdDown && addImageRender}
		</Stack>
	);
}
