import LoginForm from "@/components/forms/LoginForm";
import React from "react";

function LoginPage() {
  return (
    <div className="flex">
      <div className="relative hidden lg:block">
        <img
          src="/images/auth_large.png"
          alt="large auth splash image"
          className="h-screen"
        />
      </div>
      <div className="flex-grow">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
