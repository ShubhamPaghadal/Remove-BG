import { Drawer, Popover } from '@mui/material';
import { useMedia } from '@/hooks/responsive';
import { SignUpActions } from './SignUpActions';

function SignUpMenu({ open, anchorEl, onClose }) {
	const mdDown = useMedia('mdDown');

	if (mdDown) {
		return (
			<Drawer
				open={open}
				onClose={onClose}
				anchor="bottom"
				sx={{
					'.MuiPaper-root': {
						px: 2.5,
						pt: 3,
						pb: 4,
						borderRadius: '12px 12px 0px 0px'
					}
				}}
			>
				<SignUpActions onClick={onClose} />
			</Drawer>
		);
	}

	return (
		<Popover
			open={open}
			anchorEl={anchorEl}
			onClose={onClose}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'left'
			}}
			transformOrigin={{
				vertical: 'bottom',
				horizontal: 'left'
			}}
			anchorReference="anchorPosition"
			anchorPosition={
				anchorEl
					? {
							top: anchorEl.getBoundingClientRect().bottom - 52,
							left: anchorEl.getBoundingClientRect().left
						}
					: undefined
			}
			sx={{
				'.MuiPaper-root': {
					borderRadius: 2,
					width: 350,
					boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.15)',
					p: 1
				}
			}}
		>
			<SignUpActions onClick={onClose} />
		</Popover>
	);
}

export default SignUpMenu;
