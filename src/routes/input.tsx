import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import trash from '../trash-icon.svg'
import send from '../sent-icon.svg'
import { fetch_api } from "../fetch"


export const InputElement = ({ index, colName, state, setState, type = "text", errors }: any) => {
    const cls = "Input-element " + (errors.includes(colName) ? "error" : "")
    return <input className={cls} onChange={(e) => setState(index, colName, e.target.value)} value={state[colName]} type={type} />

}

export const SelectElement = ({ index, colName, state, setState, options, errors }: any) => {
    const cls = "Input-element " + (errors.includes(colName) ? "error" : "")
    return <select className={cls} onChange={(e) => setState(index, colName, e.target.value)} value={state[colName]}>
        <option value="0">choose {colName}...</option>
        {[...options].map(([k, v]) => <option value={k} key={`${colName}list-${index}-${k}`}>{v}</option>)}
    </select>
}

export const PaymentInputFormRow = (props: any) => {
    //console.log(`${props.index} => ${props.errors} ${props.state.amount}`)
    return <div>
        <button onClick={() => props.delRow(props.index)}><img src={trash} width="20" /></button>
        <InputElement colName="date" type="date" {...props} />
        <InputElement colName="amount" type="number" {...props} />
        <InputElement colName="shop" {...props} />
        <SelectElement colName="genre" options={props.genres} {...props} />
        <InputElement colName="attr" {...props} />
        <InputElement colName="note" {...props} />
        <SelectElement colName="method" options={props.methods} {...props} />
    </div >
}

export const PaymentInputForm = () => {
    let accessed = false
    const [genrelist, setGenrelist] = useState(new Map())
    const [methodlist, setMethodlist] = useState(new Map())
    const navigate = useNavigate()

    // fetch data from API once, at first
    useEffect(() => {
        if (accessed) {
            return
        }
        fetch_api(navigate, "/api/choices?include_default=1", "GET").then(({ data }) => {
            if (data !== undefined) {
                setGenrelist(new Map(Object.entries(data.genres).map(([k, v]) => [parseInt(k), v])))
                setMethodlist(new Map(Object.entries(data.methods).map(([k, v]) => [parseInt(k), v])))
            }
        })
        accessed = true
    }, [])

    const [rowVal, setRowVal] = useState<{ [col: string]: string }[]>([{}])
    const [errorlist, setErrorlist] = useState<string[][]>([[]])

    const setRowState = (i: number, colName: string, val: string) => {
        setRowVal(
            rowVal.map((v, j) => i === j ? { ...v, [colName]: val } : v)
        )
    }

    const delRow = (i: number) => {
        setRowVal(rowVal.filter((_, j) => i !== j))
        setErrorlist(errorlist.filter((_, j) => i !== j))
        console.log(errorlist)
    }

    const validate = () => {
        let valid = true
        let errors: string[][] = rowVal.map(_ => [])
        const inputKeys = ["amount", "shop", "date"]
        const selectKeys = ["genre", "method"]

        rowVal.forEach((v: any, i: number) => {
            inputKeys.forEach((k: string) => {
                if ((v[k] ?? "") === "") {
                    errors[i].push(k)
                    valid = false
                }
            })
            selectKeys.forEach(k => {
                if ((v[k] ?? "0") === "0") {
                    errors[i].push(k)
                    valid = false
                }
            })
        })
        setErrorlist(errors)
        return valid && rowVal.length !== 0
    }

    // validate whatever element has updated
    useEffect(() => { validate() }, [rowVal])

    const push = () => {
        if (!validate()) {
            return
        }
        fetch_api(navigate, "/api/payment", "POST", rowVal, { "Content-Type": "application/json" }).then(
            ({ status, data }) => console.log(data?.detail)
        )
    }

    return <div>
        {rowVal.map(
            (v, i) => <PaymentInputFormRow
                key={`inputrow-${i}`} index={i} state={v} setState={setRowState} delRow={delRow} genres={genrelist} methods={methodlist} errors={errorlist[i]}
            />

        )}
        <button onClick={push}><img src={send} width="30" /></button>
        <button onClick={() => {
            setRowVal([...rowVal, { date: "", amount: "", shop: "", genre: "0", attr: "", note: "", method: "0" }])
            setErrorlist([...errorlist, []])
        }}>+</button>
    </div>

}