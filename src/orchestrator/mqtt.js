import { updateIntegrations, updateIntegration } from "../redux/integrationStatusSlice";
import mqtt from "mqtt";
import QueuedProcessor from "../queue";
import RouteMatcher from "../routing";

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
      this.dispatch(updateIntegrations(message))
    },
    "/orchestrator/status/:integrationId": (message, params) => {
      console.log("Integration status update!")
      console.log({...message, id: params.integrationId})
      this.dispatch(updateIntegration({...message, id: params.integrationId}))
    },
    "/:integrationId/online": (message, params) => {
      console.log(params);
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
  sendMessage(topic, message){
    this.queue.add({topic, message})
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
}

export default OrchestratorApi;
