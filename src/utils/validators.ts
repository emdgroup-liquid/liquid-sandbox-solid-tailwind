export const isEmailValid = (value: string) => {
  return /^\S+@\S+\.\S+$/.test(value)
}
