import React from "react";
import { NavLink } from "react-router";
import {useOrchestrator} from "../orchestrator/interface.jsx";
import { useSelector } from 'react-redux';

export function meta({}) {
  return [
    { title: "IoT App" },
    { name: "description", content: "App to control the orchestrator" },
  ];
}

export default function Home() {
  var orchestrator = useOrchestrator();
  const state = useSelector((state) => state.state.value);
  console.log("State:")
  console.log(state)
  return (
    <div>
      <h1>Hello.  This is index</h1>
      <NavLink to="/integrations" end>Go to integration page</NavLink>
    </div>
  );
}
