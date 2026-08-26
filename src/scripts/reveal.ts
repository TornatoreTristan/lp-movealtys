/**
 * Progressive reveal for elements tagged with `data-reveal`.
 * No-ops when the visitor prefers reduced motion or when IntersectionObserver is unavailable.
 */
export function initReveal(): void {
  const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]')
  if (nodes.length === 0) return

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    nodes.forEach((node) => node.classList.add('is-revealed'))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
  )

  nodes.forEach((node, index) => {
    // Stagger siblings that share a parent so grids cascade rather than pop.
    const siblingIndex = Array.from(node.parentElement?.children ?? []).indexOf(node)
    node.style.setProperty('--reveal-delay', `${Math.min(siblingIndex, 5) * 80}ms`)
    if (index === 0) node.style.setProperty('--reveal-delay', '0ms')
    observer.observe(node)
  })
}
