"use client"

import React from "react"

import { UserMenu } from "./UserMenu"
import Container from "../container"
import Logo from "./logo"
import { Search } from "./search"

export default function Navbar() {
  return (
    <div className="fixed w-full bg-white z-10 showdow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <Logo />
            <Search />
            <UserMenu />
          </div>
        </Container>
      </div>
    </div>
  )
}
