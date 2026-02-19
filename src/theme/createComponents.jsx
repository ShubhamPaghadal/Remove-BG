import { ChevronDownIcon } from '@/components/Icons';
import {
	accordionClasses,
	createTheme,
	dialogClasses,
	inputLabelClasses,
	outlinedInputClasses,
	filledInputClasses,
	tabClasses,
	menuItemClasses
} from '@mui/material';

const muiTheme = createTheme();

/**
 *
 * @returns {import("@mui/material").Components}
 */
export const createComponents = palette => {
	return {
		MuiAccordion: {
			styleOverrides: {
				root: {
					backgroundColor: 'transparent',
					border: 'none',
					[`&.${accordionClasses.expanded}`]: {
						'&::before': {
							content: '""',
							opacity: '1 !important'
						},
						'& + &::before': {
							display: 'block !important'
						}
					}
				}
			},
			defaultProps: {
				elevation: 0,
				disableGutters: true
			}
		},
		MuiAccordionSummary: {
			styleOverrides: {
				root: {
					fontWeight: 700,
					fontSize: '20px',
					paddingLeft: '0',
					paddingRight: '0',
					[muiTheme.breakpoints.down('sm')]: {
						fontSize: '14px'
					}
				},
				content: {
					margin: '22px 0'
				}
			},
			defaultProps: {
				expandIcon: <ChevronDownIcon sx={{ color: 'primary.main' }} />
			}
		},
		MuiAccordionDetails: {
			styleOverrides: {
				root: {
					color: palette.text.secondary,
					fontSize: 16,
					paddingLeft: '0',
					paddingRight: '0',
					paddingTop: '0px',
					paddingBottom: '22px',
					[muiTheme.breakpoints.down('sm')]: {
						fontSize: '12px'
					}
				}
			}
		},
		MuiAccordionActions: {
			styleOverrides: {
				root: {
					paddingLeft: '0px',
					paddingRight: '0px'
				}
			}
		},
		MuiAlert: {
			styleOverrides: {
				root: {
					padding: '6px 12px',
					borderRadius: '12px'
				},
				icon: {
					fontSize: '24px',
					marginRight: '8px'
				},
				message: {
					display: 'flex',
					alignItems: 'center',
					overflow: 'auto',
					fontSize: '14px',
					color: '#141414'
				}
			}
		},
		MuiCssBaseline: {
			styleOverrides: {
				'*': {
					boxSizing: 'border-box'
				},
				html: {
					MozOsxFontSmoothing: 'grayscale',
					WebkitFontSmoothing: 'antialiased',
					display: 'flex',
					flexDirection: 'column',
					minHeight: '100%',
					width: '100%'
				},
				body: {
					display: 'none',
					flex: '1 1 auto',
					flexDirection: 'column',
					minHeight: '100%',
					width: '100%',
					// show site when translations are loaded
					'&[data-site-ready]': {
						display: 'flex'
					}
				},
				'#root': {
					display: 'flex',
					flex: '1 1 auto',
					flexDirection: 'column',
					height: '100%',
					width: '100%'
				},
				button: {
					backgroundColor: 'transparent',
					border: 0,
					cursor: 'pointer',
					margin: 0,
					padding: 0,
					color: 'inherit'
				},
				a: {
					textDecoration: 'none',
					color: 'inherit'
				},
				input: {
					// prevent iOS auto-zoom
					'@media only screen and (max-width: 600px) and (-webkit-min-device-pixel-ratio: 2)':
						{
							fontSize: '16px !important'
						}
				}
			}
		},
		MuiContainer: {
			styleOverrides: {
				maxWidthLg: {
					[muiTheme.breakpoints.down('md')]: {
						'&:not(.private-layout-container)': {
							paddingRight: '16px',
							paddingLeft: '16px'
							// maxWidth: 320
						}
					},
					[muiTheme.breakpoints.down('sm')]: {
						'&:not(.private-layout-container)': {
							// maxWidth: 320
						}
					},
					[muiTheme.breakpoints.up('lg')]: {
						maxWidth: '993px'
					}
				}
			}
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: '12px',
					border: '1px solid #E8E8E8'
				}
			},
			defaultProps: {
				variant: 'outlined',
				elevation: 0
			}
		},
		MuiCardContent: {
			styleOverrides: {
				root: {
					paddingLeft: '24px',
					paddingRight: '24px',
					[muiTheme.breakpoints.down('sm')]: {
						paddingLeft: '20px',
						paddingRight: '20px',
						'&:last-child': {
							paddingBottom: '20px'
						}
					}
				}
			}
		},
		MuiCardHeader: {
			styleOverrides: {
				root: {
					padding: '24px 24px 12px 24px',
					[muiTheme.breakpoints.down('sm')]: {
						padding: '20px 20px 12px 20px'
					}
				},
				title: {
					fontSize: '16px',
					fontWeight: 700,
					lineHeight: '24px'
				},
				subheader: {
					marginTop: '4px'
				}
			}
		},
		MuiCardActions: {
			styleOverrides: {
				root: {
					paddingLeft: '24px',
					paddingRight: '24px',
					paddingBottom: '24px'
				}
			}
		},
		MuiDialog: {
			styleOverrides: {
				paper: {
					borderRadius: '12px',
					boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.15)',
					margin: 20,

					[`&.${dialogClasses.paperFullScreen}`]: {
						borderRadius: 0,
						margin: 0
					}
				},
				paperWidthXl: {
					[muiTheme.breakpoints.down('sm')]: {
						marginLeft: 10,
						marginRight: 10,
						maxHeight: 'calc(100vh - 130px)'
					}
				}
			}
		},
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: '12px',
					textTransform: 'initial',
					padding: '8px 24px',
					fontWeight: 600,
					lineHeight: '24px',
					maxHeight: 40
				},
				outlined: {
					color: palette.text.primary
				},
				text: {
					root: {
						color: palette.text.primary,
						'&:hover': {
							backgroundColor: '#F7F7F7'
						},
						'&:active': {
							backgroundColor: palette.divider
						}
					}
				}
			},
			defaultProps: {
				disableElevation: true
			}
		},
		MuiButtonGroup: {
			styleOverrides: {
				groupedOutlined: {
					borderColor: '#E8E8E8',
					background: '#E8E8E8',
					color: palette.neutral[600],

					'&:hover': {
						background: palette.neutral[50],
						borderColor: '#E8E8E8'
					},

					'&.selected': {
						background: '#ffffff',
						color: '#000000'
					}
				}
			}
		},
		MuiFormHelperText: {
			styleOverrides: {
				root: {
					marginLeft: 0,
					marginRight: 0
				}
			}
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					[`.${inputLabelClasses.root}`]: {
						marginBottom: '4px',
						position: 'initial',
						transform: 'none',
						fontWeight: 600,
						fontSize: '14px',
						lineHeight: '24px',
						[`&.${inputLabelClasses.disabled}`]: {
							color: palette.text.secondary
						}
					}
				}
			},
			defaultProps: {
				variant: 'outlined',
				InputLabelProps: {
					shrink: true,
					variant: 'standard'
				}
			}
		},
		MuiOutlinedInput: {
			styleOverrides: {
				input: {
					borderRadius: '4px',
					paddingTop: '10px',
					paddingBottom: '10px',
					paddingRight: '12px',
					paddingLeft: '12px',
					[`&.${outlinedInputClasses.disabled}`]: {
						backgroundColor: '#E8E8E8',
						WebkitTextFillColor: '#262626'
					}
				},
				notchedOutline: {
					top: 0,
					borderColor: '#B8B8B8',
					legend: {
						display: 'none'
					},
					'&:hover': {
						borderColor: '#141414'
					}
				}
			}
		},
		MuiFilledInput: {
			styleOverrides: {
				root: {
					padding: 0,
					[`&.${filledInputClasses.error}`]: {
						outline: '2px solid #FE4256',
						outlineOffset: '-2px',
						'> input': {
							boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.15) !important'
						},
						'> textarea': {
							boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.15) !important'
						}
					},
					borderRadius: '8px',
					'&::before': {
						display: 'none'
					},
					'&::after': {
						display: 'none'
					}
				},
				input: {
					border: '2px solid #E8E8E8',
					borderRadius: '8px',
					padding: '8px 25px',
					backgroundColor: 'white',
					boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.15)',
					fontSize: '14px',

					[muiTheme.breakpoints.down('sm')]: {
						padding: '8px 16px'
					},

					[`&.${filledInputClasses.disabled}`]: {
						backgroundColor: '#F7F7F7',
						WebkitTextFillColor: '#B8B8B8'
					},
					'&:hover': {
						border: '2px solid black'
					},
					'&:focus': {
						border: '2px solid #A182F3',
						backgroundColor: 'white',
						borderRadius: '8px',
						boxShadow: '0px 6px 12px 0px rgba(161, 130, 243, 0.80)'
					},
					'&:active': {
						boxShadow: '0px 6px 12px 0px rgba(161, 130, 243, 0.80)',
						border: '2px solid #E8E8E8'
					},
					[`&.${filledInputClasses.error}`]: {
						backgroundColor: 'red'
					}
				}
			}
		},
		MuiTabs: {
			styleOverrides: {
				root: {
					borderBottom: `1px solid ${palette.divider}`,
					[`.${tabClasses.root} + .${tabClasses.root}`]: {
						marginInline: '24px 0px'
					}
				}
			}
		},
		MuiTab: {
			styleOverrides: {
				root: {
					minHeight: '50px',
					alignItems: 'left',
					fontSize: 16,
					minWidth: 0,
					padding: 0,
					textTransform: 'initial',
					color: palette.text.secondary,
					[`&.${tabClasses.selected}`]: {
						color: palette.text.primary
					}
				}
			},
			defaultProps: {
				iconPosition: 'start'
			}
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					borderBottom: `1px solid ${palette.divider}`,
					'&:first-of-type': {
						paddingLeft: 0
					},
					'&:last-of-type': {
						paddingRight: 0
					}
				}
			}
		},
		MuiSelect: {
			styleOverrides: {
				icon: {
					color: palette.text.primary
				}
			}
		},
		MuiChip: {
			styleOverrides: {
				root: {
					borderRadius: 12,
					fontSize: 14
				}
			}
		},
		MuiPagination: {
			defaultProps: {
				shape: 'rounded',
				variant: 'outlined',
				color: 'primary'
			},
			styleOverrides: {
				root: {
					marginTop: 24,
					[muiTheme.breakpoints.up('md')]: {
						marginTop: 40
					}
				}
			}
		},
		MuiPaginationItem: {
			styleOverrides: {
				root: {
					fontWeight: 700,
					fontSize: 12,
					borderColor: palette.neutral['200'],
					'&.Mui-selected': {
						color: '#000',
						backgroundColor: 'transparent'
					}
				},
				rounded: {
					borderRadius: 8
				},
				outlined: {
					'&, &.Mui-selected': {
						borderWidth: 2
					}
				}
			}
		},
		MuiMenu: {
			styleOverrides: {
				paper: {
					boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.15)',
					'&::-webkit-scrollbar': {
						width: 6,
						cursor: 'pointer',
						paddingTop: '4px'
					},
					'&::-webkit-scrollbar-track': {
						background: 'transparent',
						marginTop: '7px'
					},
					'&::-webkit-scrollbar-thumb': {
						background: 'rgba(0, 0, 0, 0.2)',
						borderRadius: '20px'
					}
				},
				list: {
					padding: '4px',
					[`.${menuItemClasses.root}`]: {
						fontSize: '12px',
						marginTop: '3px',
						borderRadius: '4px',
						minHeight: '34px',
						paddingLeft: '8px',
						paddingRight: '8px'
					}
				}
			},
			defaultProps: {
				sx: {
					maxHeight: '500px'
				}
			}
		}
	};
};
