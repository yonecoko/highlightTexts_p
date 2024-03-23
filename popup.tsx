import "./style.css"

import { serialize } from "v8"
import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

function SearchTexts() {
  const storage = new Storage()
  const [inputValue, setInputValue] = useState<string>("")
  const [isError, setIsError] = useState<boolean>(false)
  const [isErrorOfColor, setIsErrorOfColor] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] =
    useState("テキストを入力し、色を選んでください")
  const [length, setLength] = useState(0)
  const [isReset, setIsReset] = useState(false)
  // const [isSearch, setIsSearch] = useState(false)

  const [terms, setTerms] = useState([])
  const [colorClassName, setColorClassName] = useState([])
  const [colors, setColors] = useState("カラー")

  const colorNameArray = ["カラー", "purple", "yellow", "green", "blue", "red"]
  const uniq = (array) => [...new Set(array)]

  // console.log(isSearch)

  useEffect(() => {
    storage.get<string[]>("terms").then((res) => setTerms(res ?? []))
    storage
      .get<string[]>("colorClassName")
      .then((res) => setColorClassName(res ?? []))
    storage.get<number>("length").then((res) => setLength(res))
    storage.get<boolean>("isReset").then((res) => setIsReset(res))
    // storage.get<boolean>("isSearch").then((res) => setIsSearch(res))
    setColors("カラー")
  }, [])

  useEffect(() => {
    storage.set("terms", terms)
    storage.set("colorClassName", colorClassName)
    storage.set("colors", colors)
    storage.set("length", length)
    storage.set("isReset", isReset)
    // storage.set("isSearch", isSearch)
  }, [terms, colorClassName, colors, length, isReset])

  // co÷nsole.log(isReset)

  const deleteValue = (index) => {
    setTerms(terms.filter((_, i) => i != index))
    setColorClassName(colorClassName.filter((_, i) => i != index))
    setLength(length - 1)
    // setIsSearch(false)
  }

  const colorSelect = () => {
    return (
      <>
        <select
          name="colors"
          style={{ height: "30px", backgroundColor: "#fff", margin: "0 10px" }}
          id="colorSelect"
          onChange={isColor}
          value={colors}>
          {colorNameArray.map((color) => {
            return <option value={color}>{color}</option>
          })}
        </select>
      </>
    )
  }

  const isColor = (e) => {
    const selectColor = e.target.value
    if (selectColor === "カラー") {
      setIsErrorOfColor(true)
      setErrorMessage("色を選択してください")
    } else {
      setIsErrorOfColor(false)
      setErrorMessage("")
    }

    setColors(e.target.value)
  }

  const isValue = (e) => {
    const inputValue = e.target.value
    if (inputValue.length === 0) {
      setIsError(true)
      setErrorMessage("テキストをしてください")
    } else {
      setIsError(false)
      setErrorMessage("")
    }

    setInputValue(e.target.value)
  }

  const printErrorText = () => {
    return <p className="errorText">{errorMessage}</p>
  }

  const selectColorNon = (): boolean => {
    if (colors === "カラー") return true
  }

  const wordLengthZero = (): boolean => {
    if (inputValue.length === 0) return true
  }

  const reSearchBtn = () => {
    if (length >= 1) {
      return (
        <>
          <button className="resetBtn" onClick={resetBtn}>
            リセット
          </button>
          {/* <button className="resetBtn" onClick={() => setIsSearch(true)}>
            検索
          </button> */}
        </>
      )
    }
  }

  const resetBtn = () => {
    setLength(0)
    setColorClassName([])
    setTerms([])
    setIsReset(true)
    // setIsSearch(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTerms(uniq([...terms, inputValue]))
    setInputValue("")
    setColors("カラー")
    setIsError(false)
    setIsErrorOfColor(false)
    setLength(length + 1)
    {
      colorNameArray.map((color) => {
        const selectColor = `highlight-${color}`
        if (color === colors) {
          setColorClassName([...colorClassName, selectColor])
        }
      })
    }
  }

  return (
    <div
      style={{
        width: "300px",
        textAlign: "center"
      }}>
      <form></form>
      <div
        style={{ marginTop: "8px", display: "flex", flexDirection: "column" }}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="term" style={{ margin: "10px 0" }}>
            検索ワードを入力してください。
          </label>
          <div>
            <input
              id="term"
              type="text"
              autoFocus
              value={inputValue}
              onChange={isValue}
              className="inputValue"
            />
            {colorSelect()}
            {printErrorText()}
          </div>

          <button
            className="addBtn"
            disabled={
              wordLengthZero() || selectColorNon() || isError || isErrorOfColor
            }>
            追加
          </button>
        </form>
      </div>

      <div
        style={{
          height: "100%"
        }}>
        <ul style={{ listStyle: "none", padding: "0px", margin: "0" }}>
          {terms.map((term, i) => {
            return (
              <li key={term} className={`searchWords ${colorClassName[i]}`}>
                {term}
                <button
                  type="button"
                  className="deleteBtn"
                  onClick={() => deleteValue(i)}>
                  x
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      {reSearchBtn()}
    </div>
  )
}

export default SearchTexts
