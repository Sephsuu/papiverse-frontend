"use client"

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default function Practice() {
    const [dogs, setDogs] = useState([]);

    useEffect(() => {
        async function fetchDogs() {
            try {
                const res = await fetch('https://dogapi.dog/api/v2/breeds', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const json = await res.json();
                setDogs(json.data)
            } catch (error) {
                console.log(error);
                
            }
        }   
        fetchDogs()
    }, [])

    console.log(dogs);
    
    return(
        <section className="h-screen flex flex-col justify-center items-center">
          
            <div className="w-fit">
                <Input
                />
                {dogs.map((item, index) => (
                    <div key={ index }>{item.attributes.name}</div>
                ))}
            </div>
        
        </section>
    );
}