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