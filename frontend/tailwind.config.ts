import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	darkMode: 'class',
	theme: {
		screens: {
			xxs: '335px',
			xs: '390px',
			sm: '475px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1440px',
			'3xl': '1920px',
		},
		extend: {
			aria: {
				asc: 'sort="ascending"',
				desc: 'sort="descending"',
				invalid: 'invalid="true"',
				// selected: 'selected="true"',
			},
			data: {
				invalid: 'invalid="true"',
				open: 'state="open"',
				opened: 'opened="true"',
				closed: 'opened="false"',
				checked: 'state="checked"',
				active: 'state="active"',
				inactive: 'state="inactive"',
				current: 'current="true"',
				dragging: 'state="dragging"',
				'field-error': 'field-state="error"',
				'input-filled': 'input-state="filled"',
				'input-empty': 'input-state="empty"',
			},
			animation: {
				text: 'text 4s ease infinite',
				'text-reverse': 'text 4s ease reverse infinite',
				hide: 'hide 100ms ease-in',
				slideIn: 'slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)',
				swipeOut: 'swipeOut 100ms ease-out',
				'accordion-down': 'accordion-down 0.35s ease-out',
				'accordion-up': 'accordion-up 0.35s ease-out',
				'running-text': 'running-text 15s linear infinite',
				dots: 'dots 1.2s infinite',
				slideDownAndFade:
					'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				slideLeftAndFade:
					'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				slideRightAndFade:
					'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
			},
			keyframes: {
				text: {
					'0%, 100%': {
						'background-size': '200% 200%',
						'background-position': 'left center',
					},
					'50%': {
						'background-size': '200% 200%',
						'background-position': 'right center',
					},
				},
				hide: {
					from: { opacity: '1' },
					to: { opacity: '0' },
				},
				slideIn: {
					from: {
						transform: 'translateX(calc(100% + var(--viewport-padding)))',
					},
					to: { transform: 'translateX(0))' },
				},
				swipeOut: {
					from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
					to: { transform: 'translateX(calc(100% + var(--viewport-padding)))' },
				},
				dots: {
					'0%, 20%': { content: '""' },
					'40%': { content: '"."' },
					'60%': { content: '".."' },
					'80%, 100%': { content: '"..."' },
				},
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'running-text': {
					from: { transform: 'translate3d(100vw,0,0)' },
					to: { transform: 'translate3d(-120%,0,0)' },
				},
				slideDownAndFade: {
					from: { opacity: '0', transform: 'translateY(-2px)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},
				slideLeftAndFade: {
					from: { opacity: '0', transform: 'translateX(2px)' },
					to: { opacity: '1', transform: 'translateX(0)' },
				},
				slideUpAndFade: {
					from: { opacity: '0', transform: 'translateY(2px)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},
				slideRightAndFade: {
					from: { opacity: '0', transform: 'translateX(-2px)' },
					to: { opacity: '1', transform: 'translateX(0)' },
				},
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			borderWidth: {
				3: '3px',
				5: '5px',
				6: '6px',
				7: '7px',
				8: '8px',
			},
			colors: {
				brand: 'rgb(var(--brand) / <alpha-value>)',
				primary: 'rgb(var(--primary) / <alpha-value>)',
				'blue-dark': 'rgb(var(--blue-dark) / <alpha-value>)',
				'blue-light': 'rgb(var(--blue-light) / <alpha-value>)',
				error: 'rgb(var(--error) / <alpha-value>)',
				contrast: 'rgb(var(--contrast) / <alpha-value>)',
			},
			fontFamily: {
				ps2p: ['var(--font-ps2p)', ...defaultTheme.fontFamily.sans],
				silkscreen: ['var(--font-silkscreen)', ...defaultTheme.fontFamily.sans],
				poppins: ['var(--font-poppins)', ...defaultTheme.fontFamily.sans],
			},
			fontSize: {
				// sm: ['14px', '20px'],
				base: ['16px', '26px'],
				// lg: ['20px', '28px'],
				// xl: ['24px', '32px'],
			},
			spacing: {
				2.5: '0.625rem',
				4.5: '1.125rem',
				5.5: '1.375rem',
				6.5: '1.625rem',
				7.5: '1.875rem',
				8: '2rem',
				8.5: '2.125rem',
				9: '2.25rem',
				9.5: '2.375rem',
				11.5: '2.875rem',
				12: '3rem',
				12.5: '3.125rem',
				13: '3.25rem',
				14.5: '3.625rem',
				15: '3.75rem',
				17: '4.25rem',
				17.5: '4.375rem',
				18: '4.5rem',
				19: '4.75rem',
				22: '5.5rem',
				22.5: '5.625rem',
				25: '6.25rem',
				26: '6.5rem',
				27: '6.75rem',
				27.5: '6.875rem',
				30: '7.5rem',
				31: '7.75rem',
				32: '8rem',
				33: '8.25rem',
				34: '8.5rem',
				35: '8.75rem',
				36: '9rem',
				37: '9.25rem',
				37.5: '9.375rem',
				38: '9.5rem',
				42: '10.5rem',
				43: '10.75rem',
				44: '11rem',
				45: '11.25rem',
				46: '11.5rem',
				47: '11.75rem',
				48: '12rem',
				49: '12.25rem',
				50: '12.5rem',
				55: '13.75rem',
				56: '14rem',
				57: '14.25rem',
				58: '14.5rem',
				59: '14.75rem',
				60: '15rem',
				62: '15.5rem',
				62.5: '15.625rem',
				63: '15.75rem',
				64: '16rem',
				'vh-0': '0',
				'vh-1': 'calc(var(--vh,1vh) * 1)',
				'vh-2': 'calc(var(--vh,1vh) * 2)',
				'vh-3': 'calc(var(--vh,1vh) * 3)',
				'vh-4': 'calc(var(--vh,1vh) * 4)',
				'vh-4.5': 'calc(var(--vh,1vh) * 4.5)',
				'vh-5': 'calc(var(--vh,1vh) * 5)',
				'vh-5.5': 'calc(var(--vh,1vh) * 5.5)',
				'vh-6': 'calc(var(--vh,1vh) * 6)',
				'vh-7': 'calc(var(--vh,1vh) * 7)',
				'vh-8': 'calc(var(--vh,1vh) * 8)',
				'vh-9': 'calc(var(--vh,1vh) * 9)',
				'vh-10': 'calc(var(--vh,1vh) * 10)',
				'vh-11': 'calc(var(--vh,1vh) * 11)',
				'vh-12': 'calc(var(--vh,1vh) * 12)',
				'vh-13': 'calc(var(--vh,1vh) * 13)',
				'vh-14': 'calc(var(--vh,1vh) * 14)',
				'vh-15': 'calc(var(--vh,1vh) * 15)',
				'vh-16': 'calc(var(--vh,1vh) * 16)',
				'vh-17': 'calc(var(--vh,1vh) * 17)',
				'vh-18': 'calc(var(--vh,1vh) * 18)',
				'vh-19': 'calc(var(--vh,1vh) * 19)',
				'vh-20': 'calc(var(--vh,1vh) * 20)',
				'vh-25': 'calc(var(--vh,1vh) * 25)',
				'vh-30': 'calc(var(--vh,1vh) * 30)',
				'vh-40': 'calc(var(--vh,1vh) * 40)',
				'vh-50': 'calc(var(--vh,1vh) * 50)',
				'vh-60': 'calc(var(--vh,1vh) * 60)',
				'vh-70': 'calc(var(--vh,1vh) * 70)',
				'vh-80': 'calc(var(--vh,1vh) * 80)',
				'vh-90': 'calc(var(--vh,1vh) * 90)',
				'vh-100': 'calc(var(--vh,1vh) * 100)',
			},
			textDecorationThickness: {
				3: '3px',
				6: '6px',
			},
			zIndex: {
				1: '1',
				2: '2',
				60: '60',
			},
			opacity: {
				15: '.15',
			},
		},
	},
	corePlugins: {
		container: false,
	},
	plugins: [
		require('tailwindcss-animate'),
		require('@tailwindcss/typography'),
		require('tailwind-scrollbar'),
		plugin(function ({ addVariant }) {
			addVariant('hocus', ['&:hover', '&:focus-visible'])
			addVariant('group-hocus', ':merge(.group):hocus &')
			addVariant('peer-hocus', ':merge(.peer):hocus ~ &')
		}),
		require('tailwindcss-radix'),
	],
}

export default config
