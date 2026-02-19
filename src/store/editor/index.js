import { createSlice } from '@reduxjs/toolkit';
import { defaultSettings } from './utils';
import {
    init,
    removeBackground,
    editImage,
    resetImage,
    undo,
    redo,
    applyBrush,
    fetchCredits
} from './thunks';

export * from './backgrounds';
export * from './thunks';
export * from './utils';

// ── Constants ──────────────────────────────────────────────────────────────────
/**
 * Trigger action keys — stored as cookies to trigger post-login flows.
 * Used by FastCheckout and RateUs.
 */
export const TRIGGER_ACTIONS = {
    RATE_US: 'rate_us',
    DOWNLOAD: 'download'
};

const initialState = {
    images: [],
    selectedImage: null,
    settings: defaultSettings,
    section: null,
    tab: 'photo',
    subsection: 'brush',
    backgrounds: [],
    dropzoneProps: null,
    // Modal flags
    isModalFullDiscountOpen: false,
    // Editor UI flags
    downloadImage: null,
    selectionView: false,
    editView: false,
    bulkMode: false,
    // Thunk status shapes (for components that read loading state off state.editor.X)
    removeBackground: { loading: false },
    resetImage: { loading: false },
    init: { loading: false, data: null },
    applyBrush: { loading: false },
    fetchCredits: { data: null, loading: false, success: false, error: null }
};

