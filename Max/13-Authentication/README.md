# Authentication

install

```bash
npm i mongodb
```

### Connection to MongoDb

/lib/db.js

```jsx
import { MongoClient } from "mongodb";

export async function connectToDataBase() {
  const client = MongoClient.connect(
    "mongodb+srv://knight123:knight123@cartapp.fuwv0.mongodb.net/NextJsMax?retryWrites=true&w=majority"
  );
  return client;
}
```

### Creating Create User Route

/api/auth/singup.js

```jsx
import { connectToDataBase } from "../../../lib/db";
import { hashPassword } from "../../../lib/auth";

async function handler(req, resp) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7
    ) {
      resp.status(422).json({ message: "Invalid input" });
      return;
    }

    const client = await connectToDataBase();

    const db = client.db();

    const hashedPassword = await hashPassword(password);

    await db.collection("users").insertOne({
      email: email,
      password: hashedPassword,
    });

    resp.status(201).json({ message: "Created User" });
    client.close();
  }
}
export default handler;
```

running at

```jsx
http://localhost:3000/api/auth/signup
```

### Hash Password

```jsx
import { hash } from "bcrypt";

export async function hashPassword(password) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}
```

### Send Create User Req From FrontEnd

/components/auth/auth-form.js

```jsx
import { useState, useRef } from "react";
import classes from "./auth-form.module.css";

async function createUser(email, password) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  console.log("data", data);

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event) {
    event.preventDefault();

    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;

    if (isLogin) {
    } else {
      try {
        const result = await createUser(email, password);
        console.log("Login User Resp", result);
      } catch (e) {
        console.error(e.message);
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
       
      </form>
    </section>
  );
}

export default AuthForm;
```

### Unique Email Address

```jsx
import { connectToDataBase } from "../../../lib/db";
import { hashPassword } from "../../../lib/auth";

async function handler(req, resp) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    const client = await connectToDataBase();

    const db = client.db();

    const existingUser = await db.collection("users").findOne({ email: email });

    console.log("exists", existingUser);
    if (existingUser) {
      resp.status(422).json({ message: "User already exists." });
      client.close();
      return;
    }

}
export default handler;
```

### Credential Auth Provider

By token creation and storage, we manage authenticating users. It helps us in finding out whether the user has permission. For which we will create another API route → /api/auth[….nextauth.js]. Because login a user also requires user to send a certain API  route where we then look into the database and find out whether we have that user in the database. The file created is dynamic API route that will catch all API routes that starts with /api/auth……. 

Here we will use Next Auth Package. We need this route because next auth package behind the scenes will expose multiple routes for user login and logout and couple of other routes as well.  And in order to set up its own routes we need to have a catch all route so that all those special requests to these special routes are automatically handled by NextAuth package. 

