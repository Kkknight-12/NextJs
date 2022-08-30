import { Fragment } from "react"
import Head from "next/head"

import {
  getAllEvents,
  getEventById,
  getFeaturedEvents,
} from "../../helper/api-utlis"
import EventSummary from "../../components/event-detail/event-summary"
import EventLogistics from "../../components/event-detail/event-logistics"
import EventContent from "../../components/event-detail/event-content"
import ErrorAlert from "../../components/ui/error-alert"

function EventDetailPage(props) {
  const event = props.selectedEvent

  if (!event) {
    return (
      // <ErrorAlert>
      //   <p>No event found!</p>
      // </ErrorAlert>
      <div className="center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <Fragment>
      <Head>
        <title>{event.title}</title>
        <meta name="description" content={event.description} />
      </Head>
      <EventSummary title={event.title} />
      <EventLogistics
        date={event.date}
        address={event.location}
        image={event.image}
        imageAlt={event.title}
      />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
    </Fragment>
  )
}
/* what props will EventDetailPage function will get  */
export async function getStaticProps(context) {
  const eventId = context.params.eventId
  const event = await getEventById(eventId)
  // console.log("PROPS", event)
  return {
    props: {
      selectedEvent: event,
    },
  }
}

/* what can be the id for the dynamic page, for which nextjs should pre render this page */
export async function getStaticPaths() {
  // const events = await getAllEvents()
  const events = await getFeaturedEvents()

  const paths = events.map((event) => {
    return {
      params: {
        eventId: event.id,
      },
    }
  })
  // console.log("PATH", paths)

  return {
    paths: paths,
    /* false -> no other path is possible. 
    If an unknown id is passed as params user will get 404 page
    
    true -> there are more pages that are not mentioned here, will see loading until the event is found

    blocking -> next js will not show anything untill we are done generating this page
    */
    fallback: "blocking",
  }
}
export default EventDetailPage
