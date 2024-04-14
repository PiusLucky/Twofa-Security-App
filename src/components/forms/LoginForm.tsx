"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MainButton from "../common/MainButton";
import Link from "next/link";
import { useState } from "react";
import makeApiCallService from "@/service/apiService";
import { useRouter } from "next/navigation";
import {
  ILoginUserResponse,
  IRecoveryCodeStatusCheckResponse,
  ITwoFaResponse,
} from "@/types";
import { LoginTwoFaModal } from "../modals/LoginTwoFaModal";
import { Toaster } from "../ui/toaster";

const FormSchema = z.object({
  email: z
    .string()
    .email({
      message: "Enter a valid email",
    })
    .min(2, {
      message: "email must be at least 2 characters.",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(25, {
      message: "Password must be at most 25 characters.",
    }),
});

function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);

  const loginUser = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await makeApiCallService<ILoginUserResponse>(
        "/api/login",
        {
          method: "POST",
          body: data,
        }
      );
      if (response?.response?.meta?.success) {
        localStorage.setItem("TOKEN", response?.response?.data?.token);

        router.push("/home");
      }
    } catch (err) {
      setLoading(false);
    }
  };
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true);

      // NOTE: Check if password is a valid recovery code
      const recoveryCodeResponse = await makeApiCallService<
        IRecoveryCodeStatusCheckResponse
      >("/api/recovery-codes", {
        method: "PUT",
        body: {
          email: data.email,
          code: data.password,
        },
      });

      if (recoveryCodeResponse?.response?.data) {
        loginUser(data);
        return;
      }

      const twofaCheckResponse = await makeApiCallService<ITwoFaResponse>(
        "/api/twofa-by-email",
        {
          method: "POST",
          body: {
            email: data.email,
          },
        }
      );

      if (twofaCheckResponse?.response?.data?.status) {
        setOpen(true);
      } else {
        loginUser(data);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex flex-col gap-[2.81rem] justify-center items-center h-screen px-4 lg:px-[4rem]">
      <div className="self-start">
        <p className="text-[#333] text-[1.625rem] font-[700]">Hello Again!</p>
        <p className="text-[#333] text-[1.125rem]">Welcome Back</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email Address"
                    {...field}
                    className="h-[3.75rem] w-full rounded-large"
                    startIcon="email"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Password"
                    {...field}
                    className="h-[3.75rem] w-full rounded-large"
                    startIcon="padlock"
                    type={passwordHidden ? "password" : "text"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <p
              className="text-primary inline-block  text-sm cursor-pointer select-none"
              onClick={() => setPasswordHidden(!passwordHidden)}
            >
              {passwordHidden ? "Show" : "Hide"} Password
            </p>
          </div>

          <MainButton
            text="Login"
            classes="h-[3.31rem] rounded-large"
            width="full_width"
            isSubmitable
            isLoading={loading}
          />

          <div className="flex justify-end text-[#191A15] mt-4">
            <Link href="/register">Register Instead?</Link>
          </div>
        </form>
      </Form>
      {open && (
        <LoginTwoFaModal
          email={form.getValues()?.email}
          password={form.getValues()?.password}
          open={open}
          setOpen={setOpen}
        />
      )}

      <Toaster />
    </div>
  );
}

export default LoginForm;
