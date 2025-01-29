import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';

let message = 'Hello World';

export async function GET(request: NextRequest) {
  return new Response(message, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

export async function POST(request: NextRequest) {
  const text = await request.json();
  //TODO: update
  message = text;

  return Response.json('text updated successfully', {
    status: 200,
  });
}
