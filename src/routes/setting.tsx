import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { fetch_api } from "../fetch"

import trash from "../trash-icon.svg"
import send from "../sent-icon.svg"

interface choiceListCreateFormArgType {
    itemName: string
    defaultValue: any
    updateItem: (values: any[], setValues: any) => (index: number, newValue: any, ...keys: any) => void
    RowElement: (params: any) => JSX.Element
    validate: (values: any[], setErrors: any) => boolean
}
export const ChoiceListCreateForm = ({
    itemName,
    defaultValue,
    updateItem,
    RowElement,
    validate,
}: choiceListCreateFormArgType) => {
    const [items, setItems] = useState(new Map())
    const [newItems, setNewItems] = useState<any[]>([])
    const [newItemErrors, setNewItemErrors] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        fetch_api(navigate, `/api/choices/${itemName}`, "GET").then(({ data }) => {
            if (data !== undefined) {
                setItems(new Map(Object.entries(data).map(([k, v]) => [parseInt(k), v])))
            }
        })
    }, [])

    const deleteItem = (index: number) => {
        setNewItems(newItems.filter((_, i) => i !== index))
    }

    useEffect(() => {
        validate(newItems, setNewItemErrors)
    }, [newItems])
    const post = () => {
        if (!validate(newItems, setNewItemErrors)) {
            return
        }
        fetch_api(navigate, `/api/choices/${itemName}`, "POST", newItems, { "content-type": "application/json" }).then(
            ({ status, data }) => {
                if (status === 200) {
                    setItems(new Map(Object.entries(data).map(([k, v]) => [parseInt(k), v])))
                    setNewItems([])
                } else if (status === 400) {
                    console.log("woosh")
                }
            },
        )
    }
    return (
        <div>
            <div>
                <h3>{itemName} settings</h3>
                <div>
                    <h4>edit existing {itemName}</h4>
                    {[...items].map(([k, v]) => (
                        <Link key={`link-${k}`} to={`${k}`}>
                            {v}
                        </Link>
                    ))}
                </div>
                <div>
                    <h4>add</h4>
                    {newItems.map((v, i) => (
                        <RowElement
                            key={`genre-new-${i}`}
                            index={i}
                            value={v}
                            updateValue={updateItem(newItems, setNewItems)}
                            deleteValue={deleteItem}
                            errors={newItemErrors}
                        />
                    ))}
                    <button
                        onClick={() => {
                            setNewItems([...newItems, defaultValue])
                        }}
                    >
                        + Add row
                    </button>
                </div>
            </div>
            <button onClick={post}>
                <img src={send} width="30" />
            </button>
        </div>
    )
}

export const ChoiceUpdateDeleteForm = ({ itemName }: any) => {
    const { itemId } = useParams()
    return (
        <div>
            {itemName}
            {itemId}
        </div>
    )
}

export const CreateGenreFormRow = ({ index, value, updateValue, deleteValue, errors }: any) => {
    const clsName = "Input-element " + (errors.includes(index) ? "error" : "")
    return (
        <div>
            <button onClick={() => deleteValue(index)}>
                <img src={trash} width="15" />
            </button>
            <input
                className={clsName}
                placeholder="name..."
                value={value}
                onChange={(e) => updateValue(index, e.target.value)}
            ></input>
        </div>
    )
}

export const GenreListCreateForm = () => {
    const validate = (values: string[], setErrors: any) => {
        const errors: number[] = []
        const isValid = values.reduce((b, v, i) => {
            if (v === "") {
                errors.push(i)
                return false
            } else {
                return b
            }
        }, true)
        setErrors(errors)
        return isValid
    }
    const updateItem = (values: string[], setValues: any) => (index: number, newValue: string) => {
        setValues(values.map((v, i) => (i === index ? newValue : v)))
    }
    return (
        <ChoiceListCreateForm
            itemName="genre"
            defaultValue=""
            RowElement={CreateGenreFormRow}
            updateItem={updateItem}
            validate={validate}
        />
    )
}

interface methodType {
    name: string
    not_own: boolean
}
export const CreateMethodFormRow = ({ index, value, updateValue, deleteValue, errors }: any) => {
    const clsName = "Input-element " + (errors.includes(index) ? "error" : "")
    return (
        <div>
            <button onClick={() => deleteValue(index)}>
                <img src={trash} width="15" />
            </button>
            <input
                className={clsName}
                placeholder="name..."
                value={value.name}
                onChange={(e) => updateValue(index, "name", e.target.value)}
            ></input>
            <label>
                <input
                    type="checkbox"
                    value={value.not_own}
                    onChange={(e) => updateValue(index, "not_own", e.target.checked)}
                />{" "}
                not own
            </label>
        </div>
    )
}
export const MethodListCreateForm = () => {
    const validate = (values: methodType[], setErrors: any) => {
        const errors: number[] = []
        const isValid = values.reduce((b, v, i) => {
            if (v.name === "") {
                errors.push(i)
                return false
            } else {
                return b
            }
        }, true)
        setErrors(errors)
        return isValid
    }
    const updateItem =
        (values: methodType[], setValues: any) =>
        (index: number, key: "name" | "not_own", newValue: string | boolean) => {
            setValues(values.map((v, i) => (i === index ? { ...v, [key]: newValue } : v)))
        }
    return (
        <ChoiceListCreateForm
            itemName="method"
            defaultValue={{ name: "", not_own: false }}
            RowElement={CreateMethodFormRow}
            updateItem={updateItem}
            validate={validate}
        />
    )
}
