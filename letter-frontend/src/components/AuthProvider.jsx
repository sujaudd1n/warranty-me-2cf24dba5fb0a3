"use client";

import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "@/lib/firebase";
import {
    onAuthStateChanged,
} from "firebase/auth";

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(auth.currentUser)
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(auth.currentUser);
            }
            else {
                setUser(null);
            }
        })
    }, [])

    return (
        <AuthContext.Provider value={[user, setUser]}>
            {children}
        </AuthContext.Provider>
    )
}