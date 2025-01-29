import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';

class TextManager {
  private static text: string;
  constructor(text: string) {
    TextManager.text = text;
  }

  static getText() {
    return this.text;
  }

  static setText(text: string) {
    this.text = text;
  }
}

TextManager.setText('Hello World');

//ESP 32 la vapraycha ahe   
export async function GET() {
  return new Response(TextManager.getText(), {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const text = await request.json();
    //TODO: update
    const message = text.slice(0, 100);
    TextManager.setText(message);

    return Response.json('text updated successfully', {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return Response.json('error', {
      status: 500,
    });
  }
}
