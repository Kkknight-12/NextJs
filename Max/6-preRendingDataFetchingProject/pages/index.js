import { getFeaturedEvents } from "../helper/api-utlis"
import EventList from "../components/events/event-list"

function HomePage(props) {
  return (
    <div>
      <EventList items={props.events} />
    </div>
  )
}

export async function getStaticProps() {
  /* show only featured events on the index js */
  const featuredEvents = await getFeaturedEvents()
  console.log("featuredEvents", featuredEvents)

  return {
    props: {
      events: featuredEvents,
    },
    revalidate: 1800,
  }
}

export default HomePage
