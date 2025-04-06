import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";
import Message from "../../lib/queries";
import { cookies as next_cookies } from "next/headers";
import { cookieTokenKey } from "@/app/constants";

const MESSAGE_TOKEN = process.env.MESSAGE_TOKEN;

const getMessage = async () => {
  return Message.find();
};

//ESP 32 la vapraycha ahe
export async function GET(request: NextRequest) {
  const message = await getMessage();
  const headersToken = request.headers
    .get("Authorization")
    ?.replace("Bearer ", "");

  const cookies = await next_cookies();
  const cookieToken = cookies.get(cookieTokenKey)?.value;
  const arr = [cookieToken, headersToken];

  if (!arr.includes(MESSAGE_TOKEN)) {
    return Response.json("Unauthorized", {
      status: 400,
    });
  }

  //TODO: check headers or cookie
  return new Response(message?.[0]?.title || "Message not set.", {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const text = await request.json();

    const textLimit = text.slice(0, 100);
    const msg = await Message.findOneAndUpdate(
      {}, // Query: find the one existing message document (or an empty query to match any document)
      { title: textLimit }, // Update: set the title to the new value
      { new: true, upsert: true } // Options: return the updated document; create one if it doesn't exist
    );

    return Response.json(msg, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return Response.json("error", {
      status: 500,
    });
  }
}
