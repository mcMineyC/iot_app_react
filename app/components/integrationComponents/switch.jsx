import React from 'react';
import { useSelector } from 'react-redux';
import { PrimaryButton } from '../button.jsx';

export const Switch = ({ integrationId }) => {
  const integration = useSelector((state) =>
    Object.entries(state.state).find(([key, int]) => int.id === integrationId)
  );

  if (!integration) {
    return <div>
        <PrimaryButton color="white" className="square">Integration not found</PrimaryButton>
    </div>;
  }

  return (
    <div>
      <h2>{integration.name}</h2>
      <p>{integration.description}</p>
    </div>
  );
}
