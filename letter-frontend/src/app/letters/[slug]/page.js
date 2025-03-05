import SingleLetter from "./SingleLetter";

export default async function Page({ params }) {
    const { slug } = await params
    return <SingleLetter slug={slug} />
}