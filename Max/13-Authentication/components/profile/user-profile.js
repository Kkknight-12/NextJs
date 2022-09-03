import ProfileForm from "./profile-form";
import classes from "./user-profile.module.css";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

function UserProfile(props) {
  // const [isLoading, setIsLoading] = useState(true);
  // Redirect away if NOT auth

  // useEffect(() => {
  //   getSession().then((session) => {
  //     console.log("session", session);
  //     if (!session) {
  //       window.location.href = "/auth";
  //     } else {
  //       setIsLoading(false);
  //     }
  //   });
  // }, []);

  // if (isLoading) {
  //   return <h1 className={classes.profile}>Loading....</h1>;
  // }

  // using serverSide Props for authentication

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  );
}

export default UserProfile;