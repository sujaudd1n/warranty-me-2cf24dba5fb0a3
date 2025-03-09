"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { ENDPOINT } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";

export default function SingleLetter({ slug }) {
    const [user, setUser] = useAuth();
    const [letter, setLetter] = useState({});
    useEffect(() => {
        if (!auth.currentUser)
            return;

        async function f() {
            const idToken = await auth.currentUser.getIdToken();
            const res = await fetch(ENDPOINT + "letters/" + slug, {
                headers: {
                    Authorization: `Bearer ${idToken}`
                },
            })
            const letter = await res.json();
            setLetter(letter);
        }
        f()
    }, [user])

    if (!letter)
        return;

    return (
        <div>
            <h2 className="text-xl border-b-2 mb-4">{letter.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: letter.content }}></div>
        </div>
    )
}