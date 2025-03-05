import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { auth } from "./firebase";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const ENDPOINT = "http://localhost:8000/"

export async function get_all_letters() {
  if (!auth.currentUser)
    return [];
  const res = await fetch(ENDPOINT + "api/v1/all-letters", {
    method: "post",
    body: JSON.stringify({
      credential: { idToken: await auth.currentUser.getIdToken() }
    })
  })
  const data = await res.json();
  return data.data;
}

export async function delete_letter(slug) {
  if (!auth.currentUser)
    return false;
  const res = await fetch(ENDPOINT + "api/v1/letters/" + slug, {
    method: "delete",
    body: JSON.stringify({
      credential: { idToken: await auth.currentUser.getIdToken() }
    })
  })
  if (res.ok) return true;
  return false;
}

export async function save_to_drive(slug) {
  if (!auth.currentUser)
    return false;
  const res = await fetch(ENDPOINT + "api/v1/save-to-drive", {
    method: "post",
    body: JSON.stringify({
      slug: slug,
      credential: { idToken: await auth.currentUser.getIdToken() }
    })
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  else {
    let data = await res.json();
    console.log(data)
    window.location.replace(data.url);
  }
}