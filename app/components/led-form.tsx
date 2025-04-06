"use client";

import { useCallback, useId, useRef } from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import clsx from "clsx";
import { Button } from "./button";

const LIMIT = 100;
const REFRESH = 15000;
const colors = ["text-red-500", "text-emerald-500", "text-blue-500"];

export default function LEDForm() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  const [color, setColor] = useState(0);

  const getMessage = useCallback(async () => {
    try {
      const response = await fetch("/api/text");
      if (!response.ok) {
        toast.error("Failed to fetch message");
        return;
      }
      const data = await response.text();
      setText(data);
    } catch (error) {
      toast("Error: " + error);
    } finally {
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = event.currentTarget.text.value;
    if (text.trim() === "") {
      toast("Please enter a message");
      return;
    }
    try {
      setLoading(true);
      const promise = fetch("/api/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(text?.trim()),
      });
      toast.promise(promise, {
        loading: "Loading...",
        success: async () => {
          // const text = await data.json();
          getMessage();
          if (ref.current) {
            ref.current.value = "";
          }
          return `"${
            text.length > 15 ? text.slice(0, 15) + "..." : text
          }" has been set.`;
        },
        error: (err) => {
          return `Error: ${err}`;
        },
      });
    } catch (error) {
      toast("Error: " + error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = setInterval(() => {
      getMessage();
      setColor((prev) => (prev + 1) % colors.length);
    }, REFRESH);

    return () => clearInterval(id);
  }, [getMessage]);

  useEffect(() => {
    getMessage();
  }, [getMessage]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-y-8 h-[100dvh] items-center justify-center bg-zinc-950 text-white font-mono"
    >
      <div className="text-center">
        <h1 className="text-3xl">
          <span className={clsx("relative", colors[color])}>
            L
            <span
              className={clsx(
                "absolute animate-pulse inset-0 [filter:blur(3px)] mix-blend-screen scale-110 select-none",
                colors[color]
              )}
              aria-hidden="true"
            >
              L
            </span>
          </span>
          ED Notice Board
        </h1>
      </div>

      <div className="w-full sm:w-72 mx-auto px-8 sm:px-0">
        <h2 className="relative group flex items-center rounded-md bg-white/10 py-2 outline outline-1 -outline-offset-1 outline-white/20">
          {/**@ts-expect-error _____ */}
          <marquee>{text ? text : "Loading..."}</marquee>
          <div className="font-thin absolute bottom-14 inset-x-0 hidden group-hover:block p-4 border border-white/20 bg-black rounded-md text-sm max-h-48 overflow-auto">
            {text ? text : "Loading..."}
          </div>
        </h2>

        <div className="mt-4 rounded-md bg-white/10 px-3 pb-1.5 pt-2.5 outline outline-1 -outline-offset-1 outline-white/20 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-white">
          <label
            htmlFor={id}
            className="block text-sm font-medium text-zinc-300 bg-blue"
          >
            Enter new message {/*Input Label */}
          </label>
          <input
            ref={ref}
            id={id}
            name="text"
            type="text"
            placeholder={`max ${LIMIT} characters`} //Input placehodelr
            className="block w-full bg-transparent placeholder:text-zinc-400 placeholder:text-sm placeholder:italic focus:outline focus:outline-0 sm:text-sm/6"
            required
            autoComplete="off"
            maxLength={LIMIT}
          />
        </div>
      </div>
      <Button invert disabled={loading} className="">
        Submit
      </Button>
    </form>
  );
}
