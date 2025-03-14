"use client";

import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";
import { auth } from "../lib/firebase";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "./AuthProvider";

export default function Header() {
    let [user, setUser] = useAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
        }
        else {
            setUser(null);
        }
    })
    async function toggleSignIn() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                console.log("Login succeeded")
            }).catch((error) => {
                console.log(error)
            });
    }

    return (
        <header className="">
            <div className="px-2 py-4 pr-3 flex flex-wrap items-center gap-3 md:gap-6 lg:max-w-[70dvw] lg:mx-auto">
                {/* <div className="md:order-2 md:grow"> */}
                {/* </div> */}
                <div className="text-gray-500 text-xl font-semibold md:order-1 relative z-[10]">
                    <Link href="/">
                        <span>
                            LetterApp
                        </span>
                    </Link>
                </div>
                <div className="ml-auto md:order-3">
                    {!user && <button onClick={toggleSignIn}>SignIn</button>}
                    {user && <ProfileDropdown />}
                </div>
            </div>
        </header >
    )
}