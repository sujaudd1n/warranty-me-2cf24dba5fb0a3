"use client";

import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { ENDPOINT } from '@/lib/utils';
import { toast } from 'sonner';
import { redirect, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';

export default function EditEditor({ slug }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [user, setUser] = useAuth();

    const router = useRouter()
    useEffect(() => {
        if (!auth.currentUser)
            return;

        async function f() {
            const idToken = await auth.currentUser.getIdToken();
            const res = await fetch(ENDPOINT + "letters/" + slug, {
                headers: {
                    Authorization: `Bearer ${idToken}`
                },
            })
            const letter = await res.json();
            setContent(letter.content);
            setTitle(letter.title);
        }
        f()
    }, [user])


    async function editLetter() {
        const body = {
            title: title,
            content: content,
            is_draft: false,
        }
        const idToken = await auth.currentUser.getIdToken();
        fetch(ENDPOINT + "letters/" + slug, {
            method: "put",
            headers: {
                Authorization: `Bearer ${idToken}`
            },
            body: JSON.stringify(body)
        })
            .then(async (res) => {
                const data = await res.json()
                if (res.status == 200) {
                    toast("Letter has been edited.", {
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
            <Button onClick={editLetter}>Save</Button>
        </div>
    );
}