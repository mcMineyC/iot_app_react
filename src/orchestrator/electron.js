import { updateIntegrations, updateIntegration } from '../redux/integrationStatusSlice'

class ElectronAPI {
    constructor(dispatch) {
        this.dispatch = dispatch;
        console.log("Electron Orchestrator interface initialized");
        window.electronAPI.onMessage(this.onMessage.bind(this));
        window.electronAPI.onConnect(this.onConnect.bind(this));
        window.electronAPI.onDisconnect(this.onDisconnect.bind(this));

        // Notify Electron that React is ready
        window.electronAPI.notifyReady();
    }
    sendMessage(message){
        window.electronAPI.sendMessage(message);
    }
    onMessage(message){
        console.log("Received message from Electron:", JSON.stringify(message));
        if(message.topic == "/orchestrator/status"){
            var data = JSON.parse(message.message);
            this.dispatch(updateIntegrations(data))
        }else if(message.topic.startsWith("/orchestrator/integration/") && message.topic.endsWith("/status")) {
            // Handle integration status updates
            const integrationId = message.topic.split("/")[3];
            const integrationStatus = JSON.parse(message.message);
            console.log({ id: integrationId, ...integrationStatus })
            this.dispatch(updateIntegration({ integrationId: integrationId, ...integrationStatus }));
        } else {
            console.warn("Unknown topic:", message.topic);
        }
    }
    onConnect(){
        console.log("Connected to MQTT");
    }
    onDisconnect(){
        console.log("Disconnected from MQTT");
    }
    getIntegrationStatus() {
        this.sendMessage({ topic: "/orchestrator/getdata/status", message: ""})
    }
    stopIntegration(id) {
            console.log("Stopping integration with ID:", id);
            this.sendMessage({ topic: `/orchestrator/integration/${id}/stop`, message: ""});
    }
    startIntegration(id){
            console.log("Starting integration with ID:", id);
            this.sendMessage({ topic: `/orchestrator/integration/start`, message: id});
    }
}
export default ElectronAPI;