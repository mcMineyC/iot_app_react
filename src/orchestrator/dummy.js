class DummyAPI {
    constructor() {
        console.log("Dummy Orchestrator interface initialized");
    }
    sendMessage(message){
        console.log("Send message:", message);
    }
}
export default DummyAPI;