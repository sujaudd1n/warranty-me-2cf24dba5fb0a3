"use client";

import Header from "@/components/Header";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import Script from "next/script";
import Footer from "./Footer";
import { ProgressBar, ProgressBarProvider } from "react-transition-progress"
// import Cookies from "js-cookie";
// import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";

export const DynamicAuthProvider = dynamic(() => import("./AuthProvider"), {
    ssr: false
})



export default function CustomLayout({ children }) {
    return (
        <DynamicAuthProvider>
            {/* <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            > */}
            {/* <ProgressBarProvider> */}
            {/* <ProgressBar className="fixed h-1 shadow-lg shadow-sky-500/20 bg-sky-500 top-0" /> */}
            <Header />
            <div className="px-3 pt-5 pb-12 lg:w-[70dvw] lg:mx-auto">
                {children}
            </div>
            <Footer />
            <Toaster />
            {/* </ProgressBarProvider> */}
            {/* </ThemeProvider> */}
        </DynamicAuthProvider>

    )
}