'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { handleChange } from '../../lib/form-handle';
import { jwtDecode } from 'jwt-decode';
import { FormLoader } from '@/components/ui/loader';
import { AuthService } from '@/services/AuthService';
import { toast } from 'sonner';

export default function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [onProcess, setProcess] = useState(false);

    async function handleSubmit() {
        try {
            setProcess(true);
            const token = await AuthService.authenticateUser(credentials);
            if (token) {
                const res = await AuthService.setCookie(jwtDecode(token));
                toast.info(res);
            }
        } catch (error) { toast.error(`${error}`) }
        finally {
            setProcess(false);
        }
    }

    return(
        <section
            className="w-full h-screen flex justify-center items-center bg-cover bg-center"
            style={{ backgroundImage: "url('/images/kp_login.jpg')" }}
        >
            <Toaster position="top-center" />
            <div className='flex flex-col gap-4 bg-light w-[400px] shadow-lg rounded-xl max-md:shadow-none max-md:border-0 px-8 py-12'>
   
                <div>
                    <Image
                        src="/images/kp_logo.png"
                        alt="Krispy Papi Logo"
                        width={60}
                        height={60}
                        className="mx-auto"
                    />
                    <Image
                        src="/images/papiverse_logo.png"
                        alt="Papiverse Logo"
                        width={200}
                        height={0}
                        className="mx-auto mb-2"
                    />
                </div>
    

                <div className='flex flex-col gap-3'>
                    <input
                        className="text-base border border-slate-400 pl-3 py-1 rounded-md"
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={credentials.username}
                        onChange={ e => handleChange(e, setCredentials) }
                        required
                    />
                    <input
                        className="text-base border border-slate-400 pl-3 py-1 rounded-md"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={credentials.password}
                        onChange={ e => handleChange(e, setCredentials) }
                        required
                    />
                </div>

                <Button
                    className="w-fit text-base px-10 mx-auto bg-dark text-light cursor-pointer hover:bg-light hover:border hover:border-dark hover:text-dark"
                    onClick={ () => handleSubmit() }
                    disabled={ onProcess }
                >
                    <FormLoader onProcess={ onProcess } label='Log In' loadingLabel='Logging In' />
                </Button>
              

                <div className='flex flex-col items-center gap-3'>
                    <Link className="text-dark underline hover:text-dark" href="#">
                        Forgot Password
                    </Link>
                    <Link className="text-dark underline hover:text-dark" href="#">
                        Reset Password
                    </Link>
                </div>

                </div>
            
        </section>
    );
}