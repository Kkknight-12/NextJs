import Layout from "../components/layout/layout";
import { SessionProvider } from "next-auth/react";

import "../styles/globals.css";

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
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    // we set the session data that we might already have
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;