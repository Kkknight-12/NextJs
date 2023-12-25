import Link from "next/link"

const Header = () => {
  return (
    <header>
      <div>
        <Link href="/">Knight</Link>
      </div>
      <div>
        <Link href="/about">About</Link>
        <Link href="/about/team">Team</Link>
      </div>
    </header>
  )
}

export default Header
