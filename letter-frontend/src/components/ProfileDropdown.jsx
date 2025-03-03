"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import ProfilePic from "./ProfilePic";
import { auth } from "../lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

import {
    LogOut,
    User,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AuthContext } from "./AuthContext";

export default function ProfileDropdown() {
    let [user, setUser] = useContext(AuthContext);

    if (user) {
        return <LoggedInUserDropDown user={user} />
    }
    else {
        return <Link href="/login">LogIn</Link>
    }
}

function LoggedInUserDropDown({ user }) {
    function logout() {
        signOut(auth);
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="cursor-pointer">
                    <ProfilePic url={user.photoURL} alt={user.displayName} />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem>
                    <User />
                    <Link href="/profile">Profile</Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem onSelect={logout}>
                    <LogOut />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}