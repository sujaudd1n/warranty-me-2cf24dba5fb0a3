"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { useContext } from "react";
import { AuthContext } from "@/components/AuthContext";
import { ENDPOINT } from "@/lib/utils";

export default function SingleLetter({ slug }) {
    const [user, setUser] = useContext(AuthContext);
    const [letter, setLetter] = useState({});
    useEffect(() => {
        if (!auth.currentUser)
            return;
        async function f() {
            const res = await fetch(ENDPOINT + "api/v1/read-letters/" + slug, {
                method: "post",
                body: JSON.stringify({
                    credential: { idToken: await auth.currentUser.getIdToken() }
                })
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