import { cookies as next_cookies } from "next/headers";
import LEDForm from "./components/led-form";
import { redirect } from "next/navigation";
import { cookieTokenKey } from "./constants";
const messageToken = process.env.MESSAGE_TOKEN;

export default async function Page() {
  const cookies = await next_cookies();
  const token = cookies.get(cookieTokenKey) || "";
  if (!token || token?.value !== messageToken) redirect("/login");
  return <LEDForm />;
}
