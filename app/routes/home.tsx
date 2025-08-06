import React, { useCallback, useEffect } from "react";
import { NavLink } from "react-router";
import { useOrchestrator } from "../orchestrator/interface";
import { registeredIdsAtom } from "../atoms/integrations";
import { integrationStateAtomFamily } from "../atoms/integrationState";
import { useAtom } from "jotai";

import { PrimaryButton } from "../components/button";
import { Switch } from "../components/integrationComponents/switch";
import { ColorPicker } from "../components/integrationComponents/colorPicker";

export function meta({}) {
  return [
    { title: "IoT App" },
    { name: "description", content: "App to control the orchestrator" },
  ];
}

export default function Home() {
  console.log("[Home] rendering");

  const orchestrator = useOrchestrator();

  // Memoize the evaluator function to prevent unnecessary re-renders
  const evaluatePowerState = useCallback((v: string) => {
    // console.log("[Home] evaluating power state:", v);
    return v === "on";
  }, []);
  var [integrationIds, _] = useAtom(registeredIdsAtom)

  return (
    <div>
      <h1>Hello. This is index</h1>
      <NavLink to="/integrations" end>
        <PrimaryButton>GO TO INTEGRATION PAGE</PrimaryButton>
      </NavLink>
      <h2>Integrations</h2>
      <div className="flex flex-col">
        <Switch
          integrationId="closet-light-plug"
          property="/powerState"
          evaluator={evaluatePowerState}
        />
        <Switch
          integrationId="bed-bulb"
          property="/powerState"
          evaluator={evaluatePowerState}
        />
        <ColorPicker
          integrationId="bed-bulb"
          property="/lightState"
          evaluator={(state) => ({
            value: state.brightness,
            hue: state.hue,
            saturation: state.saturation,
          })}
        />
        {
          integrationIds.state.filter((i) => i !== "bed-bulb" && i !== "closet-light-plug").map((id) => 
            <Switch
              integrationId={id}
              property="/powerState"
              evaluator={evaluatePowerState}
            />
          )
        }
      </div>
    </div>
  );
}
