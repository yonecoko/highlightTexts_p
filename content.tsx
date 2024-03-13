import "./style.css"

import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  css: ["./style.css"]
}

const highlightTexts = () => {
  const [terms, setTerms] = useState<string[]>([])
  // const [isPushBtn, setIsPushBtn] = useState(false)
  const [colorClassName, setColorClassName] = useState<string[]>([])
  // const [isMatch, setIsMatch] = useState<boolean>(false)
  // const [length, setLength] = useState(0)

  // const btn = Array.from(document.getElementsByClassName("searchBtn"))
  const divArray = Array.from(document.getElementsByTagName("div"))

  const storage = new Storage()

  // URLが条件に一致しているかチェック
  useEffect(() => {
    highlight()
  }, [terms])

  // console.log(terms)

  // コンポーネントマウント時にリストを取得
  useEffect(() => {
    storage.get<string[]>("terms").then((res) => setTerms(res ?? []))
    storage
      .get<string[]>("colorClassName")
      .then((res) => setColorClassName(res ?? []))
    // storage.get<boolean>("isPushBtn").then((res) => setIsPushBtn(res))
    storage.watch({ terms: (c) => setTerms(c.newValue) })
    // storage.watch({ length: (c) => setLength(c.newValue) })
  }, [])

  const highlight = () => {
    for (const term of terms) {
      for (const div of divArray) {
        const text = div.innerHTML
        for (const style of colorClassName) {
          if (text.includes(term)) {
            const highlightStyle = `<span class=${style}>${term}</span>`
            let highlight = text.replaceAll(term, highlightStyle)
            div.innerHTML = highlight
            // console.log(div.innerHTML)
            // // innerHTMLで上書きすると、タグ込みで上書きできそう。これで実装できないか考える
            // return highlightStyle
          }
        }
      }
    }
  }

  return <p className={colorClassName[0]}>{terms[0]}</p>
}

export default highlightTexts
