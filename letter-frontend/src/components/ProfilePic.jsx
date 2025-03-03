import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePic({ url, alt }) {
    return (
        <Avatar>
            <AvatarImage src={url} />
            <AvatarFallback>{alt}</AvatarFallback>
        </Avatar>
    )
}