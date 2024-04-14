import RegisterForm from "@/components/forms/RegisterForm";
import React from "react";

function RegisterPage() {
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
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage;
