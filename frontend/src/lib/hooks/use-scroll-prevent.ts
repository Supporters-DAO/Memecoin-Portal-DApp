'use client'

import {
	chain,
	getScrollParent,
	isIOS,
	useLayoutEffect,
} from '@react-aria/utils'
import { atom, useAtom } from 'jotai'

const visualViewport = typeof window !== 'undefined' && window.visualViewport

// HTML input types that do not cause the software keyboard to appear.
const nonTextInputTypes = new Set([
	'checkbox',
	'radio',
	'range',
	'color',
	'file',
	'image',
	'button',
	'submit',
	'reset',
])

const scrollAtom = atom<boolean>(false)

interface IUseScrollLock {
	state: boolean
	lock: () => void
	unlock: () => void
}

/**
 * Prevents scrolling on the document body on mount, and
 * restores it on unmount. Also ensures that content does not
 * shift due to the scrollbars disappearing.
 */
export function useScrollLock(initialState: boolean = false): IUseScrollLock {
	const [state, setState] = useAtom(scrollAtom)

	useLayoutEffect(() => {
		if (isIOS()) {
			return preventScrollMobileSafari(state)
		} else {
			return preventScrollStandard(state)
		}
	}, [state])

	const lock = () => setState(true)
	const unlock = () => setState(false)

	return { state, lock, unlock }
}

let saveMe = false
let scrollable: Element
let lastY = 0
let scrollX = 0
let scrollY = 0

const options = {
	passive: false,
	capture: true,
}

// For most browsers, all we need to do is set `overflow: hidden` on the root element, and
// add some padding to prevent the page from shifting when the scrollbar is hidden.
export function preventScrollStandard(lock: boolean = false) {
	const el = document.documentElement
	return lock
		? chain(
				setStyle(el, 'paddingRight', `${window.innerWidth - el.clientWidth}px`),
				setStyle(el, 'overflow', 'hidden')
			)
		: chain(setStyle(el, 'paddingRight', ''), setStyle(el, 'overflow', ''))
}

const onTouchStart = (e: TouchEvent) => {
	// Store the nearest scrollable parent element from the element that the user touched.
	scrollable = getScrollParent(e.target as Element)
	if (scrollable === document.documentElement && scrollable === document.body) {
		return
	}

	lastY = e.changedTouches[0].pageY
}

const onTouchMove = (e: TouchEvent) => {
	// Prevent scrolling the window.
	if (scrollable === document.documentElement || scrollable === document.body) {
		e.preventDefault()
		return
	}

	// Prevent scrolling up when at the top and scrolling down when at the bottom
	// of a nested scrollable area, otherwise mobile Safari will start scrolling
	// the window instead. Unfortunately, this disables bounce scrolling when at
	// the top but it's the best we can do.
	let y = e.changedTouches[0].pageY
	let scrollTop = scrollable.scrollTop
	let bottom = scrollable.scrollHeight - scrollable.clientHeight

	if ((scrollTop <= 0 && y > lastY) || (scrollTop >= bottom && y < lastY)) {
		e.preventDefault()
	}

	lastY = y
}

const onTouchEnd = (e: TouchEvent) => {
	let target = e.target as HTMLElement

	// Apply this change if we're not already focused on the target element
	if (willOpenKeyboard(target) && target !== document.activeElement) {
		e.preventDefault()

		// Apply a transform to trick Safari into thinking the input is at the top of the page
		// so it doesn't try to scroll it into view. When tapping on an input, this needs to
		// be done before the "focus" event, so we have to focus the element ourselves.
		target.style.transform = 'translateY(-2000px)'
		target.focus()
		requestAnimationFrame(() => {
			target.style.transform = ''
		})
	}
}

const onFocus = (e: FocusEvent) => {
	let target = e.target as HTMLElement
	if (willOpenKeyboard(target)) {
		// Transform also needs to be applied in the focus event in cases where focus moves
		// other than tapping on an input directly, e.g. the next/previous buttons in the
		// software keyboard. In these cases, it seems applying the transform in the focus event
		// is good enough, whereas when tapping an input, it must be done before the focus event. 🤷‍♂️
		target.style.transform = 'translateY(-2000px)'
		requestAnimationFrame(() => {
			target.style.transform = ''

			// This will have prevented the browser from scrolling the focused element into view,
			// so we need to do this ourselves in a way that doesn't cause the whole page to scroll.
			if (visualViewport) {
				if (visualViewport.height < window.innerHeight) {
					// If the keyboard is already visible, do this after one additional frame
					// to wait for the transform to be removed.
					requestAnimationFrame(() => {
						scrollIntoView(target)
					})
				} else {
					// Otherwise, wait for the visual viewport to resize before scrolling so we can
					// measure the correct position to scroll to.
					visualViewport.addEventListener(
						'resize',
						() => scrollIntoView(target),
						{ once: true }
					)
				}
			}
		})
	}
}

