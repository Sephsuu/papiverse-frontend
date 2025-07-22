import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { JwtPayload } from './payload';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;
    if (!token) return new Response('Unauthorized', { status: 401 });
    const claims = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return Response.json({
        branchId: claims.branchId,
        userId: claims.userId,
        sub: claims.sub,
        roles: claims.roles,
    });
}