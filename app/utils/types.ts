export type Dictionary<T> = {
  [key: string | number]: T
}

export type IntegrationIdRecord = {
  status: string[],
  state: string[]
}
