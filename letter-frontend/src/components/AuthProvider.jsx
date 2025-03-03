"use client";

import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
// import { get_csrftoken } from "@/lib/helpers";



// export function syncUserDataWithServer(f, v) {
//     fetch("https://api.madhyamikgrammar.in/grammar/sync", {
//         method:"post",
//         credentials: "include",
//         headers: {
//             'X-CSRFToken': Cookies.get("csrftoken")
//         }
//     })
//         .then(res => res.json())
//         .then(data => {
//             if (data.error) {
//                 console.log("Im in 401")
//                 localStorage.removeItem("loggedInUser")
//                 Cookies.remove("sessionid")
//                 f(v)
//             }
//             else {
//                 console.log(data)
//                 localStorage.setItem("loggedInUser", JSON.stringify(data));
//                 f({ ...data });
//             }
//         })
//         .catch(err => {
//             console.log(err)
//         })

// }

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(auth.currentUser)

    // console.log("in auth provider", user)

    useEffect(() => {
        // get_csrftoken()
        onAuthStateChanged(auth, (user) => {
            console.log(auth, user)
            if (user) {
                setUser(auth.currentUser);
            }
            else {
                setUser(null);
            }
        })
    }, [])

    // useEffect(() => {
    //     syncUserDataWithServer(setUser, null)
    //     const timeoutId = setInterval(() => {
    //         syncUserDataWithServer(setUser, null)
    //     }, 600000)
    //     return () => clearInterval(timeoutId)
    // }, []);


    return (
        <AuthContext.Provider value={[user, setUser]}>
            {children}
        </AuthContext.Provider>
    )
}