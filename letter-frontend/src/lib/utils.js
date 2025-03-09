import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { auth } from "./firebase";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// export const ENDPOINT = "http://localhost:8000/api/v1/letter/"
export const ENDPOINT = "https://api.sujauddin.me/api/v1/letter/"

export async function get_all_letters() {
  if (!auth.currentUser)
    return [];
  const idToken = await auth.currentUser.getIdToken();
  const res = await fetch(ENDPOINT + "letters", {
    headers: {
      Authorization: `Bearer ${idToken}`
    }
  })

  const data = await res.json();
  return data.data;
}

export async function delete_letter(slug) {
  if (!auth.currentUser)
    return false;
  const idToken = await auth.currentUser.getIdToken();
  const res = await fetch(ENDPOINT + "letters/" + slug, {
    method: "delete",
    headers: {
      Authorization: `Bearer ${idToken}`
    },
  })
  if (res.ok) return true;
  return false;
}

export async function save_to_drive(slug) {
  if (!auth.currentUser)
    return false;

  const idToken = await auth.currentUser.getIdToken();
  const res = await fetch(ENDPOINT + "save-to-drive", {
    method: "post",
    headers: {
      Authorization: `Bearer ${idToken}`
    },
    body: JSON.stringify({
      slug: slug,
    })
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  else {
    let data = await res.json();
    window.location.replace(data.url);
  }
}