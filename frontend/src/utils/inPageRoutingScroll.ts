export const scrollToElementOfId = (id: string) => {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" })
}

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

export const scrollToBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
}

export const scrollToElementOfClass = (className: string) => {
  document
    .querySelector(`.${className}`)
    ?.scrollIntoView({ behavior: "smooth", block: "start" })
}