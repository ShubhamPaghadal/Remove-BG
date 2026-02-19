import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	ButtonBase,
	CardMedia,
	Stack,
	Typography,
	alpha,
	useMediaQuery
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/Card';
import { useMedia } from '@/hooks/responsive';

import placeholder1 from '@/images/placeholder-01.jpg';
import placeholder2 from '@/images/placeholder-02.jpg';
import placeholder3 from '@/images/placeholder-03.jpg';
import placeholder4 from '@/images/placeholder-04.jpg';
import placeholderThumbnail1 from '@/images/placeholder-thumbnail-01.webp';
import placeholderThumbnail1x2 from '@/images/placeholder-thumbnail-01x2.webp';
import placeholderThumbnail2 from '@/images/placeholder-thumbnail-02.webp';
import placeholderThumbnail2x2 from '@/images/placeholder-thumbnail-02x2.webp';
import placeholderThumbnail3 from '@/images/placeholder-thumbnail-03.webp';
import placeholderThumbnail3x2 from '@/images/placeholder-thumbnail-03x2.webp';
import placeholderThumbnail4 from '@/images/placeholder-thumbnail-04.webp';
import placeholderThumbnail4x2 from '@/images/placeholder-thumbnail-04x2.webp';
import {
	clearImages,
	clearDropzoneProps,
	setDropzoneProps
} from '@/store/editor';
import { fetchCredits, init } from '@/store/editor/thunks';
import { NoCreditsErrorListener } from '@/components/NoCreditsModal';
import { useSubscribed } from '@/hooks';
import { useDropzone } from '@/hooks/dropzone';
import { DropImagePopover } from '@/components/DropImagePopover';
import { ImageDropzone } from '@/components/ImageDropzone';
import { useAuthMe } from '@/store/auth/selectors';

import ModalFullDiscount from '@/pages/private/editor/ModalFullDiscount';
import { useAvailableCredits, useUploadFileFn } from '../editor/hooks';
import { MIN_SHOW_ALL_TEST_IMAGES } from './constants';
import { BULK_IMAGES_LIMIT } from '../editor/constants';
import { FastCheckout } from '../editor/FastCheckout';
import { ROLES } from '../users/constants';
import { useUserPermissions } from '../hooks/hooks';

export function Dashboard() {
	const { uploadFile, bulkUpload } = useUploadFileFn();
	const dispatch = useDispatch();
	const isSubscribed = useSubscribed();
	const { availableCredits, value } = useAvailableCredits();

	const { loggedIn } = useSelector(state => state.auth);
	const authMe = useSelector(useAuthMe);
	const { redirectIfNoPermissions } = useUserPermissions();

	const { t } = useTranslation();

	const mdDown = useMedia('mdDown');
	const showAll = useMediaQuery(
		theme => theme.breakpoints.up(MIN_SHOW_ALL_TEST_IMAGES),
		{
			noSsr: true
		}
	);

	const allowMultiFiles = isSubscribed || availableCredits;

	const placeholderImages = useMemo(() => {
		const imgs = [
			{
				id: 1,
				src: placeholder1,
				thumbnail: placeholderThumbnail1,
				thumbnail2x: placeholderThumbnail1x2
			},
			{
				id: 2,
				src: placeholder2,
				thumbnail: placeholderThumbnail2,
				thumbnail2x: placeholderThumbnail2x2
			},
			{
				id: 3,
				src: placeholder3,
				thumbnail: placeholderThumbnail3,
				thumbnail2x: placeholderThumbnail3x2
			}
		];

		if (showAll) {
			return imgs.concat([
				{
					id: 4,
					src: placeholder4,
					thumbnail: placeholderThumbnail4,
					thumbnail2x: placeholderThumbnail4x2
				}
			]);
		}
		return imgs;
	}, [showAll]);

	const handleDrop = (files, rejectedFiles = []) => {
		const allFiles = [...files, ...rejectedFiles];

		if (allowMultiFiles && allFiles.length > 1) {
			return bulkUpload(allFiles, rejectedFiles);
		}

		const [file] = allFiles;

		uploadFile(file, rejectedFiles);
	};

	const dropzone = useDropzone({
		onDrop: handleDrop,
		maxFiles: allowMultiFiles ? BULK_IMAGES_LIMIT : 1,
		multiple: allowMultiFiles,
		split: true
	});

	const getInitialImages = async () => {
		await dispatch(init({ loggedIn })).unwrap();
	};

	useEffect(() => {
		dispatch(clearImages());

		getInitialImages();
	}, []);

	useEffect(() => {
		if (loggedIn && !value) {
			dispatch(fetchCredits());
		}
	}, [loggedIn]);

	useEffect(() => {
		const dropRootProps = dropzone.getDropRootProps;
		dispatch(
			setDropzoneProps({
				getRootProps: dropRootProps,
				isDragActive: dropzone.isDragActive
			})
		);
		return () => dispatch(clearDropzoneProps());
	}, [dropzone]);

	useEffect(() => {
		if (authMe?.data?.role === ROLES.LIMITED) redirectIfNoPermissions();
	}, []);

	return (
		<>
			<FastCheckout />
			<ModalFullDiscount />
			<DropImagePopover dropzone={dropzone} />
			<NoCreditsErrorListener />
			<Card
				sx={{
					p: {
						xs: 1.5,
						md: 2
					},
					width: '100%',
					bgcolor: alpha('#fff', 0.4),
					boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.1)',
					backdropFilter: 'blur(1px)'
				}}
			>
				<ImageDropzone
					dropzone={dropzone}
					noDrag
					sx={{
						height: { xs: 252, md: 320 }
					}}
				/>

				<Stack
					justifyContent="center"
					pt={{ xs: 2.75, md: 5 }}
					pb={{ xs: 0, md: 5 }}
					px={{
						xs: 0,
						md: 2
					}}
					spacing={{ xs: 2, md: 4 }}
					useFlexGap
					alignItems="center"
					direction={{
						xs: 'column',
						md: 'row'
					}}
					mx={{ xs: 'auto', md: 0 }}
				>
					<Typography
						variant={mdDown ? 'body0' : 'body2'}
						fontWeight="semi"
						sx={{
							whiteSpace: {
								md: 'pre-line'
							}
						}}
					>
						{t('dashboard.placeholder.noImage')}
					</Typography>
					<Stack
						direction="row"
						alignItems="center"
						spacing={1}
						useFlexGap
					>
						{placeholderImages.map(image => (
							<Card key={image.id}>
								<ButtonBase
									onClick={() => {
										uploadFile(image.src);
									}}
								>
									<CardMedia
										image={image.thumbnail}
										style={{
											backgroundImage: `image-set(url(${image.thumbnail}) 1x, url(${image.thumbnail2x}) 2x)`,
											height: 80,
											width: 80
										}}
									/>
								</ButtonBase>
							</Card>
						))}
					</Stack>
				</Stack>
			</Card>
		</>
	);
}
