import {
  getAllEvents,
  getEventById,
  getFeaturedEvents,
} from "../../helper/api-utlis";
import EventSummary from "../../components/event-detail/event-summary";
import EventLogistics from "../../components/event-detail/event-logistics";
import EventContent from "../../components/event-detail/event-content";
import Head from "next/head";
// import ErrorAlert from "../../components/ui/error-alert";

function EventDetailPage(props) {
  const event = props.selectedEvent;

  if (!event) {
    return (
      // <ErrorAlert>
      //   <p>No event found!</p>
      // </ErrorAlert>
      <div className="center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{event.title}</title>
        <meta
          name="description"
          content="Find allot of great events that allow you to evolve..."
        />
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
    </>
  );
}
/* what props will EventDetailPage function will get  */
export async function getStaticProps(context) {
  const eventId = context.params.eventId;
  const event = await getEventById(eventId);
  // console.log("PROPS", event)

  if (!event) {
    return {
      redirect: {
        destination: "/no-data",
      },
    };
  }

  if (event.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      selectedEvent: event,
    },
    revalidate: 30,
  };
}

/* what can be the id for the dynamic page, for which nextjs should pre render this page */
export async function getStaticPaths() {
  // const events = await getAllEvents()
  const events = await getFeaturedEvents();

  const paths = events.map((event) => {
    return {
      params: {
        eventId: event.id,
      },
    };
  });
  // console.log("PATH", paths)

  return {
    paths: paths,
    /* false -> no other path is possible. 
    If an unknown id is passed as params user will get 404 page
    
    true -> there are more pages that are not mentioned here, will see loading until the event is found

    blocking -> next js will not show anything until we are done generating this page
    */
    fallback: "blocking",
  };
}
export default EventDetailPage;