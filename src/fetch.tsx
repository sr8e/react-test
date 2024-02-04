import { NavigateFunction } from "react-router-dom"

export const fetch_api = (navigate: NavigateFunction, endpoint: string, method: string, data: object | undefined = undefined, headers: { [h: string]: string } | undefined = undefined) => {
    const body = data && JSON.stringify(data)
    return fetch(endpoint, { method, headers, body }).then(
        async res => {
            if (res.status === 401) {
                navigate("/login")
                return { status: 401, data: undefined }
            }
            else {
                return { status: res.status, data: await res.json() }
            }
        }
    )
}