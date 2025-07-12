import { updateIntegrations, updateIntegration } from "../redux/integrationStatusSlice";
import { updateState } from "../redux/stateSlice";
import mqtt from "mqtt";
import QueuedProcessor from "../utils/queue";
import RouteMatcher from "../utils/routing";

function log(...parts){
  if(true)
    console.log(parts.join(" "))
}

class OrchestratorApi {
  router = new RouteMatcher({
    "/orchestrator/fullStatus": (message) => {
      var list = [];
      Object.entries(message).forEach((entry) => {
        var id = entry[0];
        var stats = entry[1]
        list.push({
          id,
          name: stats.name,
          state: stats.status,
          error: stats.error != 0 ? {
            code: stats.error,
            description: stats.errorDescription
          } : null
        })
      })
      console.log(list)
      this.dispatch(updateIntegration(message))
    },
    "/orchestrator/state": (message) => {
      console.log("We have el state", message)
      this.dispatch(updateState(message.integrationStates))
      this.dispatch(updateIntegration(message.integrations))
    },
    "/orchestrator/status/:integrationId": (message, params) => {
      this.dispatch(updateIntegration({[params.integrationId]: message}))
    },
    "/orchestrator/integration/:integrationId/online": (message, params) => {
      if(message)
        console.log(params.integrationId, "is online");
      else
        console.log(params.integrationId, "is offline");
    },
    "/:integrationId/powerState": (message, params) => {
      console.log("Integration", params.integrationId, "is now", message)
      this.dispatch(updateState({[params.integrationId]: {powerState: message}}))
    }
  })
  constructor(dispatch){
    this.dispatch = dispatch;
    this.connected = false;
    this.queue = new QueuedProcessor(false, (item) => {
      this.mqtt.publish(item.topic, typeof item.message == "object" ? JSON.stringify(item.message) : item.message)
      console.log("Processed message for topic", item.topic)
    })
    // this.messageQueue = []; // {topic: string, message: object}
    this.mqtt = mqtt.connect("mqtt://localhost:1882")
    this.mqtt.on("connect", () => {
      console.log("MQTT has connected")
      this.connected = true;
      this.queue.allowProcessing();
      this.getFullState();
    })
    this.mqtt.on("disconnect", ()=> {
      console.log("MQTT disconnected");
      this.connected = false;
      this.queue.disallowProcessing();
    })
    this.mqtt.subscribe("#")
    this.mqtt.on("message", async (topic, msg) => {
      msg = msg.toString();
      try{
        msg = JSON.parse(msg)
      }catch(e){}
      // console.log("Received message\n", topic, "\"", msg, "\"")
      var match = this.router.findRoute(topic);
      if(match !== null){
        await match.handler(msg, match.params);
      }
    })
  }

  getFullState() {
    this.sendMessage("/orchestrator/getdata/state", "")
  }
  getIntegrationStatus() {
    this.sendMessage("/orchestrator/getdata/fullStatus", "")
  }
  stopIntegration(id) {
    log("Stopping integration with ID:", id)
    this.sendMessage(`/orchestrator/integration/${id}/stop`, "");
  }
  startIntegration(id) {
    log("Starting integration with ID:", id)
    this.sendMessage(`/orchestrator/integration/start`, id);
  }

  togglePowerState(id){
    log("Toggling", id, "power state")
    this.sendMessage(`/${id}/power/toggle`, "")
  }

  sendMessage(topic, message){
    this.queue.add({topic, message})
  }
  static instance = null;
  static getInstance(dispatch) {
        // Check if an instance already exists.
        // If not, create one.
        if (this.instance === null) {
            this.instance = new OrchestratorApi(dispatch);
        }
        // Return the instance.
        return this.instance;
    }
}

export default OrchestratorApi;
