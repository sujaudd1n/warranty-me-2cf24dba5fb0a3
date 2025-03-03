"use client";

import { useEffect, useState } from "react";
import TextEditor from "./TextEditor";
import Header from "./Header";
import firebaseApp, { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "firebase/auth";




function Home() {
  let [wt, setwt] = useState("You are not logged in.")
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(auth.currentUser.getToken())
      setwt("Hello " + auth.currentUser.displayName);
    }
    else {
      console.log('nouser')
      setwt("You are not logged in.");
    }
  })
  return (
    <div>
      <Header />
      <p>{wt}</p>
      <TextEditor />
    </div>
  );
}

export default Home;
