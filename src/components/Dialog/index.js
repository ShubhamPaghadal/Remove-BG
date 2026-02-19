export * from './Dialog';

// Re-export MUI Dialog sub-components so consumers can import them
// from '@/components/Dialog' alongside the custom Dialog wrapper.
export {
    DialogContent,
    DialogActions,
    DialogTitle,
    dialogClasses
} from '@mui/material';
