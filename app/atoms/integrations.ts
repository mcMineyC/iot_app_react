// atoms.ts
import { jotaiStore } from './store';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import type {IntegrationIdRecord} from "../utils/types"

export type IntegrationStatusMap = {
  [id: string]: Partial<IntegrationStatus>
}

export type IntegrationStatus = {
  id: string;
  name: string;
  status: string;
  error: number;
  errorDescription: string;
};

export const registeredIdsAtom = atom<IntegrationIdRecord>({
  state: [],
  status: []
});


export const integrationStatusAtomFamily = atomFamily((id: string) =>
  atom<IntegrationStatus>({
    id,
    name: null,
    status: null,
    error: null,
    errorDescription: null,
  })
);

export const updateIntegrationStatus = function(id: string, value: Partial<IntegrationStatus>) {
  updateIntegrationsStatus({[id]: value})
}

export const updateIntegrationsStatus = function(data: IntegrationStatusMap) {
  for (var [id, value] of Object.entries(data)){
    value.id = id;
    // console.log(id+":",value)
    const atom = integrationStatusAtomFamily(id)
    const atomValue = jotaiStore.get(atom);
    const currentIds = jotaiStore.get(registeredIdsAtom);
    if (!currentIds.status.includes(id)) {
      jotaiStore.set(registeredIdsAtom, {status: [...currentIds.status, id], state: currentIds.state});
    }
    const newValue: IntegrationStatus = {
      ...atomValue,
      ...value
    };
    jotaiStore.set(atom, newValue);
    // console.log("CIDS:",currentIds)
  }
}