const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        clearData: () => initialState,
        clearImages: (state) => {
            state.images = [];
            state.selectedImage = null;
        },
        addImage: (state, action) => {
            state.images.push(action.payload);
            if (!state.selectedImage) {
                state.selectedImage = action.payload.id;
            }
        },
        addLocalFiles: (state, action) => {
            const newfiles = action.payload || [];
            newfiles.forEach(file => {
                if (!state.images.find(img => img.id === file.id)) {
                    state.images.push(file);
                }
            });
            if (newfiles.length > 0 && !state.selectedImage) {
                state.selectedImage = newfiles[0].id;
            }
        },
        clearLocal: (state) => {
            state.images = state.images.filter(img => !img.localId);
        },
        restorePositions: (state) => {
            // Reset pan/zoom positions - canvas handles the actual transform
        },
        saveInStack: (state, action) => {
            // Placeholder — fabric canvas manages undo stacks externally
        },

        // ── Settings ────────────────────────────────────────────────────────
        setBlurWidth: (state, action) => {
            if (state.settings) state.settings.blurWidth = action.payload;
        },
        setBackgroundColor: (state, action) => {
            if (state.settings) state.settings.backgroundColor = action.payload;
        },
        setBackgroundImg: (state, action) => {
            if (state.settings) state.settings.background = action.payload;
        },
        setImagePositions: (state, action) => {
            // Placeholder
        },
        setImageSize: (state, action) => {
            // Placeholder
        },
        setSelectionView: (state, action) => {
            state.section = action.payload;
        },
        setZoom: (state, action) => {
            if (state.settings) state.settings.zoomLevel = action.payload;
        },
        updateSettings: (state, action) => {
            if (state.settings) {
                state.settings = { ...state.settings, ...action.payload };
            }
        },
        updateImageCroppedUrl: (state, action) => {
            // Placeholder
        },

        // ── Toolbar / UI ─────────────────────────────────────────────────────
        setSection: (state, action) => {
            state.section = action.payload;
        },
        setSubSection: (state, action) => {
            state.subsection = action.payload;
        },
        setTab: (state, action) => {
            state.tab = action.payload;
        },
        setActiveBlur: (state, action) => {
            if (state.settings) state.settings.activeBlur = action.payload;
        },
        setBlur: (state, action) => {
            if (state.settings) state.settings.blur = action.payload;
        },
        setBrushSize: (state, action) => {
            if (state.settings) state.settings.brushSize = action.payload;
        },
        updateImageHasChanges: (state, action) => {
            const image = state.images.find(img => img.id === state.selectedImage);
            if (image && image.settings) {
                image.settings.hasChanges = action.payload;
            }
        },
        centerImage: (state) => {
            // Signal to canvas to re-center — canvas hook listens to this
        },

        // ── Image management ─────────────────────────────────────────────────
        selectImage: (state, action) => {
            state.selectedImage = action.payload;
        },
        removeImage: (state, action) => {
            state.images = state.images.filter(img => img.id !== action.payload);
            if (state.selectedImage === action.payload) {
                state.selectedImage = state.images[0]?.id || null;
            }
        },
        setImageReady: (state, action) => {
            const { id, localId, ready } = action.payload || {};
            const image = state.images.find(
                img => img.id === id || img.localId === localId
            );
            if (image) image.ready = ready;
        },
        setDownload: (state, action) => {
            state.downloadImage = action.payload;
        },
        updateBaseBg: (state, action) => {
            const image = state.images.find(img => img.id === state.selectedImage);
            if (image) image.baseBackground = action.payload;
        },

        // ── Editor view flags ─────────────────────────────────────────────────
        setEditView: (state, action) => {
            state.editView = action.payload;
        },
        setBulk: (state, action) => {
            state.bulkMode = action.payload;
        },

        // ── Background library ────────────────────────────────────────────────
        addCustomBackground: (state, action) => {
            if (!state.backgrounds) state.backgrounds = [];
            state.backgrounds.push(action.payload);
        },
        removeCustomBackground: (state, action) => {
            state.backgrounds = (state.backgrounds || []).filter(
                bg => bg.id !== action.payload
            );
        },

        // ── Dropzone ──────────────────────────────────────────────────────────
        setDropzoneProps: (state, action) => {
            state.dropzoneProps = action.payload;
        },
        clearDropzoneProps: (state) => {
            state.dropzoneProps = null;
        },

        // ── Modals ────────────────────────────────────────────────────────────
        setIsModalFullDiscountOpen: (state, action) => {
            state.isModalFullDiscountOpen = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // init thunk
            .addCase(init.pending, (state) => {
                state.init.loading = true;
            })
            .addCase(init.fulfilled, (state, action) => {
                state.init.loading = false;
                state.init.data = action.payload;
                if (action.payload) {
                    state.images = action.payload.images || [];
                    state.selectedImage = action.payload.selectedImage;
                }
            })
            .addCase(init.rejected, (state) => {
                state.init.loading = false;
            })
            // removeBackground thunk
            .addCase(removeBackground.pending, (state) => {
                state.removeBackground.loading = true;
            })
            .addCase(removeBackground.fulfilled, (state) => {
                state.removeBackground.loading = false;
            })
            .addCase(removeBackground.rejected, (state) => {
                state.removeBackground.loading = false;
            })
            // resetImage thunk
            .addCase(resetImage.pending, (state) => {
                state.resetImage.loading = true;
            })
            .addCase(resetImage.fulfilled, (state) => {
                state.resetImage.loading = false;
            })
            .addCase(resetImage.rejected, (state) => {
                state.resetImage.loading = false;
            })
            // applyBrush thunk
            .addCase(applyBrush.pending, (state) => {
                state.applyBrush.loading = true;
            })
            .addCase(applyBrush.fulfilled, (state) => {
                state.applyBrush.loading = false;
            })
            .addCase(applyBrush.rejected, (state) => {
                state.applyBrush.loading = false;
            })
            // fetchCredits thunk
            .addCase(fetchCredits.pending, (state) => {
                state.fetchCredits.loading = true;
                state.fetchCredits.success = false;
                state.fetchCredits.error = null;
            })
            .addCase(fetchCredits.fulfilled, (state, action) => {
                state.fetchCredits.loading = false;
                state.fetchCredits.success = true;
                state.fetchCredits.data = action.payload;
            })
            .addCase(fetchCredits.rejected, (state, action) => {
                state.fetchCredits.loading = false;
                state.fetchCredits.success = false;
                state.fetchCredits.error = action.payload;
            });
    }
});

export const {
    clearData,
    clearImages,
    addImage,
    addLocalFiles,
    clearLocal,
    restorePositions,
    saveInStack,
    setBlurWidth,
    setBackgroundColor,
    setBackgroundImg,
    setImagePositions,
    setImageSize,
    setSelectionView,
    setZoom,
    updateSettings,
    updateImageCroppedUrl,
    setSection,
    setSubSection,
    setTab,
    setActiveBlur,
    setBlur,
    setBrushSize,
    updateImageHasChanges,
    centerImage,
    selectImage,
    removeImage,
    setImageReady,
    setDownload,
    updateBaseBg,
    setEditView,
    setBulk,
    addCustomBackground,
    removeCustomBackground,
    setDropzoneProps,
    clearDropzoneProps,
    setIsModalFullDiscountOpen
} = editorSlice.actions;

export default editorSlice.reducer;
