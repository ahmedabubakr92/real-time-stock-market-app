"use client";

import { useForm } from "react-hook-form";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";
import FooterLink from "@/components/forms/FooterLink";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  async function onSubmit(data: SignInFormData) {
    try {
      console.log(data);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <h1 className="form-title">Log In Your Account</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          name="email"
          label="Email"
          placeholder="Enter your email address"
          type="email"
          register={register}
          error={errors.email}
          validation={{
            required: "Email address is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter your email address",
            },
          }}
        />

        <InputField
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          register={register}
          error={errors.password}
          validation={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          }}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="yellow-btn w-full mt-5"
        >
          {isSubmitting ? "Logging In..." : "Log In"}
        </Button>
      </form>

      <FooterLink
          text="Don't have an account?"
          linkText="Sign up"
          href="/sign-up"
        />
    </>
  );
}
