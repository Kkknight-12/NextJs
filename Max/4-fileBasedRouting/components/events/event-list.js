import React from "react"
import EventItem from "./event-item"
import classes from "./event-list.module.css"

export default function EventList(props) {
  const { items } = props
  return (
    <ul className={classes.list}>
      {items.map((item) => (
        <EventItem key={item.id} item={item} />
      ))}
    </ul>
  )
}
