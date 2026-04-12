import { Link } from 'react-router-dom'
import { IMAGES } from '../constants/images'

type Props = {
  to?: string
  className?: string
}

export function Logo({ to = '/', className = '' }: Props) {
  const inner = (
    <>
      <img
        src={IMAGES.logoIcon}
        alt=""
        className="logo-mark-img"
        width={40}
        height={40}
        decoding="async"
      />
      <span className="logo-text">MotStart</span>
    </>
  )
  return to ? (
    <Link to={to} className={`logo ${className}`}>
      {inner}
    </Link>
  ) : (
    <span className={`logo ${className}`}>{inner}</span>
  )
}