const onWindowScroll = () => {
	// Last resort. If the window scrolled, scroll it back to the top.
	// It should always be at the top because the body will have a negative margin (see below).
	window.scrollTo(0, 0)
}

export function preventScrollMobileSafari(lock: boolean = false) {
	const addStyles = () =>
		chain(
			setStyle(
				document.documentElement,
				'paddingRight',
				`${window.innerWidth - document.documentElement.clientWidth}px`
			),
			setStyle(document.documentElement, 'overflow', 'hidden'),
			setStyle(document.body, 'marginTop', `-${scrollY}px`)
		)

	const addEvents = () =>
		chain(
			addEvent2(document, 'touchstart', onTouchStart, options),
			addEvent2(document, 'touchmove', onTouchMove, options),
			addEvent2(document, 'touchend', onTouchEnd, options),
			addEvent2(document, 'focus', onFocus, true),
			addEvent2(window, 'scroll', onWindowScroll)
		)

	const removeStyles = () =>
		chain(
			setStyle(document.documentElement, 'paddingRight', ''),
			setStyle(document.documentElement, 'overflow', ''),
			setStyle(document.body, 'marginTop', '')
		)

	const removeEvents = () =>
		chain(
			removeEvent2(document, 'touchstart', onTouchStart, options),
			removeEvent2(document, 'touchmove', onTouchMove, options),
			removeEvent2(document, 'touchend', onTouchEnd, options),
			removeEvent2(document, 'focus', onFocus, true),
			removeEvent2(window, 'scroll', onWindowScroll)
		)

	const lockMobile = () => {
		if (!saveMe) {
			// Record the original scroll position so we can restore it.
			// Then ambassadors a negative margin to the body to offset it by the scroll position. This will
			// enable us to scroll the window to the top, which is required for the rest of this to work.
			scrollX = window.pageXOffset
			scrollY = window.pageYOffset
			// Restore styles and scroll the page back to where it was.
			addStyles()
			addEvents()
			saveMe = true
			// Scroll to the top. The negative margin on the body will make this appear the same.
			window.scrollTo(0, 0)
		}
	}
	const unlockMobile = () => {
		if (saveMe) {
			// Restore styles and scroll the page back to where it was.
			removeStyles()
			removeEvents()
			window.scrollTo(scrollX, scrollY)
			saveMe = false
		}
	}
	lock ? lockMobile() : unlockMobile()
}

// Sets a CSS property on an element, and returns a function to revert it to the previous value.
function setStyle(element: HTMLElement, style: string, value: string) {
	// @ts-ignore
	let cur = element.style[style]
	// @ts-ignore
	element.style[style] = value
	return () => {
		// @ts-ignore
		element.style[style] = cur
	}
}

// Adds an event listener to an element, and returns a function to remove it.
function addEvent<K extends keyof GlobalEventHandlersEventMap>(
	target: EventTarget,
	event: K,
	handler: (this: Document, ev: GlobalEventHandlersEventMap[K]) => any,
	options?: boolean | AddEventListenerOptions
) {
	// @ts-ignore
	target.addEventListener(event, handler, options)
	return () => {
		// @ts-ignore
		target.removeEventListener(event, handler, options)
	}
}

function addEvent2<K extends keyof GlobalEventHandlersEventMap>(
	target: EventTarget,
	event: K,
	handler: (this: Document, ev: GlobalEventHandlersEventMap[K]) => any,
	options?: boolean | AddEventListenerOptions
) {
	return () => {
		// @ts-ignore
		target.addEventListener(event, handler, options)
	}
}

function removeEvent2<K extends keyof GlobalEventHandlersEventMap>(
	target: EventTarget,
	event: K,
	handler: (this: Document, ev: GlobalEventHandlersEventMap[K]) => any,
	options?: boolean | AddEventListenerOptions
) {
	return () => {
		// @ts-ignore
		target.removeEventListener(event, handler, options)
	}
}

function scrollIntoView(target: Element) {
	let root = document.scrollingElement || document.documentElement
	while (target && target !== root) {
		// Find the parent scrollable element and adjust the scroll position if the target is not already in view.
		let scrollable = getScrollParent(target)
		if (
			scrollable !== document.documentElement &&
			scrollable !== document.body &&
			scrollable !== target
		) {
			let scrollableTop = scrollable.getBoundingClientRect().top
			let targetTop = target.getBoundingClientRect().top
			if (targetTop > scrollableTop + target.clientHeight) {
				scrollable.scrollTop += targetTop - scrollableTop
			}
		}

		// @ts-ignore
		target = scrollable.parentElement
	}
}

function willOpenKeyboard(target: Element) {
	return (
		(target instanceof HTMLInputElement &&
			!nonTextInputTypes.has(target.type)) ||
		target instanceof HTMLTextAreaElement ||
		(target instanceof HTMLElement && target.isContentEditable)
	)
}
