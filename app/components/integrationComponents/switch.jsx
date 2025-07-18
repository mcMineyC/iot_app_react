import React from 'react';
import { useSelector } from 'react-redux';
import { PrimaryButton } from '../button.jsx';

export const Switch = ({ integrationId }) => {
  console.log("Switch component for integrationId:", integrationId);
  const state = useSelector((state) => state.state.value);
  console.log(state);
  const integration = Object.entries(state).find(([key, int]) => key === integrationId);

  if (!integration) {
    return <div className='integration-card'>
        <PrimaryButton color="white" className="square">Integration not found</PrimaryButton>
    </div>;
  }

  return (
    <div className='integration-card'>
      <h2>{integration.name}</h2>
      <p>{integration.description}</p>
    </div>
  );
}
