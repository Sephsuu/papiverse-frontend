// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request }); // Can use custom decode if not using next-auth
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  // Optionally, add claim/role checks here
  return NextResponse.next();
}
