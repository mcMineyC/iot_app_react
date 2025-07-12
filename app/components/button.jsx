import React from 'react';

export const PrimaryButton = function (props){
  return (
    <button {...props} className={"btn btn-"+props.color+" "+props.className}/>
  );
}
