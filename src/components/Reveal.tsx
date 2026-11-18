import type { CSSProperties, ReactNode } from 'react'
import { useInView } from '../hooks/anim'

export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'h2' | 'h3' | 'p' | 'span'
}) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const style: CSSProperties = { ['--rv-delay' as string]: `${delay}s` }
  return (
    <Tag ref={ref as never} style={style} className={`rv ${inView ? 'in' : ''} ${className}`}>
      {children}
    </Tag>
  )
}
