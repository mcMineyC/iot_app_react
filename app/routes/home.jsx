import React from "react";
import { NavLink } from "react-router";
import {useOrchestrator} from "../orchestrator/interface.jsx";
import { useSelector } from 'react-redux';

import {PrimaryButton} from "../components/button.jsx";
import { Switch } from "../components/integrationComponents/switch.jsx";

export function meta({}) {
  return [
    { title: "IoT App" },
    { name: "description", content: "App to control the orchestrator" },
  ];
}

export default function Home() {
  var orchestrator = useOrchestrator();
  const state = useSelector((state) => state.state.value);
  const integrations = useSelector((state) => state.integrationStatus.value);
  console.log(state)
  return (
    <div>
      <h1>Hello.  This is index</h1>
      <PrimaryButton><NavLink to="/integrations" end>Go to integration page</NavLink></PrimaryButton>
      {Object.entries(state).map(([id, integrationState]) => (
        <div key={id}>
          <span>{integrations[id].name} - {integrationState.powerState}</span>
        </div>
      ))}
      <h2>Integrations</h2>
      {Object.keys(integrations).map((integrationId) => (
        <Switch key={integrationId} integrationId={integrationId} />
      ))}
    </div>
  );
}
