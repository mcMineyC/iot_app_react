import mqttAPI from './mqtt';
import { createContext, useContext } from 'react';
import { useDispatch } from 'react-redux';

const OrchestratorContext = createContext(null);

export const OrchestratorProvider = ({ children }) => {
    const dispatch = useDispatch();
    
    // let orchestratorInterface;
    // if(window.electronAPI) {
    //     console.log("Using Electron API for orchestrator");
    //     orchestratorInterface = new electronAPI(dispatch);
    // } else {
    //     console.log("No api found to interface with native :(")
    //     orchestratorInterface = new dummyAPI();
    // }
    let orchestratorInterface = mqttAPI.getInstance(dispatch);
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
