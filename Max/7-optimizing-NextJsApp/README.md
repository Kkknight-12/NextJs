# Optimisation

### Metadata

Matadata → head data that can be added to every page.

We should have metadata on our application as it enhances the user experience. It is crucial for search engines because search engine crawlers  will have a look at the title and description set in the metadata. 

### Configuring Head Content

If you want to add content between the tags on the page, we can do that with help of **Head component** give to us by NextJs. 

`import Head from "next/head"`

It is special component which you can add anywhere in your jsx code for a given component. In the component we can add our typical HTML head section elements and Next js will inject them in the head section of the page. 

- title
- meta  → these meta tags matters to search engines
    - name
    - content  → this is the content which is shown up in the search result when your page is showing up in google result.

```jsx
import Head from "next/head"

import { getFeaturedEvents } from "../helpers/api-util"
import EventList from "../components/events/event-list"

function HomePage(props) {
  return (
    <div>
      <**Head**>
        <title>My page title</title>
        <meta
          name="description"
          content="Find allot of great events that allow you to evolve..."
        />
      </**Head**>
      <EventList items={props.events} />
    </div>
  )
}

export async function getStaticProps() {
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

### Dynamic Head content

```jsx
function EventDetailPage(props) {
  const event = props.selectedEvent;

  return (
    <>
      <Head>
        <title> **{** **event.title** } </title>
        <meta
          name="description"
          content="Find allot of great events that allow you to evolve..."
        />
      </Head>
      <EventSummary title={event.title} />
      <EventLogistics
       
      />
      <EventContent>
       
      </EventContent>
    </>
  );
}
```

![Screenshot 2022-09-01 at 2.18.36 PM.png](Optimisation%208a8da14607fd4a92876598811743a42b/Screenshot_2022-09-01_at_2.18.36_PM.png)

```jsx
function FilteredEventsPage(props) {
  const router = useRouter();
  const filterData = router.query.slug;

  const filteredYear = filterData[0];
  const filteredMonth = filterData[1];

  const numYear = +filteredYear;
  const numMonth = +filteredMonth;
  const date = new Date(props.date.year, props.date.month - 1);

  return (
    <Fragment>

      <**Head**>
        <title>Filtered Events</title>
        <meta
          name="description"
          content={`All events for **${numMonth}/${numYear}**`}
        />
      </**Head**>

      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </Fragment>
  );
}
```

### Reusing Components

```jsx
function FilteredEventsPage(props) {
  const router = useRouter();

  const filterData = router.query.slug;

  

  const filteredYear = filterData[0];
  const filteredMonth = filterData[1];

  const numYear = +filteredYear;
  const numMonth = +filteredMonth;

  const **pageHeadData** = (

    <**Head**>
      <title>Filtered Events</title>
      <meta
        name="description"
        content={`All events for ${numMonth}/${numYear}`}
      />
    </**Head**>

  );

  if (props.hasError) {
    return (
      <>
        {**pageHeadData**}
       
        </div>
      </>
    );
  }

  const filteredEvents = props.events;

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        {**pageHeadData**}
        
      </Fragment>
    );
  }

  const date = new Date(props.date.year, props.date.month - 1);

  return (
    <Fragment>
      {**pageHeadData**}
     
    </Fragment>
  );
}
```

### _app.js

Beside using head content inside a component we also might have certain head settings that should be same across all the page components. 

_app.js file → is or root app component which is rendered fo every page. you can imagine _app.js as the root component inside of the body section of the HTML document. 

we can add here our common head element. 

```jsx
import Layout from "../components/layout/layout";
import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Head>
        <meta name="something" content="Ahhh." />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
```

try not to write title for meta. 

### Override Head

Next Js automatically override the head of _app.js  and other components. Even if we have multiple heads in a single component the content of the previous  is overwritten by the later one. 

### _document.js

this page is not there by default but can be added directly in page folder, not a sub folder parallel to _app.js. Document Js allow us to customize the entire HTML document. It allow us to add HTM content outside of our Application component. May be fo using those elements with react portals 

- To do so you need to add a special class based component.
    - It must be Class based component as it must extend some component provided by NextJs.

```jsx
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

- Head component here is not same as Head component we imported from ‘/next/head’
- This head imported from next/document can only used inside this special document component.

this is the default document structure, which if you want to overwrite than you must re-create it.

```jsx
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <div id="overlays" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
export default MyDocument;
```

![Screenshot 2022-09-01 at 3.18.45 PM.png](Optimisation%208a8da14607fd4a92876598811743a42b/Screenshot_2022-09-01_at_3.18.45_PM.png)

### Images

To  optimise an image in Nextjs we can import a `Image` component offered by NextJs. When we use that special component. NextJs will create multiple versions of our image on the fly when request are coming in optimize for the operating systems and device sizes making the request. And then those generated images will be cached for future requests for similar devices. 

We can replace the img HTML tag with Image component. 

In Image component we need to add to more attributes  

- width
- height

We set them to tell Nextjs about the width and height of the image, not the original width and height of the image but the width and height which is needed. To determine the width and height keep in mind that image can be displayed in two possible ways:

- Either take full width of container on smaller screen
- or just a fraction of screen on bigger screen sizes

```jsx
import Image from "next/image";

<Image width={250} height={160} src={"/" + image} alt={title} />
```

- height and size will only determine the size of image that will be fetched in the end. Final Styling is still being done by the CSS.