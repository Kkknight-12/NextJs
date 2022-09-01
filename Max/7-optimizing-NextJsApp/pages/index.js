import { getFeaturedEvents } from "../helper/api-utlis";
import EventList from "../components/events/event-list";
import Head from "next/head";

function HomePage(props) {
  return (
    <div>
      <Head>
        <title>My page title</title>
        <meta
          name="description"
          content="Find allot of great events that allow you to evolve..."
        />
      </Head>
      <EventList items={props.events} />
    </div>
  );
}

export async function getStaticProps() {
  /* show only featured events on the index js */
  const featuredEvents = await getFeaturedEvents();
  console.log("featuredEvents", featuredEvents);

  return {
    props: {
      events: featuredEvents,
    },
    revalidate: 1800,
  };
}

export default HomePage;