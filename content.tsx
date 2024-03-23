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
  const [colorClassName, setColorClassName] = useState<string[]>([])
  const [isReset, setIsReset] = useState(false)
  const divArray = Array.from(document.getElementsByTagName("div"))
  const storage = new Storage()

  useEffect(() => {
    highlightText()
  }, [terms])

  // コンポーネントマウント時にリストを取得
  useEffect(() => {
    storage.get<string[]>("terms").then((res) => setTerms(res ?? []))
    storage.watch({ terms: (c) => setTerms(c.newValue) })
    storage
      .get<string[]>("colorClassName")
      .then((res) => setColorClassName(res ?? []))
    storage.watch({ colorClassName: (c) => setColorClassName(c.newValue) })
    storage.get<boolean>("isReset").then((res) => setIsReset(res))
    storage.watch({ isReset: (c) => setIsReset(c.newValue) })
  }, [])

  const highlightText = () => {
    divArray.map((div) => {
      const text = div.innerHTML
      const highlightStyle = `<span class=${colorClassName[terms.length - 1]}>${terms[terms.length - 1]}</span>`
      const highlight = text.replaceAll(terms[terms.length - 1], highlightStyle)
      div.innerHTML = highlight

      if (isReset) {
      }
    })
  }

  return
}

export default highlightTexts
