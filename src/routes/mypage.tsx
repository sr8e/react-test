import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetch_api } from "../fetch"

export const MyPage = () => {
    let accessed = false
    const [payments, setPayments] = useState(new Map())
    const [genres, setGenres] = useState(new Map())
    const navigate = useNavigate()

    useEffect(() => {
        if (accessed) {
            return
        }
        fetch_api(navigate, "/api/payment", "GET").then(({ data }) => {
            if (data !== undefined) {
                const paymentMap = data.reduce(
                    (map: Map<string, any>, v: { total: number; month: string; genre: number; not_own: number }) => {
                        if (!map.has(v.month)) {
                            return map.set(
                                v.month,
                                new Map<number | string, number>([
                                    [v.genre, v.total],
                                    ["sum", v.total],
                                    ["sum_not_own", v.not_own && v.total],
                                ]),
                            )
                        } else {
                            const m = map.get(v.month)
                            m.set(v.genre, (m.get(v.genre) ?? 0) + v.total)
                            m.set("sum", m.get("sum") + v.total)
                            m.set("sum_not_own", m.get("sum_not_own") + (v.not_own && v.total))
                            return map
                        }
                    },
                    new Map(),
                )
                setPayments(paymentMap)
            }
        })
        fetch_api(navigate, "/api/choices?include_default=1", "GET").then(({ data }) => {
            if (data !== undefined) {
                const genres = new Map<number | null, any>(
                    Object.entries(data.genres).map(([k, v]) => [parseInt(k), v]),
                )
                genres.set(null, "不明")
                setGenres(genres)
            }
        })
        accessed = true
    }, [])

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>month</th>
                        {[...genres.values()].map((v, i) => (
                            <th key={`gh-${i}`}>{v}</th>
                        ))}
                        <th>sum</th>
                    </tr>
                </thead>
                <tbody>
                    {[...payments].map(([k, v], i) => (
                        <tr key={`d-${i}`}>
                            <td key={`d-${i}-index`}>{k}</td>
                            {[...genres.keys()].map((gk) => (
                                <td key={`d-${i}-g-${gk}`}>{v.get(gk)}</td>
                            ))}
                            <td key={`d-${i}-sum`}>
                                {v.get("sum")}({v.get("sum_not_own")})
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p>aa</p>
        </div>
    )
}
