exports.handleCookie = (cookie = '') => {
  const items = cookie.split(';')
  const obj = {}

  items.forEach(str => {
    const [key, value] = str.split('=')
    obj[key.trim()] = value
  })

  return obj
}
