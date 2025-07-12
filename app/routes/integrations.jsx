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
            <div key={id} className="card my-5 h-56 break-inside-avoid-column">
              <div className="card-body">
            <span className="card-title justify-between">
                <h2>{status.name}</h2>
                <div
                  className={"indicator size-[16px] rounded-full surface bg-"+(
                    status.status === "running" ? "green" : "red"
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
              <div>
                {status.status === "running" && <PrimaryButton color="red" onClick={() => orchestrator.stopIntegration(id)}>Stop Integration</PrimaryButton>}
                {status.status === "stopped" && <PrimaryButton color="green" onClick={() => orchestrator.startIntegration(id)}>Start Integration</PrimaryButton>}
              </div>
            </div>
          ))}
        </div>
  )
}
