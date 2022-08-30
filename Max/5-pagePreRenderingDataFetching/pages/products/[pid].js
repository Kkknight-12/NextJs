import path from "path";
import { promises as fs } from "fs";

function ProductDetailPage(props) {
  const { loadedProduct } = props;

  /* 
   - when the fallback is set to true
   - we are saying that the mentioned routes are not the
   - only routes that need to be rendered
   - they are just pre-rendered routes
   - there is posibility for other routes which
   - are not pre rendered routes.

   - BUT, then you need to mention here the condition when there is no props
  */
  if (!loadedProduct) {
    return <p>Loading...</p>;
  }
  // above return is not needed when fallback is blocking

  return (
    <>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </>
  );
}
/* 
https://stackoverflow.com/questions/64926174/module-not-found-cant-resolve-fs-in-next-js-application

- If you use fs, be sure it's only within getInitialProps 
- or getServerSideProps. (anything includes server-side rendering).
- You may also need to create a next.config.js file with the following 
- content to get the client bundle to build:
*/
// export async function getData() {
//   const filePath = path.join(process.cwd(), "data", "dummy-backend.json")
//   const jsonData = await fs.readFile(filePath)
//   const data = JSON.parse(jsonData)
//   return data
// }

export async function getStaticProps(context) {
  const { params } = context;
  const productId = params.pid;
  console.log("CONTEXT", context);
  /* 
  CONTEXT {
  params: { pid: 'p1' },
  locales: undefined,
  locale: undefined,
  defaultLocale: undefined
  }
  */

  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  const product = data.products.find((product) => product.id === productId);

  /* 
  - when the user try to ender id for page which dont exist
  - the 404 page will render
  - by setting  notFound: true, */
  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      loadedProduct: product,
    },
  };
}
/* 
- When exporting a function called getStaticPaths 
- from a page that uses Dynamic Routes, Next.js will
- statically pre-render all the paths specified by getStaticPaths.
- The paths key determines which paths will be pre-rendered 
*/

export async function getStaticPaths() {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  const ids = data.products.map((product) => product.id); // [ 'p1', 'p2', 'p3', 'p4' ]

  const pathWithParams = ids.map((id) => ({ params: { pid: id } }));

  return {
    // path key is an array full of objects
    paths: pathWithParams,
    fallback: true, // fallback 404 will be used
    /* 
    - when fallback: true
    - The paths that have not been generated at build 
    - time will not result in a 404 page. Instead, Next.js 
    - will serve a “fallback” version of the page on the 
    - first request to such a path.  */
  };
  /* 
  return {
  // path key is an array full of objects
    paths: [
      { params: { pid: "p1" } },
      //   { params: { pid: "p2" } },
      //   { params: { pid: "p3" } },
    ],
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
  }
   */
}

export default ProductDetailPage;