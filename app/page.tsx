'use client';

import { useCallback, useId, useRef } from 'react';
import { useState, useEffect } from 'react';
import { Button } from './components/button';
import { toast } from 'sonner';

const LIMIT = 100;

export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);

  const getMessage = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/text');
      const data = await response.text();
      setText(data);
    } catch (error) {
      toast('Error: ' + error);
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = event.currentTarget.text.value;
    if (text.trim() === '') {
      toast('Please enter a message');
      return;
    }
    try {
      const promise = fetch('/api/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(text?.trim()),
      });
      toast.promise(promise, {
        loading: 'Loading...',
        success: async () => {
          // const text = await data.json();
          getMessage();
          if (ref.current) {
            ref.current.value = '';
          }
          return `"${
            text.length > 15 ? text.slice(0, 15) + '...' : text
          }" has been set.`;
        },
        error: err => {
          return `Error: ${err}`;
        },
      });
    } catch (error) {
      toast('Error: ' + error);
    }
  }

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
          <span className="relative text-emerald-500">
            L
            <span
              className="absolute animate-pulse inset-0 text-emerald-400 [filter:blur(3px)] mix-blend-screen scale-110 select-none"
              aria-hidden="true"
            >
              L
            </span>
          </span>
          ED Notice Board
        </h1>{' '}
        {/* Header text */}
        <h2 className="text-lg mt-4 break-all px-4 leading-tight">
          Current Message: {loading ? 'Loading...' : text}{' '}
          {/* Current message text */}
        </h2>
      </div>

      <div className="min-w-64 rounded-md bg-white/10 px-3 pb-1.5 pt-2.5 outline outline-1 -outline-offset-1 outline-white/20 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-emerald-400">
        <label htmlFor={id} className="block text-xs font-medium text-zinc-300">
          Enter new message {/*Input Label */}
        </label>
        <input
          ref={ref}
          id={id}
          name="text"
          type="text"
          placeholder={`max ${LIMIT} characters`} //Input placehodelr
          className="block w-full bg-transparent placeholder:text-zinc-400 placeholder:text-xs placeholder:italic focus:outline focus:outline-0 sm:text-sm/6"
          required
          autoComplete="off"
          maxLength={LIMIT}
        />
      </div>
      <Button invert className="">
        Submit
      </Button>
    </form>
  );
}
