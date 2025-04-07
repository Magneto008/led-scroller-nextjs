"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOff } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showpassword, setshowpassword] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formValues = new FormData(e.currentTarget);
    const data = Object.fromEntries(formValues);
    setLoading(true);
    const promise = fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    toast.promise(promise, {
      loading: "Logging in...",
      success: () => {
        router.replace("/");
        return "Success";
      },
      error: (err) => {
        console.log(err);
        return `Invalid credentials.`;
      },
      finally: () => {
        setLoading(false);
      },
    });
  }

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@example.com"
                  name="email"
                  required
                  className="placeholder:text-gray-400"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showpassword ? "text" : "password"}
                    name="password"
                    required
                    className="pr-10"
                  />
                  <button
                    className="absolute right-3 inset-y-0"
                    type="button"
                    onClick={() => {
                      setshowpassword(!showpassword);
                    }}
                  >
                    {showpassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <EyeIcon className="size-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button disabled={loading} type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
