import { useRouter } from "next/router";
import React from "react";

export default function ClientProjectsPage() {
  const router = useRouter();

  console.log("router.query", router.query);

  const loadProjectHander = () => {
    // load data...
    // router.push("/clients/knight/projecta")
    // or
    router.push({
      pathname: "/clients/[id]/[clientProjectId]",
      query: { id: router.query.id, clientProjectId: "projecta" },
    });
  };

  return (
    <div>
      {" "}
      <h1>The Project of a Given Client</h1>
      <button onClick={loadProjectHander}>Load Project A</button>
    </div>
  );
}