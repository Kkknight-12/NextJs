import Link from "next/link"
import React from "react"

import classes from "./button.module.css"

export default function Button(props) {
  if (props.link) {
    return (
      /* 
      - if dont add the anchor tag then the link automatically
      - renders an anchor tag under the hood. where it basically controls
      - what happens when that link is clicked. so we dont send a request for a new file 
      - but instead it captures that request and loads a new page with Js only
      - But if you want to apply custom styling, then you need to add that
      - anchor tag on your own. The link component will detect that
      - there is now an anchor tag inside of it. and it will not longer render its own anchor tag
      - but instead renders yours. but then add all that functionality
      - where it captures clicks on that link and so on for you
      *************************************************************
      - look carefully we dont href attribute on this anchor tag. 
      - that will be added automatically by the link component, which 
      - is right wrapped around that. So, we just set it up like this.
      -  */
      <Link href={props.link}>
        <a className={classes.btn}>{props.children}</a>
      </Link>
    )
  }
  return (
    <button className={classes.btn} onClick={props.onClick}>
      {" "}
      {props.children}
    </button>
  )
}
