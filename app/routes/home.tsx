import { NavLink } from "react-router";

export function meta({}) {
  return [
    { title: "IoT App" },
    { name: "description", content: "App to control the orchestrator" },
  ];
}

export default function Home() {
  return (
    <div>
      <h1>Hello.  This is index</h1>
      <NavLink to="/integrations" end>Go to integration page</NavLink>
    </div>
  );
}
