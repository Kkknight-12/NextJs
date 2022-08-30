# Pre- rendering and Data Fetching

Next Js → pre renders all pages that no dynamic data( hard coded things ) 

## Page Pre-rendering

A data that is loaded from the server can take a while, not if the page is pre-rendered and that is what Next.js does for us. Instead of loading data only after the page was sent back to the client Next.js pre-renders a page and pre-renders all the HTML content with all the data that might be needed. It loads that in advance and then pre-generate the finished HTML page so that it is finished, fully populated HTML page which can be sent back to client.   

Next.js not only send back pre-rendered page but it will also send back all the Javascript code that belongs to it. And it will do something called **hydrating** that page

So we send back pre-rendered page, so that all the core content was already there right from the start and so that search engine crawlers also see that page with all content. If its not interactive at that point that doesn’t matter to those crawlers because they are only interested in the content. 

Pre rendering only affect the initial load. So when we visit a page and load our first page this page is pre-rendered. Once we are on the website that is powered by Next.js and React and once that page is hydrated, which happens right after this first rendering. Once that is the case we have a standard single page application again. So then react takes over and handles everything on the front-end. If the page changes there after, if we visit a different page of that same website that page is not pre-rendered but instead created by React. It is just the initial page which we visit which is pre-rendered. So that there we dont get an empty page till react is ready but we get this pre-rendered page with all the content ready. 

Two **types** of pre-rendering

- **static generation** → which is also the recommended one
    - all the pages are pre generated in advance during the build time, when you build you application for production.
- **server-side-rendering**
    - with SSR pages are created just in time after deployment when the request reaches the server.
    

### Static Generation

Idea is we pre-generate the page during the build time, mean all the HTMl code and data that makes up the content is prepared in advance.  As the pages are build during the built time, once you deploy them they can be cached by the server, by CDN that might be serving your App. And therefore incoming request can be served instantly with those pre-built pages. 

The page, after they are served are still hydrated with React App. The Difference is the pages which are sent to your clients are not empty initially but pre populate with content. 

### How to tell next to that certain page needed to be pre generate and what data is needed to pre-generate a page

### Get Static Props

with help of **getStaticProps** function from inside of our pages folder

- `export async function getStaticProps(){ … }`

Next.js will watch out this function. The function is async so it return a promise so we can use await. Special thing about this function is you can write any code that you would normally run on the server side only.  So in that function you don’t write client side code, though you are not restricted to that and you don’t have access to certain client side API, don’ t have access to window object.  The code that you write inside the`getStaticProps` is not included inside the code bundle that’s sent back to your clients, so if you have database credential you can write them safely in `getStaticProps`. 

Next.js Call getStaticProps on you behalf when it pre-generates a page and getStaticProps also signals to Next.js that this is a page that should be pre-generated.  

- `getStaticProps( ){ return { props: } }`   return an object that have a props key.
    - the function prepare the props for you component, which is why it is executed before the component is executed.

### ISR Incremental Static Generation

getStaticProps is used to prepare on the server side for pre-rendering the page. When we say server side we are partially correct because the code will not run on the actual server which serves out application instead it runs on our machine when the page is build.  

- so when we run `npm run build` will executed next build then the `getStaticProps` is executed.

But this has potential downside. What if we have data the frequently changes. Because, pre-generating the pages is great if we are building something fairly static like building a blog, where the data doesn’t change often. So when ever you add a new blog post we can just pre generate our project again with `npm run build` and deploy the updated project. 

But if we have the data that changes frequently then we have to re-build and re-deploy the page all the time. 

- **Solution** for this is use standard react code like `useEffect` where we fetch the updated data from a server. So we will always server back a page with some pre-rendered data, but that data might be outdated. So we fetch the latest data in the background and then update the loaded page after that data arrived.
    - the data will be bit update which is why we are fetching the data in background so that we can update the page with the latest data once you get that. That might be perfectly valid pattern.
- `getStaticProps` does execute at the time we build script, but this is not entirely true. Next.js has a built in feature which is called **Incremental Static Generation**. It mean you don’t just generate you page statically once at the build time, but it continuously updated even without you re-deploying it.
    - you can tell next.js that give page should be regenerate again for the incoming request at most every XXX second. That mean if a request is made for a certain page and it’s less than 60 second since it was last regenerated, the existing page would be served to the visitor. But if its passed those 60 second then the page will be pre-generate on the server instead. It will be cached and future visitors will see that re-generated page.
    - to enable this feature we add `revalidate:` key in our object which we return in `getStaticProps`.
        
        ```jsx
        return {
            props: {
              products: data.products,
            },
            revalidate: 10, // In seconds
          }
        ```
        

### `getStaticProps` configuration

- `export async function getStaticProps(**context**){ … }`

