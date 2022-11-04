export const parsePath = (str: string) => {
  const to = str.replace(/^.*?#/, '')
  // Hash-only hrefs like `#foo` from plain anchors will come in as `/#foo` whereas a link to
  // `/foo` will be `/#/foo`. Check if the `to` starts with a `/` and if not append it as a hash
  // to the current path, so we can handle these in-page anchors correctly.
  if (!to.startsWith('/')) {
    const [, path = '/'] = window.location.hash.split('#', 2)
    return `${path}#${to}`
  }
  return to
}
