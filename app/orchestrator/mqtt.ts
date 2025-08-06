"use client";

import mqtt from "mqtt";
import QueuedProcessor from "../utils/queue";
import RouteMatcher from "../utils/routing";
import {
  updateIntegrationsStatus,
  updateIntegrationStatus,
} from "../atoms/integrations";
import {
  updateIntegrationsState,
  updateIntegrationState,
} from "../atoms/integrationState";
import type { IntegrationStatus } from "../atoms/integrations";
import type { IntegrationState } from "../atoms/integrationState";
import type { Dictionary } from "../utils/types";
import { ClientStatus } from "../atoms/client";
import { updateClientStatus } from "../atoms/client";

// Single instance that gets exported
let instance: OrchestratorApi | null = null;

// Debug flag for logging
const DEBUG = true;

function log(...parts: any[]) {
  if (DEBUG) {
    console.log("[MQTT]", ...parts);
  }
}

class OrchestratorApi {
  private mqtt: mqtt.MqttClient;
  private connected: boolean;
  private queue: QueuedProcessor;
  private router: RouteMatcher;
  private initializationPromise: Promise<void>;

  private constructor(hostname) {
    if (instance) {
      throw new Error(
        "OrchestratorApi is a singleton. Use getInstance() instead."
      );
    }

    this.connected = false;
    log("Initializing MQTT API");

    // Initialize router with all routes
    this.router = new RouteMatcher({
      "/orchestrator/status": (message: Dictionary<IntegrationStatus>) => {
        updateIntegrationsStatus(message);
        log("Updated integrations status", message);
      },
      "/orchestrator/state": (message) => {
        log("Received state update", message);
        updateIntegrationsState(message);
      },
      "/orchestrator/status/:integrationId": (message, params) => {
        log("Status update for", params.integrationId, message);
        updateIntegrationStatus(
          params.integrationId,
          message as IntegrationStatus
        );
      },
      "/orchestrator/integration/:integrationId/online": (message, params) => {
        log(params.integrationId, message ? "is online" : "is offline");
      },
      "/:integrationId/:dataPath": (message, params) => {
        log("State update for", params.integrationId, message);
        updateIntegrationState(params.integrationId, {
          ["/" + params.dataPath]: message,
        });
      },
    });

    // Initialize message queue
    this.queue = new QueuedProcessor(false, (item) => {
      const message =
        typeof item.message === "object"
          ? JSON.stringify(item.message)
          : item.message;
      this.mqtt.publish(item.topic, message);
      log("Published message to topic", item.topic);
    });

    // Initialize MQTT client
    this.initializationPromise = new Promise((resolve) => {
      updateClientStatus(ClientStatus.Connecting);

      this.mqtt = mqtt.connect(`mqtt://${hostname}:1882`);

      this.mqtt.on("connect", () => {
        log("Connected to MQTT broker");
        this.connected = true;
        updateClientStatus(ClientStatus.Connected);
        this.queue.allowProcessing();
        this.getFullState();
        resolve();
      });

      this.mqtt.on("disconnect", () => {
        log("Disconnected from MQTT broker");
        this.connected = false;
        updateClientStatus(ClientStatus.Disconnected);
        this.queue.disallowProcessing();
      });

      this.mqtt.on("error", (error) => {
        log("MQTT error:", error);
        updateClientStatus(ClientStatus.Error);
      });

      this.mqtt.subscribe("#");

      this.mqtt.on("message", async (topic, msg) => {
        let message = msg.toString();
        try {
          message = JSON.parse(message);
        } catch (e) {
          // Message is not JSON, use raw string
        }

        const match = this.router.findRoute(topic);
        if (match !== null) {
          await match.handler(message, match.params);
        }
      });
    });
  }

  // Public methods

  async waitForConnection(): Promise<void> {
    return this.initializationPromise;
  }

  getFullState(): void {
    this.sendMessage("/orchestrator/getdata/fullState", "");
  }

  getIntegrationStatus(): void {
    this.sendMessage("/orchestrator/getdata/status", "");
  }

  stopIntegration(id: string): void {
    log("Stopping integration:", id);
    this.sendMessage(`/orchestrator/integration/${id}/stop`, "");
  }

  startIntegration(id: string): void {
    log("Starting integration:", id);
    this.sendMessage(`/orchestrator/integration/start`, id);
  }

  togglePower(id: string): void {
    console.error(
      "Prefer powerOff or powerOn for optimistically updated state :)"
    );
    log("Toggling power state:", id);
    this.sendMessage(`/${id}/power/toggle`, "");
  }

  powerOff(id: string): void {
    this.sendMessage(`/${id}/power/off`, "");
    updateIntegrationState(id, {
      "/powerState": "off",
    });
  }

  powerOn(id: string): void {
    this.sendMessage(`/${id}/power/on`, "");
    updateIntegrationState(id, {
      "/powerState": "on",
    });
  }

  setBrightness(id: string, brightness: number): void {
    this.sendMessage(`/${id}/brightness`, brightness);
  }

  callCommand(id: string, commandWithSlash: string, message: any): void {
    this.sendMessage(`/${id}${commandWithSlash}`, message);
  }

  private sendMessage(topic: string, message: any): void {
    this.queue.add({ topic, message });
  }

  // Singleton getInstance method
  static getInstance(hostname: string): OrchestratorApi {
    if (!instance || hostname === null) {
      log("Creating new MQTT API instance");
      instance = new OrchestratorApi(hostname);
    }
    return instance;
  }
}

export default OrchestratorApi;
