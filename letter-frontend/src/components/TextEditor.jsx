"use client";

import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from './ui/button';
import { Input } from "@/components/ui/input"
import { ENDPOINT } from '@/lib/utils';
import { toast } from 'sonner';
import { redirect, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

export default function TextEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter()

  async function handleSaveDraft() {
    const body = {
      title: title,
      content: content,
      is_draft: false,
      credential: { idToken: await auth.currentUser.getIdToken() }
    }
    console.log(body)
    fetch(ENDPOINT + "api/v1/letters", {
      method: "POST",
      body: JSON.stringify(body)
    })
      .then(async (res) => {
        const data = await res.json()
        if (res.status == 200) {
          toast("Letter has been created.", {
          })
          router.push(`/`)
        }
        else {
          toast(
            "Failed", { description: data.message }
          )
        }
      })
      .catch(error => {
        toast("Error", {
          description: error
        })
      })
  };

  return (
    <div className='flex flex-col gap-2'>
      <Input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <ReactQuill theme="snow" value={content} onChange={setContent} />
      <Button onClick={handleSaveDraft}>Save</Button>
    </div>
  );
};