import { NextResponse } from 'next/server';
export default function GET() {
    return NextResponse.json({ message: 'WebSocket server is running' });
  // Next.js requires a default export
}