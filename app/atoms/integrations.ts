// atoms.ts
import { jotaiStore } from './store';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

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

export const registeredIdsAtom = atom<string[]>([]);

export const integrationStatusAtomFamily = atomFamily((id: string) =>
  atom<IntegrationStatus>({
    id,
    name: null,
    status: 'stopped',
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
    if (!currentIds.includes(id)) {
      jotaiStore.set(registeredIdsAtom, [...currentIds, id]);
    }
    const newValue: IntegrationStatus = {
      ...atomValue,
      ...value
    };
    jotaiStore.set(atom, newValue);
    // console.log("CIDS:",currentIds)
  }
}
