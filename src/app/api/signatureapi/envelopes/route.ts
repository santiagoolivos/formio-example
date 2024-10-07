import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiResponse = await fetch('http://localhost:3000/v1/envelopes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': "key_test_2WeJJKACl0bUtrwFzUw40E7vOz6RGR5bCsDRzpPLKDIq", 
      },
      body: JSON.stringify(body),
    });

    const data = await apiResponse.json();

    return NextResponse.json({ data, responseStatus: apiResponse.status, responseStatusText: apiResponse.statusText });
  } catch (error) {
    console.error('Error forwarding request:', error);
    return NextResponse.json({ error: 'Failed to forward request' }, { status: 500 });
  }
}
