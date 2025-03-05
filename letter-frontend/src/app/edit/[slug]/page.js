import EditEditor from "./EditEditor"

export default async function Page({ params }) {
    const { slug } = await params
    return <EditEditor slug={slug} />
}