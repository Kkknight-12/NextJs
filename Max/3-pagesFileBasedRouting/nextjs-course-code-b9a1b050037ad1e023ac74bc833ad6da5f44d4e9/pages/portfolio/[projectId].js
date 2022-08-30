import React from "react";
import { useRouter } from "next/router";

export default function PortfolioProjectPage() {
  const router = useRouter();
  console.log(router.pathname); // /portfolio/[projectId]
  console.log(router.query); // {projectId: 'asd'} // give us value encoded
  // on the url
  return (
    <div>
      {"Nested Portfolio Project Page" + "--> " + router.query?.projectId}
    </div>
  );
}