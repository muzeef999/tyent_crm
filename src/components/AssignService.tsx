import React from 'react'

type  assignedServiceProp = {
    onClose : () => void
}

const AssignService:React.FC<assignedServiceProp> = ({onClose}) => {
  return (
    <div>AssignService</div>
  )
}

export default AssignService