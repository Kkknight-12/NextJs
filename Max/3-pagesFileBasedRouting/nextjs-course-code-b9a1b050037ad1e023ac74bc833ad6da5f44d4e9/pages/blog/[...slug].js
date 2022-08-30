import React from "react"
import { useRouter } from "next/router"

export default function BlogPostsPage() {
  const router = useRouter()
  console.log(router.pathname) // /blog/[...slug]
  console.log(router.query) // slug: (2) ['2022', '12']

  return <div>BlogPostsPage</div>
}
