import { DeleteIcon } from '@/components/Icons';
import { Tooltip } from '@/components/Tooltip';
import { useMedia } from '@/hooks/responsive';
import { Box, ButtonBase, CircularProgress, Fade, Stack } from '@mui/material';
import { useState, useRef, useEffect } from 'react';

export function ImageButton({
	children,
	hoverDelete,
	imgSrc,
	imgAlt,
	size = 48,
	selected,
	loading,
	tooltipTitle,
	error,
	...rest
}) {
	const [isVisible, setIsVisible] = useState(false);
	const [mouseOver, setMouseOver] = useState(false);
	const mdDown = useMedia('mdDown');
	const ref = useRef();

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						setIsVisible(true);
						observer.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.1
			}
		);

		if (ref.current) observer.observe(ref.current);

		return () => {
			if (ref.current) observer.unobserve(ref.current);
		};
	}, []);

	const handleDelete = evt => {
		evt.stopPropagation();
		hoverDelete();
	};

	const wrapperStyles = {
		width: size,
		height: size,
		borderRadius: 2,
		border: ({ palette }) =>
			`1px solid ${selected ? palette.secondary.main : palette.divider}`,
		p: 0.5,
		position: 'relative',
		overflow: 'hidden',
		transition: 'all 0.25s ease-in-out',
		flexShrink: 0
	};

	const baseButtonProps = {
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 1
	};

	const mainRender =
		imgSrc && isVisible ? (
			<img width="100%" height="auto" src={imgSrc} alt={imgAlt} />
		) : (
			children
		);

	const loadingRender = (
		<Stack
			alignItems="center"
			justifyContent="center"
			sx={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				top: 0,
				left: 0
			}}
		>
			<CircularProgress size={size / 2} />
		</Stack>
	);

	return (
		<Tooltip title={tooltipTitle}>
			<ButtonBase
				{...rest}
				disableRipple={!imgSrc || !!hoverDelete}
				onMouseOver={() => setMouseOver(true)}
				onMouseLeave={() => setMouseOver(false)}
				{...(hoverDelete
					? {
							onClick: handleDelete
						}
					: {})}
				sx={theme => ({
					...wrapperStyles,
					'&:hover': {
						borderColor: error
							? theme.palette.error.main
							: theme.palette.neutral[600]
					},

					...(error ? { borderColor: theme.palette.error.main } : {})
				})}
				ref={ref}
			>
				<Fade
					in={(mouseOver || mdDown || loading) && !!hoverDelete}
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						p: 0.5
					}}
				>
					<Box onClick={handleDelete}>
						<Stack
							sx={theme => ({
								...baseButtonProps,
								background: loading
									? theme.palette.neutral[100]
									: '#FD7F57'
							})}
						>
							{loading ? (
								<CircularProgress size={size / 2} />
							) : (
								<DeleteIcon sx={{ color: 'secondary.contrastText' }} />
							)}
						</Stack>
					</Box>
				</Fade>
				<Box
					sx={{
						...baseButtonProps,
						overflow: 'hidden'
					}}
				>
					{mainRender}
				</Box>
				{loading && loadingRender}
			</ButtonBase>
		</Tooltip>
	);
}
