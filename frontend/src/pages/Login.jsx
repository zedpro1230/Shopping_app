import React from "react";
import bg from "../images/background.jpg";
import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <div
      className="flex justify-center items-center h-screen w-full
    "
      style={{
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <LoginForm />
    </div>
  );
}

export default Login;
