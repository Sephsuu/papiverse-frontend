import { log } from 'console';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { token } = await request.json();
        console.log('Received token:', token);
        

        if (!token) {
            return new Response(JSON.stringify({ error: 'Missing token' }), { status: 400 });
        }

        const base64Payload = token.split('.')[1];
        const decodedJson = Buffer.from(base64Payload, 'base64').toString();
        const decodedToken = JSON.parse(decodedJson);
        console.log('Decoded Token:', decodedToken);

        const cookieStore = await cookies();
        cookieStore.set('decodedToken', JSON.stringify(decodedToken), {
            // httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24, 
            sameSite: 'lax',
        });

        return new Response(JSON.stringify({ message: 'Cookie set successfully!' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Failed to process the token.' }),
            { status: 500 }
        );
    }
}