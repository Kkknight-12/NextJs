# Pages and File-Based Routing

### File Based Routing

```jsx
/page

| ------- index.js     -> my-domain.com/
| ------- about.js     -> my-domain.com/about
|
| ------- /products
|            ------- index.js -> my-domain.com/products
|            -------  [id].js  -> my-domain.com/products/1
```

### Link Tags For Routing in browser

```jsx
import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {" "}
      <h1>HomePage </h1>
      <ul>
        <li>
          <Link href="/portfolio">Portfolio Page</Link>
        </li>
        <li>
          <Link href="/portfolio/list">Portfolio List Page</Link>
        </li>
        <li>
          <Link href="/clients">Clients Page</Link>
        </li>
      </ul>
    </div>
  );
}
```

### Dynamic Routes

→ we use **useRouter from next/router** a next js library which give us access to the query and path. 

```jsx
import React from "react";
import { **useRouter** } from "next/router";

export default function PortfolioProjectPage() {
  const router = useRouter();
  console.log(router.pathname); // /portfolio/[projectId]
  console.log(router.query); // {projectId: 'asd'} // give us value encoded
  // on the url
  return (
    <div>
      {"Nested Portfolio Project Page" + "--> " + router.query?.projectId}
    </div>
  );
}
```

- you can provide any name between the square brackets
- `[ ]` tell next.js that this is not a value but a placeholder for value which will be used to  load different kinds of data

<aside>
💡 Note: if you are working with **class based component** you can use **withRouter** which you can wrap around you class based component.

</aside>

### Nested Dynamic Paths

```jsx
import React from "react"
import { useRouter } from "next/router"

export default function clientProjectId() {
  const router = useRouter()
  console.log(router.pathname)
  console.log(router.query)
  
  /* 
    /clients/[id]/[clientProjectId]
    [clientProjectId].js:22 {id: 'mayank', clientProjectId: 'nextJsProject'} 
*/
  return <div>clientProjectId</div>
}
```

![Screenshot 2022-05-05 at 9.00.50 AM.png](Pages%20and%20File-Based%20Routing%20f9d183f3d1c5451e9988b4df43e3b51f/Screenshot_2022-05-05_at_9.00.50_AM.png)

### CatchAll Routes

- **slug** → […something] support different url
- page/blog/[…slug] → can have a route
    - /blog/2020
    - blog/2020/12
    - blog/front-end/123/somehing/then-something
- allow us to have all these url rendered from same page
- router.query give us list of query made → `['2022', '12']`

```jsx
import React from "react"
import { useRouter } from "next/router"

export default function BlogPostsPage() {
  const router = useRouter()
  console.log(router.pathname) // /blog/[...slug]
  console.log(router.query) // slug: (2) ['2022', '12']

  return <div>BlogPostsPage</div>
}
```

### Navigate with Link

- `import **Link** from "next/link"`
    - link has href which you use to fill in the path were you wan to navigate.
- Advantage of using Link → it pre-fetches any data of the page we navigate to as soon as we hover over the link
- you add `replace` prop to replace the current page with the link one so the the user can go back.

```jsx
import React from "react"
import **Link** from "next/link"

export default function HomePage() {
  return (
    <div>
      {" "}
      <h1>HomePage </h1>
      <ul>
        <li>
          <Link href="/portfolio">Portfolio Page</Link>
        </li>
        <li>
          <Link href="/clients">Clients Page</Link>
        </li>
      </ul>
    </div>
  )
}

```

![Screenshot 2022-05-05 at 12.24.58 PM.png](Pages%20and%20File-Based%20Routing%20f9d183f3d1c5451e9988b4df43e3b51f/Screenshot_2022-05-05_at_12.24.58_PM.png)

### Navigating to Dynamic Routes

```jsx
import Link from "next/link"
import React from "react"

export default function Clients() {
  const clients = [
    { id: "one", name: "knight" },
    { id: "two", name: "luffy" },
  ]
  return (
    <div>
      <h1>The Client Page</h1>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            <Link href={`/clients/${client.id}`}>{client.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

![Screenshot 2022-05-05 at 9.00.50 AM.png](Pages%20and%20File-Based%20Routing%20f9d183f3d1c5451e9988b4df43e3b51f/Screenshot_2022-05-05_at_9.00.50_AM%201.png)

### Different way of setting Link Href

- sending object to he href
    - { pathname: ______, query: ___________}

```jsx
import Link from "next/link"
import React from "react"

export default function Clients() {
  const clients = [
    { id: "one", name: "knight" },
    { id: "two", name: "luffy" },
  ]
  return (
    <div>
      <h1>The Client Page</h1>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            {/* <Link href={`/clients/${client.id}`}>{client.name}</Link> */}
            <Link
              href={{
                pathname: "/clients/[id]",
                query: { id: client.id },
              }}
            >
              {client.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Navigating Programatically

we have seen router properties, it also have some useful methods

- `router.**push**( )`  → which will navigate to the different page
    
    ```jsx
    router.push("/clients/knight/projecta");
    ```
    
    we can also pass in an object here which can have pathname and query
    
    ```jsx
    router.push({
          pathname: "/clients/[id]/[clientProjectId]",
          query: { id: router.query.id, clientProjectId: "projecta" },
        });
    ```
    
- `router.**replace**( )` → will replace the current page, which means we cant go back after the navigation.

```jsx
router.replace("/clients/knight/projecta");
```

```jsx
import { useRouter } from "next/router";
import React from "react";

export default function ClientProjectsPage() {
  const router = useRouter();

  console.log("router.query", router.query);

  const loadProjectHander = () => {
    // load data...
    // router.push("/clients/knight/projecta")
    // or
    router.push({
      pathname: "/clients/[id]/[clientProjectId]",
      query: { id: router.query.id, clientProjectId: "projecta" },
    });
  };

  return (
    <div>
      {" "}
      <h1>The Project of a Given Client</h1>
      <button onClick={loadProjectHander}>Load Project A</button>
    </div>
  );
}
```