import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {" "}
      <h1>HomePage </h1>
      <ul>
        <li>
          <Link href="/portfolio">Portfolio Page</Link>
        </li>
        <li>
          <Link href="/portfolio/list">Portfolio List Page</Link>
        </li>
        <li>
          <Link href="/clients">Clients Page</Link>
        </li>
      </ul>
    </div>
  );
}