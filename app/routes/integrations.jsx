import React from 'react';
import { NavLink } from "react-router";

import { useOrchestrator } from '../orchestrator/interface.jsx';
import { useSelector } from 'react-redux';

import {PrimaryButton} from "../components/button.jsx"
export default function IntegrationStatus() {
  const orchestrator = useOrchestrator();
  const integrationStatus = useSelector((state) => state.integrationStatus.value);

  return (
    <div>
      <header className="p-3">
        <PrimaryButton>
          <NavLink to="/" className="material-icons">arrow_back</NavLink>
        </PrimaryButton>
        <strong className="px-4 text-xl">Integration Status</strong>
      </header>
    <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
      {Object.entries(integrationStatus).map(([id, status]) => (
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
    </div>
  )
}
