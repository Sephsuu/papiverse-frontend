import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface User {
    id: string;
    email: string;
    password: string;
}

export async function GET() {
    try {
        const res = await pool.query('SELECT * FROM "users" ORDER BY email');
        return NextResponse.json(res.rows);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user: User = await req.json();

        if (!user) {
            return NextResponse.json({ error: 'No user at the request body' }, { status: 400 });
        }

        const res = await pool.query<User>(
            `INSERT INTO "users" (email, password) VALUES ($1, $2) RETURNING *`,
            [user.email, user.password]
        )

        return NextResponse.json(res.rows[0], { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const user: User = await req.json();

        if (!user) {    
            return NextResponse.json({ error: 'No user at the request body' }, { status: 400 });
        }
        
        const selectUser = await pool.query(
            `SELECT * FROM "users" WHERE id = $1`,
            [user.id]
        );

        if (selectUser.rows.length === 0) {
            return NextResponse.json({ error: `No user found with id ${user.id}`})
        }

        const insertUser = await pool.query(
            `UPDATE "users" SET 
            email = $1, password = $2 
            WHERE id = $3 RETURNING *`,
            [user.email, user.password, user.id]
        );

        return NextResponse.json(insertUser.rows[0], { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error'}, { status: 500 })
    }
}