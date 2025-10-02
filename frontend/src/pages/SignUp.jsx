import React from "react";
import SignUpForm from "../components/SignUpForm";
import bg from "../images/background.jpg";
function SignUp() {
  return (
    <div
      className="flex justify-center items-center h-screen w-full
    "
      style={{
        backgroundImage: `url(${bg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <SignUpForm />
    </div>
  );
}

export default SignUp;
