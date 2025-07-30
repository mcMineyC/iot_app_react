import React from 'react';

import { useAtom } from 'jotai';

import { integrationStatusAtomFamily } from "../atoms/integrations"
import { useOrchestrator } from '../orchestrator/interface';

import {PrimaryButton} from "../components/button"

export const IntegrationStatusCard = ({id}) => {
  const orchestrator = useOrchestrator();
  var [status, _] = useAtom(integrationStatusAtomFamily(id))
  return (
        <div key={id} className="card gap-y-5 min-h-4xl p-4 break-inside-avoid-column">
          <div className="card-body p-0">
            <span className="card-title justify-between">
              <h2>{status.name}</h2>
              <div
                className={"indicator size-[16px] rounded-full surface bg-"+(
                  status.status === "running" ? "green" : status.status === "starting" ? "yellow" : "red"
                )+"-accent"}>
              </div>
            </span>
            <span><strong>Integration ID:</strong> {id}</span><br />
            <span><strong>Status:</strong> {status.status}</span><br />
            {status.error !== null && status.error !== 0 && <div>
              <strong>Error Code: {status.error} ({status.errorDescription})</strong>
              <br/>
            </div>}
          </div>
          <div className="flex justify-center">
            {(status.status === "running" || status.status === "starting") && <PrimaryButton className="w-3/4" color="red" onClick={() => orchestrator.stopIntegration(id)}>Stop Integration{status.status === "starting" && <span className="loading loading-dots loading-lg"></span>}</PrimaryButton>}
            
            {status.status === "stopped" && <PrimaryButton className="w-3/4" color="green" onClick={() => orchestrator.startIntegration(id)}>Start Integration</PrimaryButton>}
          </div>
        </div>
  )
}
