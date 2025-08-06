import { jotaiStore } from './store';
import { atom } from 'jotai';
import { atomFamily, selectAtom } from 'jotai/utils';
import type {Dictionary} from "../utils/types"
import {registeredIdsAtom} from "./integrations";

export type IntegrationStatePropertyFilter = {
  id: string;
  property: string;
}

export type IntegrationStateMap = {
  [id: string]: Partial<IntegrationState>;
}

export type IntegrationState = Dictionary<any>;

export const integrationStateMapAtom = atom<{ [id: string]: IntegrationState }>({});

export const integrationStateAtomFamily = atomFamily((id: string) =>
  atom(
    (get) => get(integrationStateMapAtom)[id], // read
    (get, set, update: Partial<IntegrationState>) => {
      const prev = get(integrationStateMapAtom)[id] || { id };
      set(integrationStateMapAtom, {
        ...get(integrationStateMapAtom),
        [id]: {
          ...prev,
          ...update,
        },
      });
    }
  )
);

export const integrationStatePropertyAtomFamily = atomFamily((props: IntegrationStatePropertyFilter) => 
  selectAtom(
    integrationStateAtomFamily(props.id),
    (state) => typeof(state) === "undefined" ? null : state[props.property]
  ),
  (a, b) => Object.is(a, b)
)

export const updateIntegrationState = function(id: string, value: Partial<IntegrationState>) {
  updateIntegrationsState({[id]: value})
}

export const updateIntegrationsState = (data: IntegrationStateMap) => {
  for (const [id, rawValue] of Object.entries(data)) {
    // Step 1: Parse the incoming values safely
    const parsedValue: Record<string, any> = {};

    for (const [key, val] of Object.entries(rawValue)) {
      try {
        parsedValue[key] = JSON.parse(val);
      } catch {
        parsedValue[key] = val;
      }
    }

    // Step 2: Get the current state
    const atom = integrationStateAtomFamily(id);
    const prevState = jotaiStore.get(atom) || { id }; // fallback if missing

    // Step 3: Compose new state
    const newState: IntegrationState = {
      ...prevState,
      ...parsedValue,
      id, // always include id
    };

    // Step 4: Write new state to atom
    jotaiStore.set(atom, newState);

    // Step 5: Update the list of registered IDs if necessary
    const currentIds = jotaiStore.get(registeredIdsAtom);
    if (!currentIds.state.includes(id)) {
      jotaiStore.set(registeredIdsAtom, {
        ...currentIds,
        state: [...currentIds.state, id],
      });
    }

    // Debug logs
    console.log(`Updated state for [${id}]:`, newState);
  }
};
