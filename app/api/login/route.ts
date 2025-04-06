import { cookieTokenKey } from "@/app/constants";
import { NextRequest } from "next/server";

type User = {
  email: string;
  password: string;
};

const MESSAGE_TOKEN = process.env.MESSAGE_TOKEN;
if (!MESSAGE_TOKEN) console.log("message token not set");

const users: User[] = [
  {
    email: "saad@gmail.com",
    password: "Magneto007",
  },
  {
    email: "raj@gmail.com",
    password: "Raj007",
  },
];

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = body?.email?.trim();
  const password = body?.password?.trim();

  if (!email || !password) return badRequest();

  const user = users.find((user) => user?.email === email);
  if (!user || user?.password !== password) return badRequest();
  const cookie = `${cookieTokenKey}=${MESSAGE_TOKEN}; HttpOnly; Secure; Path=/; Max-Age=3600; SameSite=Strict`;

  return Response.json(
    {
      success: true,
    },
    {
      headers: {
        "Set-Cookie": cookie,
      },
    }
  );
}

function badRequest() {
  return Response.json("Bad Request", {
    status: 400,
  });
}
