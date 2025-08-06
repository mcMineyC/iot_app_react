"use client";
import mqttAPI from "./mqtt.ts";
import { waitUntil } from "../utils/waitUntil";
import { jotaiStore } from "../atoms/store";
import { useAtomValue } from "jotai";
import { clientStatusAtom, ClientStatus } from "../atoms/client";
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router";

// Create a constant instance that will be shared across the app
// const orchestratorAPI = mqttAPI.getInstance(useLocation().);
// orches

// Create context with proper typing
const OrchestratorContext = createContext<mqttAPI | null>(null);

export const OrchestratorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [hostname, setHostname] = useState("");
  useEffect(() => {
    // This runs only in the browser
    console.log("Running in browser?");
    setHostname(window.location.hostname);
  }, []);
  console.log("OrchestratorProvider");
  // Since we're using a singleton, we don't need useMemo here anymore
  // We just use the pre-initialized constant instance
  const orchestratorAPI = mqttAPI.getInstance(hostname);
  return (
    <OrchestratorContext.Provider value={orchestratorAPI}>
      {children}
    </OrchestratorContext.Provider>
  );
};

export const useOrchestrator = () => {
  const context = useContext(OrchestratorContext);
  if (!context) {
    throw new Error(
      "useOrchestrator must be used within an OrchestratorProvider"
    );
  }
  return context;
};

interface OrchestratorConnectionWaiterProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

export const OrchestratorConnectionWaiter = ({
  children,
  fallback,
}: OrchestratorConnectionWaiterProps) => {
  const clientStatus = useAtomValue(clientStatusAtom);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (clientStatus === ClientStatus.Connected) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [clientStatus]);

  if (!isReady) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
