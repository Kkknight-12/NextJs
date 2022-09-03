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