```jsx
export async function getStaticProps(context) {

// show page not found if the data products is not found
  if (data.products.length === 0) {
    return {
      **notFound**: true,
    };
  }

// re-direct if no data object is found
  if (!data) {
    return {
      **redirect**: {
        destination: "/no-data",
      },
    };
  }

  return {
    props: {
      products: data.products,
    }, 
    revalidate: 10, // In seconds
  };
}
```

- context → give us access to the dynamic segments to our path
    - there is a difference between extracting params in component function and get static props. When we extract these params in component function we can use them inside the component for example to use that extracted ID to send the request to some backend server to fetch data from there. But that would then only happen in the browser. 
    If you want to pre-render the page with help of `getStaticProps` then this happens on the server and `getStaticProps` run before the component function you need to access param inside getStaticProps to prepare the data for the component.

```jsx
export async function getStaticProps(**context**) {
  const { params } = **context**
  const productId = params.pid
  console.log("CONTEXT", context)
  /* 
  CONTEXT {
  params: { pid: 'p1' },
  locales: undefined,
  locale: undefined,
  defaultLocale: undefined
  }
  */

  const filePath = path.join(process.cwd(), "data", "dummy-backend.json")
  const jsonData = await fs.readFile(filePath)
  const data = JSON.parse(jsonData)

  const product = data.products.find((product) => product.id === productId)

  /* 
  - when the user try to ender id for page which dont exist
  - the 404 page will render
  - by setting  notFound: true, */
  if (!product) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      loadedProduct: product,
    },
  }
}
```

### *`getStaticPaths`*

Basics → NextJs pre generating all the static pages and the pages in which we have `getStaticProps` function.

But is is no the case for the dynamic page. → `[id].js`

For different ids we have technically different pages which has kind of same general HTML content but different data. Next.js doesn’t know in advance how many pages to regenerate. It doesn’t know which value for id will eventually be supported. So dynamic pages are generated just in time on the server. 

So for such dynamic routes we needs to give Next.js some Dynamic information. We can also tell next js which part of the page needs to be pre-generated. 

Here comes in play `getStaticPath` function → `export async function getStaticPaths( ) { … }`

```jsx
export async function getStaticPaths() {
  return {
    // path key is an array full of objects
    paths: [
      { params: { pid: "p1" } },
      { params: { pid: "p3" } },
    ],
    fallback: true, // fallback 404 will be used
    /* 
    - when fallback: true
    - The paths that have not been generated at build 
    - time will not result in a 404 page. Instead, Next.js 
    - will serve a “fallback” version of the page on the 
    - first request to such a path.  */
  }
  /* 
    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    // fallback: false,
    //
    // The paths that have not been generated at build time
    // will not result in a 404 page. Instead, Next.js will
    // serve a “fallback” version of the page on the first
    // request to such a path.
    // fallback: true,
    //
    // If fallback is 'blocking', new paths not returned
    //by getStaticPaths will wait for the HTML to be generated
    fallback: "blocking",
   */
}
```

`fallback: true` → parameter value which is not listed listed in the paths params can be valid and that it should be loaded when they are visited. But they are not pre-generated. They are generated just in time when a request reaches the server

when using fallback true we should be handling that in the component function to return the fallback version of the page while the data is fetched. 

```jsx
if (!loadedProduct) {
    return <p>Loading...</p>;
  }
```

Alternative to this is we can set fallback to blocking

`fallback: "blocking"`

if we do that we don’t even need a fallback check in the component. Next Js will wait for the page to be fully pre-generated on the server before it serves that. So it take longer for the visiter of the page to get the response. 

- now for some pages we are pre-rendering
- with fallback: true we are accepting param that we have not mentioned in the paths in getStaticProps to be fetched  and rendered just in time
    - for which we are also what to show in handling state
- and for those params which don’t exist in our data base we will return `notFound:true`  in *`getStaticProps`*   return object { }
    
    ```jsx
    
    export async function getStaticProps( context ) {
    	
    	if( !product ) {
    		return{
    	    notFound:true,
    	  };
    	}
    ```
    

---

## Server Side Rendering

