function UserIdPage(props) {
  return <h1>{props.id}</h1>;
}

export default UserIdPage;

/* 
- When exporting a function called getServerSideProps 
- (Server-Side Rendering) from a page, Next.js will 
- pre-render this page on each request using the 
- data returned by getServerSideProps. This is useful 
- if you want to fetch data that changes often,
*/
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