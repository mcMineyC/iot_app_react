import { atom } from "jotai"
import {jotaiStore} from "./store"

export enum ClientStatus {
  Connected,
  Connecting,
  Disconnected,
  ConnectionError
}

export const updateClientStatus = (stat: ClientStatus) => {
  jotaiStore.set(clientStatusAtom, stat)
}

export const clientStatusAtom = atom<ClientStatus>(ClientStatus.Disconnected);
