import React from 'react';

export const PrimaryButton = function (props){
  return (
    <button className={"btn btn-"+props.color} {...props}/>
  );
}
