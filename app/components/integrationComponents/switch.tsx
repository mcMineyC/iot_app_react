import React, { useMemo, useCallback, useEffect } from "react";
import { PrimaryButton } from "../button.jsx";
import { useAtom } from "jotai";
import { integrationStatePropertyAtomFamily } from "../../atoms/integrationState";
import { useOrchestrator } from "../../orchestrator/interface";

export const Switch = React.memo(({ integrationId, property, evaluator }) => {
  // // Debug mount/unmount
  // useEffect(() => {
  //   console.log(`[Switch ${integrationId}] mounted`);
  //   return () => console.log(`[Switch ${integrationId}] unmounted`);
  // }, [integrationId]);
  //
  // // Debug prop changes
  // useEffect(() => {
  //   console.log(`[Switch ${integrationId}] props changed:`, {
  //     property,
  //     evaluator,
  //   });
  // }, [integrationId, property, evaluator]);
  //
  // Memoize the atom parameters
  const atomParam = useMemo(() => {
    console.log(`[Switch ${integrationId}] creating atom params`);
    return { id: integrationId, property };
  }, [integrationId, property]);

  // Get state from atom
  const [state] = useAtom(integrationStatePropertyAtomFamily(atomParam));
  const orchestrator = useOrchestrator();

  // Debug state changes
  // useEffect(() => {
  //   console.log(`[Switch ${integrationId}] state changed:`, state);
  // }, [integrationId, state]);

  // Memoize the evaluation result
  const on = useMemo(() => {
    console.log(`[Switch ${integrationId}] evaluating state:`, state);
    if (state === null || state === undefined) {
      return null;
    }
    try {
      return evaluator(state);
    } catch (e) {
      console.error(`[Switch ${integrationId}] evaluation error:`, e);
      return null;
    }
  }, [integrationId, state, evaluator]);

  // Debug render

  // If state is invalid, show error state
  if (on === null) {
    return (
      <div className="integration-card">
        <PrimaryButton color="white" className="square">
          Integration not found
        </PrimaryButton>
      </div>
    );
  }

  // Render the switch state
  return (
    <span id={"switch-integration-"+integrationId} className="integration-switch">
      <span className="text-lg">{integrationId}: {on.toString()}</span>
      <input type="checkbox" checked={on} onChange={e => on ? orchestrator.powerOff(integrationId) : orchestrator.powerOn(integrationId)} className="toggle toggle-xl" />
    </span>
  );
});

// Add display name for debugging
Switch.displayName = "Switch";
