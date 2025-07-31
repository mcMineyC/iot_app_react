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

export const integrationStateAtomFamily = atomFamily((id: string) => 
  atom<IntegrationState>({
    id
  })
);

export const integrationStatePropertyAtomFamily = atomFamily((props: IntegrationStatePropertyFilter) => 
  selectAtom(integrationStateAtomFamily(props.id), (state) => state[props.property])
)

export const updateIntegrationState = function(id: string, value: Partial<IntegrationState>) {
  updateIntegrationsState({[id]: value})
}

export const updateIntegrationsState = function(data: IntegrationStateMap) {
  for(var [id, value] of Object.entries(data)) {
    value.id = id;
    const atom = integrationStateAtomFamily(id);
    const atomValue = jotaiStore.get(atom);

    const currentIds = jotaiStore.get(registeredIdsAtom);
    if (!currentIds.state.includes(id)) {
      jotaiStore.set(registeredIdsAtom, {
        status: currentIds.status,
        state: [...currentIds.state, id],
      });
    }
    var newVal = {}
    for(var [key, val] of Object.entries(value)){
      try{
        console.log("Parsing val for", key)
        console.log(val)
        newVal[key] = JSON.parse(val)
      }catch(e){
        console.log("Error parsing")
        newVal[key] = val
      } // Don't error if it's not parseable
    }
    console.log("Previous value:", atomValue)
    console.log("New value:", newVal)
    const newValue: IntegrationState = {
      ...atomValue,
      ...newVal,
    }
    jotaiStore.set(atom, newValue);
  }  
}
