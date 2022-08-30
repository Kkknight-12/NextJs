import React from "react"
import { useRouter } from "next/router"

export default function clientProjectId() {
  const router = useRouter()
  console.log(router.pathname)
  console.log(router.query)

  /* 
    /clients/[id]/[clientProjectId]
    [clientProjectId].js:22 {id: 'mayank', clientProjectId: 'nextJsProject'} 
*/
  return (
    <div>
      {" "}
      <h1>Project Page for a specific Project for a selected client </h1>
    </div>
  )
}
