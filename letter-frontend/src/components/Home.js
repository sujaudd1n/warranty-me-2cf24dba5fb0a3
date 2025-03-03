"use client";

import { useContext, useState } from "react";
import { Button } from "@/components/ui/button"
import { AuthContext } from "./AuthContext";


export default function Home() {
  const [user, setUser] = useContext(AuthContext);
  const [letters, setLetters] = useState([]);

  if (user)
    return <UserFeed letters={letters} />
  else
    return <p>Please sign in to create letter.</p>
}

function UserFeed({ letters }) {
  return (
    <div className="px-2">
      <div>
        <Button>Create Letter</Button>
      </div>
      <div>
        <LetterLists letters={letters} />
      </div>

    </div>
  )

}


function LetterLists({ letters }) {
  if (letters.lenght) {
    return (
      <div>
        <h2 className="text-lg">All Letters</h2>
      </div>
    )
  }
  else {
    return (
      <p>You haven't created any letters.</p>
    )
  }
}
