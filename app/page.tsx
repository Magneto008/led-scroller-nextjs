'use client';

import { useCallback, useId, useRef } from 'react';
import { useState, useEffect } from 'react';
import { Button } from './components/button';

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
      alert('Error: ' + error);
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = event.currentTarget.text.value;
    if (text.trim() === '') {
      alert('Please enter a message');
      return;
    }
    if (text.trim().length > LIMIT) {
      alert(
        `Message is too long, plese enter a message less than ${LIMIT} characters`
      );
      return;
    }
    try {
      const response = await fetch('/api/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(text?.trim()),
      });
      if (!response.ok) {
        throw new Error('Error: ' + response.status);
      }
      // alert('Message sent: ' + text);
      getMessage();
      if (ref.current) {
        ref.current.value = '';
      }
    } catch (error) {
      alert('Error: ' + error);
    }
  }

  useEffect(() => {
    getMessage();
  }, [getMessage]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-y-8 h-screen items-center justify-center bg-zinc-950 text-white font-mono"
    >
      <div className="text-center">
        <h1 className="text-3xl">LED Notice Board</h1> {/* Header text */}
        <h2 className="text-xl mt-4">
          Current Message: {loading ? 'Loading...' : text}{' '}
          {/* Current message text */}
        </h2>
      </div>

      <div className="min-w-64 rounded-md bg-white/10 px-3 pb-1.5 pt-2.5 outline outline-1 -outline-offset-1 outline-white/20 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
        <label htmlFor={id} className="block text-xs font-medium text-zinc-300">
          Enter new message {/*Input Label */}
        </label>
        <input
          ref={ref}
          id={id}
          name="text"
          type="text"
          placeholder={'Hello World'} //Input placehodelr
          className="block w-full bg-transparent placeholder:text-zinc-400 placeholder:italic focus:outline focus:outline-0 sm:text-sm/6"
          required
        />
      </div>
      <Button invert className="">
        Submit
      </Button>
    </form>
  );
}
