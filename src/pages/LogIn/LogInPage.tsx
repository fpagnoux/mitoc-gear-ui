import { Redirect } from "react-router-dom";

import { useCurrentUser } from "features/auth";

import { LoginForm } from "./LoginForm";

export default function Login() {
  const { isLoading, loggedIn, error } = useCurrentUser();
  if (!isLoading && loggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <>
      <h1>Log in</h1>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error.msg}
        </div>
      )}
      <LoginForm />
    </>
  );
}
