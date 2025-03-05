export const ENDPOINT = "http://localhost:8000/"
export function get_all_letters() {
    fetch(ENDPOINT + "api/v1/all-letters", {
        method: "post",
        body: JSON.stringify({
            credential: JSON.parse(localStorage.getItem("credential"))
        })
    })
        .then(res => res.json())

}