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