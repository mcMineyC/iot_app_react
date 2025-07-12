import React from 'react';

export const PrimaryButton = function (props){
  var color = "blue"
  if(props.color)
    color = props.color 
  return (
    <button {...props} className={"btn btn-"+color+" "+props.className}/>
  );
}
