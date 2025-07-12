import React from 'react';
import { useOrchestrator } from '../orchestrator/interface.jsx';
import { useSelector } from 'react-redux';

import {PrimaryButton} from "../components/button.jsx"
export default function IntegrationStatus() {
  const orchestrator = useOrchestrator();
  const integrationStatus = useSelector((state) => state.integrationStatus.value);

  return (
    <div className="columns-2 lg:columns-3 h-full">
      {Object.entries(integrationStatus).map(([id, status]) => (
        <div key={id} className="card my-5 h-56 p-4 break-inside-avoid-column">
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
            {status.hasError && <div>
              <strong>Error Code: {status.error} ({status.errorDescription})</strong>
              <br/>
            </div>}
          </div>
          <div className="flex justify-center">
            {(status.status === "running" || status.status === "starting") && <PrimaryButton className="w-3/4" color="red" onClick={() => orchestrator.stopIntegration(id)}>Stop Integration{status.status === "starting" && <span className="loading loading-dots loading-lg"></span>}</PrimaryButton>}
            
            {status.status === "stopped" && <PrimaryButton className="w-3/4" color="green" onClick={() => orchestrator.startIntegration(id)}>Start Integration</PrimaryButton>}
          </div>
        </div>
      ))}
    </div>
  )
}
