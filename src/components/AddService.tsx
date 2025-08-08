import React from 'react'

type  AddServiceProp = {
    onClose : () =>  void;
}


const AddService:React.FC<AddServiceProp> = ({onClose}) => {
  return (
    <div>AddService</div>
  )
}

export default AddService