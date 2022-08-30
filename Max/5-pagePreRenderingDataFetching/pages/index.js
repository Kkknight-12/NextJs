import path from "path";
// import fs from "fs/promises"
import { promises as fs } from "fs";
import Link from "next/link";

function HomePage(props) {
  const { products } = props;
  return (
    <ul>
      {products?.map((product) => (
        <li key={product.id}>
          <Link href={`/products/${product.id}`}>{product.title}</Link>
        </li>
      ))}
    </ul>
  );
}

/* 
- getStatic Function are executed first
- and then in second step executes the component functions  
*/
export async function getStaticProps(context) {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  // re-direct if no data object is found
  if (!data) {
    return {
      redirect: {
        destination: "/no-data",
      },
    };
  }

  // show page not found if the data products is not found
  if (data.products.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      products: data.products,
    }, // will be passed to the page component as props
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}

export default HomePage;