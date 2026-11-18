/** One observer for the catalogue and workflow. Elements are fully visible without it. */
let observer: IntersectionObserver | undefined

// A stable React 19 callback ref. Unobserve after entry, or when a route/filter unmounts it.
export function enterOnView(node: HTMLElement | null) {
  if (!node || node.hasAttribute('data-entered') || !('IntersectionObserver' in window)) return
  if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return

  observer ??= new IntersectionObserver(
    (entries, active) => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) continue
        target.setAttribute('data-entered', '')
        active.unobserve(target)
      }
    },
    { rootMargin: '0px 0px 8px 0px' },
  )

  observer.observe(node)
  return () => observer?.unobserve(node)
}
