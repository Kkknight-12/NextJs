# Pre-rendering Project

### Static Site Generation SSG

Starting Page must be visible to the search engine crawlers. It is important that they are able to understand our site and direct traffic to our site. And as a visitor on home page it would be nice if we see somthing instantly. It is also not likely that this data changes multiple time per second, so there is not reason fo reload. It is also not user specific data, and it is also not a data behind a login screen. 

It make a lot of sense to pre-render the page with some data. 

Why should we use for pre-rendering

- server side props for `server side pre-rendering` where the page is pre-rendered on the server on the fly on every second
- or we can go for `getStaticProps` to pre-render the page during the build process and also in the server with re-validate.

We dont need SSR for this kind of page so we can go with `getStaticProps`

```jsx
import { getFeaturedEvents } from "../helper/api-utlis"

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

  return {
    props: {
      events: featuredEvents,
    },

    revalidate: 1800,

  }
}

export default HomePage
```

now for the project we will be fetching data from the firebase not from dummy JSON file. 

![Screenshot 2022-08-31 at 3.10.05 PM.png](Pre-rendering%20Project%201aae0970b6a042a6b135f66b8afbb395/Screenshot_2022-08-31_at_3.10.05_PM.png)

```jsx
export async function getAllEvents() {
  const response = await fetch(
    "https://fir-function-ninja-7131d-default-rtdb.firebaseio.com/events.json"
  );

  const data = await response.json();

  const events = [];
  for (const key in data) {
    events.push({
      id: key,
      ...data[key],
    });
  }
  return events;
}

export async function getFeaturedEvents() {
	const allEvents = await getAllEvents();
  
}

export async function getEventById(id) {
	const allEvents = await getAllEvents();
  
}

export async function getFilteredEvents(dateFilter) {
  const allEvents = await getAllEvents();
  let filteredEvents = allEvents.filter((event) => {
    
  });
  return filteredEvents;
}
```

### Loading Data and Paths For Dynamic Data

Event Id is a dynamic page. So how do we fetch the data on /event/some-id page. Fetching the data on the client side don’t make much sense thought its unlikely that it will change a lot. And this page is for individual event and is more important to search engines than the starting page as it is the single event page that has all the details for events. So this page should be crawl able. We should have some data on this page right from the start. So definitely we want to pre-render this page data.

So we will go to `getStaticProps`  as we dont need here user specific data which changes all time time. 

```jsx
import {
  getEventById,
  getFeaturedEvents,
} from "../../helper/api-utlis";

function EventDetailPage(props) {
  const event = props.selectedEvent;
  console.log("event", event);

  if (!event) {
    return (
      <div className="center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      
    </>
  );
}
```

```jsx
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
```

![Screenshot 2022-08-31 at 3.09.39 PM.png](Pre-rendering%20Project%201aae0970b6a042a6b135f66b8afbb395/Screenshot_2022-08-31_at_3.09.39_PM.png)

```jsx
export async function getStaticPaths() {
  const events = await getFeaturedEvents();

  const paths = events.map((event) => {
    return {
      params: {
        eventId: event.id,
      },
    };
  });

  return {
    paths: paths,
    /* 
		false -> no other path is possible. 
    If an unknown id is passed as params user will get 404 page
    
    true -> there are more pages that are not mentioned here, will see loading until the event is found

    **blocking** -> next js will not show anything until we are done generating this page
    */
    fallback: "blocking",
  };
}
export default EventDetailPage;
```

### All Events Page

On All Events Page also we still want to statically generate the page so that we wanna fetch all the data in advance with `getStatcProps`  

```jsx
import { Fragment } from "react";
import { useRouter } from "next/router";

import { getAllEvents } from "../../helper/api-utlis";

function AllEventsPage(props) {
  const router = useRouter();

  function findEventsHandler(year, month) {
    const fullPath = `/events/${year}/${month}`;

    router.push(fullPath);
  }

  return (
    
  );
}
```

![Screenshot 2022-08-31 at 5.54.57 PM.png](Pre-rendering%20Project%201aae0970b6a042a6b135f66b8afbb395/Screenshot_2022-08-31_at_5.54.57_PM.png)

```jsx
export async function getStaticProps() {
  const events = await getAllEvents();
  return {
    props: {
      events: events,
      revalidate: 60,
    },
  };
}
```

### […slug] page

On the slug page, we are getting the concrete path values from the router.

- year , month

How we would like to do this on future we can use `getStaticProps` to pre generate **but** for filtered events we have lot of combinations of parameter. With getStaticPaths we can generate couple of combination of those paths, not all of them. For which we will use `Fallback: true` or blocking for request we have to fetch data. But how should we decide which path should be pre-generated. All possible filters are equally likely to be visited. 

`getStaticProps` might not be ideal here.

`serverSideProps` is better here. 

- so will fetch the data on the fly for every incoming request and return the page.

```jsx
import { Fragment } from "react";
import { useRouter } from "next/router";

import { getFilteredEvents } from "../../helper/api-utlis";
import EventList from "../../components/events/event-list";
import ResultsTitle from "../../components/events/results-title";
import Button from "../../components/ui/button";
import ErrorAlert from "../../components/ui/error-alert";

function FilteredEventsPage(props) {
  const router = useRouter();

  if (props.hasError) {
    return (
      <>
        <ErrorAlert>
          <p>Invalid filter. Please adjust your values!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </>
    );
  }

  const filteredEvents = props.events;

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>No events found for the chosen filter!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const date = new Date(props.date.year, props.date.month - 1);

  return (
    <Fragment>
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </Fragment>
  );
}
```

![Screenshot 2022-08-31 at 6.22.28 PM.png](Pre-rendering%20Project%201aae0970b6a042a6b135f66b8afbb395/Screenshot_2022-08-31_at_6.22.28_PM.png)

```jsx
/* 
- Next.js will pre-render this page on each request using 
- the data returned by getServerSideProps. 
*/
export async function getServerSideProps(context) {
  const { params } = context;

  // console.log("CONTEXT", context.params)
  const filterData = params.slug;
  const filteredYear = filterData[0];
  const filteredMonth = filterData[1];

  const numYear = +filteredYear;
  const numMonth = +filteredMonth;

  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth < 1 ||
    numMonth > 12
  ) {
    return {
      // will show error which needs to be delt in the
      // FilteredEventsPage function
      props: { hasError: true },
      /* will show 404, but with redirect the created page for 404 will be shown */
      // notFound: true,
      // redirect: {
      //   destination: "/error",
      // },
    };
  }

  const filteredEvents = await getFilteredEvents({
    year: numYear,
    month: numMonth,
  });

  // console.log("filteredEvents", filteredEvents)
  return {
    props: {
      events: filteredEvents,
      date: {
        year: numYear,
        month: numMonth,
      },
    },
  };
}
```

---

### Conclusion

- if page is home page, does’t consist of personal or the data change frequently, when you want search engines crawler to read you data and rank your website → SSG
- if page is dynamic [ someID ] or […someDI], to many id or combination to be rendered on dynamic page, data is not needed by web crawlers → SSR