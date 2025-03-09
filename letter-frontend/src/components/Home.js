"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { save_to_drive } from "@/lib/utils";
import { delete_letter } from "@/lib/utils";
import { PencilLine } from "lucide-react";

import { Eye } from "lucide-react";
import { HardDriveUpload } from "lucide-react";
import { FileText } from "lucide-react";
import { Trash2 } from "lucide-react";

import { get_all_letters } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "./AuthProvider";


export default function Home() {
  const [user, setUser] = useAuth();
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    async function f() {
      const letter = await get_all_letters();
      setLetters(letter);
    }
    f()
  }, [user]);

  if (user) {
    return (
      <UserFeed>
        <div>
          <Link href="/create">
            <Button className="bg-chart-2 w-full">
              Create Letter
            </Button>
          </Link>
        </div>
        <LetterLists letters={letters} setLetters={setLetters} />
      </UserFeed>
    )
  }
  else
    return <div
      className="text-center text-xl mt-[20dvh] bg-green-100 p-10 rounded-lg"
    >
      Please sign in to create letter.</div>
}

function UserFeed({ children }) {
  return (
    <div className="px-2">
      {children}
    </div>
  )

}


function LetterLists({ letters, setLetters }) {
  if (letters.length) {
    return (
      <div className="my-5">
        <h2 className="text-lg mb-3">All Letters</h2>
        <div className="flex flex-col gap-3">
          {letters.map(letter => <Letter key={letter.slug} letter={letter} letters={letters} setLetters={setLetters} />)}
        </div>
      </div>
    )
  }
  else {
    return (
      <p className="my-5 text-center">There is not letter 😭. Please create one.</p>
    )
  }
}

function Letter({ letter, letters, setLetters }) {

  return (
    <div className="bg-[#efefef] rounded p-2">
      <h3 className="mb-3 ">{letter.title} {letter.is_draft && "(draft)"}</h3>
      <div className="flex gap-1">
        <Link href={`/letters/${letter.slug}`} title="View">
          <Button size="icon" variant="outline">
            <Eye />
          </Button>
        </Link>
        {letter.is_draft &&
          <Link href={`/edit/${letter.slug}`} title="View in Drive">
            <Button size="icon" variant="outline">
              <PencilLine />
            </Button>
          </Link>
        }



        <Button size="icon" variant="outline" onClick={async () => {
          if (await delete_letter(letter.slug)) {
            setLetters([...letters.filter(l => l.slug != letter.slug)])
            toast("Deleted " + letter.title)
          }
          else {
            toast("Failed")
          }
        }}>
          <Trash2 />
        </Button>


        {letter.is_draft &&
          <Button size="icon" variant="outline" title="Save to drive" onClick={async () => {
            toast("Saving... please wait.")
            const res = await save_to_drive(letter.slug);
            if (res) {
              const id = res.drive_id;
              // let cl = letters.find(l => l.slug == letter.slug)
              let cl = letter;
              cl.drive_id = id;
              cl.is_draft = false;
              const newLetters = [...letters.map(l => l.slug != cl.slug ? l : cl)]
              setLetters(newLetters);
              toast("Saved to drive.")
            }
            else {
              toast("Failed");
            }
          }}>
            <HardDriveUpload />
          </Button>
        }

        {!letter.is_draft &&
          <Link href={letter.drive_id} target="_blank" title="View in Drive">
            <Button size="icon" variant="outline">
              <FileText />
            </Button>
          </Link>
        }
      </div>
    </div>
  )
}

