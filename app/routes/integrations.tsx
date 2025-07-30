import React from 'react';
import { NavLink } from "react-router";

import { useAtom } from 'jotai';
import { registeredIdsAtom } from "../atoms/integrations"
import { jotaiStore } from "../atoms/store"
import { useOrchestrator } from '../orchestrator/interface';

import { IntegrationStatusCard } from "../components/integrationStatusCard";
import {PrimaryButton} from "../components/button"
export default function IntegrationStatus() {
  var [integrationIds, _] = useAtom(registeredIdsAtom)

  console.log("Integration Ids", integrationIds)

  return (
    <div>
      <header className="p-3">
        <NavLink to="/">
        <PrimaryButton>
          <span className="material-icons">arrow_back</span>
        </PrimaryButton>
        </NavLink>
        <strong className="px-4 text-xl">Integration Status</strong>
      </header>
    <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
      {
        integrationIds.map((id) =>  
          <IntegrationStatusCard key={id} id={id}/>
        )
      }
    </div>
    </div>
  )
}