[REST API | NextAuth.js](https://next-auth.js.org/getting-started/rest-api)

install

```jsx
npm install next-auth
```

/api/auth/[…nextauth].js

```jsx
import NextAuth from "next-auth";
import Providers from "next-auth/providers"; // 2 importing provider
//
import { connectToDataBase } from "../../../lib/db";
import { verifyPassword } from "../../../lib/auth";

// 1
export default NextAuth({ //2 configuration object 
  session: {
    jwt: true, // 5
  },
  providers: [ 
    // Providers.Credentials({
		CredentialsProvider({
			name: "Credentials",
      async authorize(credentials) { // 3
        const client = await connectToDataBase();

        const usersCollection = client.db().collection("users");
        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          client.close();
          throw new Error("No User found!");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Could not log you in!");
        }

        client.close();
        return { email: user.email }; // 4
      },
    }),
  ],
});
```

1. NextAuth is function which is executed by passing arguments in it. Executing it returns a new function. 
2. object allow us to configure next auth behavior in our case we set providers option and we set this to array
    
    [Options | NextAuth.js](https://next-auth.js.org/configuration/options)
    

[Credentials | NextAuth.js](https://next-auth.js.org/configuration/providers/credentials)

1. authorise is a method that Next js call when it receive an incoming login request. It is an async function so it returns a promise. 
2. if we return an object inside a authorize we let NextAuth know that authorization succeed. And this object will be encoded into JSON web token. 
3. Make sure Json web token is used to create auth

### Sign In from Front End

for signing in the user we don't need to send our own HTTP request. Instead here we will import `signIn` from `next/auth/react`  to send Sing In request and the request will be send automatically 

```jsx
import { useState, useRef } from "react";
// import { singIn } from "next-auth/client";
import classes from "./auth-form.module.css";
import { signIn } from "next-auth/react";

async function createUser(email, password) {

  const response = await fetch("/api/auth/signup", {
   
  });

function AuthForm() {
 
  async function submitHandler(event) {

    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;

    if (isLogin) {
      const result = await signIn("credentials", { // 1
        redirect: false, // 2
        email,
        password,
      });

      console.log("result", result);
    } else {
      try {
        const result = await createUser(email, password);
        console.log("Login User Resp", result);
      } catch (e) {
        console.error(e.message);
      }
    }
  }

  return (
  );
}

export default AuthForm;
```

1. first argument is the provider with which we want to sing in, because we could have multiple providers in same application 

1. while signing in if there is an error next js will redirect us to some other ( error page ) but in our case we don't want that we wan to show the error message on the screen. To avoid redirection we can set redirect to false. Setting redirect to false make sign in method return a promise which eventually yields result. The promise will always resolve. So if we have an error while authentication the retuned object will contain the information for the error. 

### Active Session

After we logged in Successfuly Next.js added a cookie which can be seen in browser tool → application → cookies → next-auth.session-token which is set by Next Js when we logged in successfully and it will be used automatically when we try to change what we try to send to requests to protected routes. 

If we want to find out of the user using the page at the moment is authenticated Next js give us a convenient way. 

We can use `useSession` hook from ‘next-auth/react’ in any react functional component

```jsx
import { useSession } from "next-auth/react"
```

use section return an array with two elements. 

- session
- loading - tell wether next js is loading

you can console.log session and loading to check whats inside

```jsx
const { data: session, status } = useSession();
  console.log("session", session);

session 
{user: {…}, expires: '2022-10-03T10:05:12.381Z'}
expires: "2022-10-03T10:05:12.381Z"
user: {email: 'something@gmail.com'}
```

status can be → loading | unauthenticated | 

[Client API | NextAuth.js](https://next-auth.js.org/getting-started/client#usesession)

Make sure you wrap component in session provider

```jsx
import Layout from "../components/layout/layout";
import { SessionProvider } from "next-auth/react";

import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
```

[Client API | NextAuth.js](https://next-auth.js.org/getting-started/client#sessionprovider)

/components/layout/main-navigation.js

```jsx
import Link from "next/link";
import { **useSession** } from "next-auth/react";
import classes from "./main-navigation.module.css";

function MainNavigation() {
  const { data: session, status } = **useSession**();
 
  return (
    <header className={classes.header}>
      <Link href="/">
        <a>
          <div className={classes.logo}>Next Auth</div>
        </a>
      </Link>
      <nav>
        <ul>
          {**status** !== "loading" && !**session** && (
            <li>
              <Link href="/auth">Login</Link>
            </li>
          )}
          <li>{**session** && <Link href="/profile">Profile</Link>}</li>

          {**session** && (
            <li>
              <button>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
```

### Logout

[Client API | NextAuth.js](https://next-auth.js.org/getting-started/client#signout)

```jsx
import { signOut } from "next-auth/react";

const handleLogOut = () => {
    signOut();
  };
```

when you logout with next-auth it also remove the session token store in application → cookies

### Page Guards

if we change make changes in URL and try to visit profile we can still visit the page

```jsx
http://localhost:3000/profile
```

But is we want user not to be able to go to that URL if the user is logged out. To do this we go to the pages we want to protect and use next-auth there. 

[Client API | NextAuth.js](https://next-auth.js.org/getting-started/client#getsession)

components/profile/user-profile.js

```jsx
import ProfileForm from "./profile-form";
import classes from "./user-profile.module.css";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

function UserProfile() {
  const [isLoading, setIsLoading] = useState(true);
  // Redirect away if NOT auth

  useEffect(() => {
    getSession().then((session) => {
      console.log("session", session);
      if (!session) {
        window.location.href = "/auth";
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  if (isLoading) {
    return <h1 className={classes.profile}>Loading....</h1>;
  }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  );
}

export default UserProfile;
```

### SSR Page Guard

You can see the profile page if you use valid credentials. But the brief moment of loading which flashes on the screen when we enter profile when not authenticated is may be something which we should get rid of. But we cant  get rid of it with just client side code. Becuase if we use client side JS to determine if the user is authenticated then we always need to wait that fraction of second to find out our authentication. 

We can solve this with SSR. We will use getServeSideProps as the page will make the request to the server when ever user visit it. Every incoming request is important as we have to find out that the user is logged in to visit the page. In we can user getSession

/pages/profile.js

```jsx
import UserProfile from "../components/profile/user-profile";
import { getSession } from "next-auth/react";

function ProfilePage() {
  return <UserProfile />;
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false, // making it clear the redirect it temp and may
        // be in future when user is logged then he may be allowed to visit page
      },
    };
  }

  return {
    props: { session },
  };
}
export default ProfilePage;
```

```jsx
import ProfileForm from "./profile-form";
import classes from "./user-profile.module.css";

function UserProfile(props) {

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  );
}

export default UserProfile;
```

### Protecting Auth Page

- redirect user to profile if he successfully logs in
    
    component/auth/auth-form.js
    
    ```jsx
    import { useState, useRef } from "react";
    // import { singIn } from "next-auth/client";
    import classes from "./auth-form.module.css";
    import { signIn } from "next-auth/react";
    import { **useRouter** } from "next/router";
    
    function AuthForm() {
    	const **router** = useRouter();
    
      async function submitHandler(event) {
        event.preventDefault();
    
        const email = emailInputRef.current.value;
        const password = passwordInputRef.current.value;
    
        if (isLogin) {
          const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
          });
    
          if (!result.error) {
            **router**.replace("/profile");
          }
        } else {
          
      }
    
      return (
       
      );
    }
    
    export default AuthForm;
    ```
    

- Now we want to make sure that if the user is logged in he should not be shown the login page
    - we can make use of server side props
    - can go for client side work around
    
    ```jsx
    import AuthForm from "../components/auth/auth-form";
    import { useEffect, useState } from "react";
    import { getSession } from "next-auth/react";
    import { **useRouter** } from "next/router";
    
    function AuthPage() {
      const **router** = useRouter();
    
      const [isLoading, setIsLoading] = useState(true);
      // Redirect away if NOT auth
    
      useEffect(() => {
        getSession().then((session) => {
          console.log("session", session);
          if (session) {
            **router**.replace("/");
          } else {
            setIsLoading(false);
          }
        });
      }, [router]);
    
      return <AuthForm />;
    }
    
    export default AuthPage;
    ```
    

### next-auth session provider

[Client API | NextAuth.js](https://next-auth.js.org/getting-started/client#sessionprovider)

`<SessionProvider>` allows instances of `useSession()`to share the session object across components, by using **[React Context](https://reactjs.org/docs/context.html)** under the hood. It also takes care of keeping the session updated and synced between tabs/windows.

```jsx
import { SessionProvider } from "next-auth/react"

// we get the props determined by the getStaticProps or serverSideProps
// and for the profile props will contain a session key with the session
// we validated from getServerSideProps from profile page
// in most cases the session prop will be undefined because most pages don't
// have this prop
// after getting the session though profile page the session is set to the
// already loaded session and that than allow next off to skip the extra
// session check performed by useSession if we already have the session prop
// so we load another component where session is not set, useSession will
// still do its thing and check it manually. But in case when we already have
// session we can save some performance and redundant HTTP request.

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
   // we set the session data the we might already have
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
```

If you pass the `session`page prop to the `<SessionProvider>`– as in the example above – you can avoid checking the session twice on pages that support both server and client side rendering.

### Further Authentication Requirements

```jsx

```