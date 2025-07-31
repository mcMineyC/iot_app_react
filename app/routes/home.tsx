import React from "react";
import { NavLink } from "react-router";
import {useOrchestrator} from "../orchestrator/interface";
import { registeredIdsAtom } from "../atoms/integrations"
import { integrationStateAtomFamily } from "../atoms/integrationState"
import {useAtom} from "jotai"


import {PrimaryButton} from "../components/button";
import { Switch } from "../components/integrationComponents/switch";

export function meta({}) {
  return [
    { title: "IoT App" },
    { name: "description", content: "App to control the orchestrator" },
  ];
}

export default function Home() {
  var orchestrator = useOrchestrator();
  var [integrationIds, _] = useAtom(registeredIdsAtom)
  var states = {};
  integrationIds.state.forEach(
    (i) => states[i] = useAtom(integrationStateAtomFamily(i))
  )
  return (
    <div>
      <h1>Hello.  This is index</h1>
      <NavLink to="/integrations" end><PrimaryButton>GO TO INTEGRATION PAGE</PrimaryButton></NavLink>
      {// {Object.entries(state).map(([id, integrationState]) => (
      //   <div key={id}>
      //     <span>{integrations[id].name} - {integrationState.powerState}</span>
      //   </div>
      // ))}
      }
      <h2>Integrations</h2>
      {// {Object.keys(integrations).map((integrationId) => (
      //   <Switch key={integrationId} integrationId={integrationId} />
      // ))}
        JSON.stringify(states, null, 2)
      }
    </div>
  );
}