[Data Fetching: Client side | Next.js](https://nextjs.org/docs/basic-features/data-fetching/client-side#client-side-data-fetching-with-swr)

Next Js support run real server side code. It gives you a function which you can add to you page components files, which is then really executed when ever a request for the page reaches the server. Which mean it is not pre generated in advance during built time or every couple of seconds. It is the code that executes on server only after  you have deployed it. Which is then re-executed for every incoming request. 

Which is done with help of function called `getServerSideProps( ) { … }`  

- it is a async function
- can only be added to the page component file.
    - pages which have such function. Next js will execute that function when ever a request for that page is made.

SSR is useful when we have highly dynamic data that changes multiple times every second

### Return of SSR

what we can return from `getServerSideProps( ) { … }`  is same as static props except we can’t pass revalidate key because the **server-side props** run for every in coming request. 

```jsx
export async function getServerSideProps(context) {
  const { params } = context
  const userId = params.uid

  return {
    props: {
      id: "userid-" + userId,
    },
  }
}
```

### Context SSR

context of SSR return. 

- request object
    - We can  dive into the request object that reach the server can you can read the incoming data from there. For Example headers that were attached through request and therefore cookies data that was attached to the request.
- response object
    - you can manipulate the response object as needed  to send back an appropriate response. You dont need to worry about sending response to component here as NextJs will do that for you. But we can manipulate it before sending it to component. Like we can add extra header by adding a cookie.

Request and Response we are getting here are the official NodeJs response and request object. 

- query
- params

```jsx
export async function getServerSideProps(context) {
  const { params } = context;
  const userId = params.uid;

  console.log("context", context);

  return {
    props: {
      id: "userid-" + userId,
    },
  };
}
```

---

<aside>
💡 You should use Either `getStaticProps( ) { }` **  or `getServerSideProps( ) { … }` 
because the clash with each other. They full fill the same purpose. They get props for the component so that NextJs is then able to render that component but they run at different points of time.

</aside>

---

## Client Side Data Fetching

Some data don’t need to be pre-rendered → 

- data that change very frequently.
- Highly user specific data - last order in an online shop.
- partial data - that is only used on some part of the page.
    - lets say you have a dashboard page with lots of pieces of data, lots of different kinds of data, in such a case loading all this different pieces might just slow down the request if you do that on the server.
    - And pre-rendering it statically during the build time might also not make sense because it’e personal data or because its changing a lot.

Also not for search engines because they wont see you private profile and also not necessarily for use experience because if we go to this page, we might be more than fine with just waiting a second for the data to be loaded.

In all these scenario it is suggested to fetch that data on the client side, from inside of the regular react app, once a use navigate to that page. 

library that can be used for fetching data

[Getting Started - SWR](https://swr.vercel.app/docs/getting-started)

It is a hook given by Next js which uses fetch API

```jsx
npm i swr
```

```jsx
import React, { useEffect, useState } from "react";
import useSWR from "swr";

// http://localhost:3000/last-sales

export default function lastSales() {
  const [sales, setSales] = useState();
  //
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error } = useSWR(
    "https://jsonplaceholder.typicode.com/users",
    fetcher
  );

  console.log("data", data);

  useEffect(() => {
    if (data) {
      const transformedSales = [];

      for (const key in data) {
        transformedSales.push({
          id: key,
          username: data[key].username,
          email: data[key].email,
        });
      }
      setSales(transformedSales);
    }
  }, [data]);

  if (error) {
    return <p>Failed to Load.</p>;
  }

  if (!data || !sales) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <ul>
        {sales.map((sale) => {
          return (
            <div key={sale.id}>
              <li>Name - {sale.username}</li>
              <li>Mail Id - {sale.email}</li>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
```

## Combining Client Side Data Fetching and Pre-fetching

used in application when you need a pre-rendered snapshot and then still fetch the latest data from the client. Therefore we can add one of the two main functions we learned → `getStaticProps`, `getServerSideProps`

Lets see an example with getStaticProps to pre-generate during the build process and also revalidate it after deployment with reValidate key. 

```jsx
import React, { useEffect, useState } from "react";
import useSWR from "swr";

// http://localhost:3000/last-sales

export default function lastSales(props) {
  // we have the initial state which will be our pre-fetched data
  // which will be overwritten but the client side data fetching
  const [sales, setSales] = useState(props.sales);
  //
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error } = useSWR(
    "https://jsonplaceholder.typicode.com/users",
    fetcher
  );

  console.log("data", data);

  useEffect(() => {
    if (data) {
      const transformedSales = [];

      for (const key in data) {
        transformedSales.push({
          id: key,
          username: data[key].username,
          email: data[key].email,
        });
      }
      setSales(transformedSales);
    }
  }, [data]);

  if (error) {
    return <p>Failed to Load.</p>;
  }

  if (!data || !sales) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <ul>
        {sales.map((sale) => {
          return (
            <div key={sale.id}>
              <li>Name - {sale.username}</li>
              <li>Mail Id - {sale.email}</li>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
```

```jsx
export async function getStaticProps(context) {
  // useSwr hook can't be used here because this is not a react component
  // fetch can be used in getStaticProps and getServerSideProps
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await response.json();
  const transformedSales = [];

  for (const key in data) {
    transformedSales.push({
      id: key,
      username: data[key].username,
      email: data[key].email,
    });
  }

  return {
    props: {
      sales: transformedSales,
    },
    revalidate: 10,
  };
}
```