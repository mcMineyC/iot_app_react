import mqttAPI from './mqtt';
import {waitUntil} from "../utils/waitUntil"
import { jotaiStore } from '../atoms/store';
import { clientStatusAtom, ClientStatus } from "../atoms/client"
import { createContext, useContext, use } from 'react';

const OrchestratorContext = createContext(null);

export const OrchestratorProvider = ({ children }) => {
    
    // let orchestratorInterface;
    // if(window.electronAPI) {
    //     console.log("Using Electron API for orchestrator");
    //     orchestratorInterface = new electronAPI(dispatch);
    // } else {
    //     console.log("No api found to interface with native :(")
    //     orchestratorInterface = new dummyAPI();
    // }
    let orchestratorInterface = mqttAPI.getInstance();
    console.log("Rebuilding orchestrator provider")
    // window.api = orchestratorInterface;
    
    return (
        <OrchestratorContext.Provider value={orchestratorInterface}>
            {children}
        </OrchestratorContext.Provider>
    );
};

export const useOrchestrator = () => {
    const context = useContext(OrchestratorContext);
    if (!context) {
        throw new Error('useOrchestrator must be used within an OrchestratorProvider');
    }
    return context;
};
export const orchestratorAPI = mqttAPI.getInstance()

export const OrchestratorConnectionWaiter = () => {
  use(waitUntil(() => jotaiStore.get(clientStatusAtom) == ClientStatus.Connected, 100))
  return <></>
}
