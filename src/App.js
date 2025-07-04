import logo from './logo.svg';
import './App.css';
import { useOrchestrator } from './orchestrator/interface';
import { useSelector } from 'react-redux';

function App() {
  const orchestrator = useOrchestrator();
  const integrationStatus = useSelector((state) => state.integrationStatus.value);
  return (
    <div className="App center-children">
      <div className="full">
        <button onClick={() => {
          orchestrator.getIntegrationStatus();
        }}>Send Message</button>
        <div className="log">
          {Object.entries(integrationStatus).map(([id, status]) => (
            <div key={id}>
              <strong>Integration ID:</strong> {id} <br />
              <strong>Status:</strong> {status.status} <br />
              <strong>Timestamp:</strong> {status.timestamp} <br />
              {status.status === "running" && <button onClick={() => orchestrator.stopIntegration(id)}>Stop Integration</button>}
              {status.status === "stopped" && <button onClick={() => orchestrator.startIntegration(id)}>Start Integration</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
