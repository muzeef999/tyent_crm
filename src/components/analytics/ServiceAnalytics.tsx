import React from 'react'
import { FaUsers } from 'react-icons/fa';

type ServiceAnalyticsProps = {
  totalService: number;
  thisMonth: number;
  unSatisfedCustomer: number;
  notAssignedService:number;
  PendingServices:number;
};


const ServiceAnalytics:React.FC<ServiceAnalyticsProps> = ({totalService, thisMonth, unSatisfedCustomer, notAssignedService, PendingServices}) => {

  const cardStyle =
    "flex flex-col items-center justify-around bg-background shadow-md rounded-lg p-4 w-full sm:w-1/3";

  const valueStyle = "flex items-center gap-2 text-xl font-semibold";


  return (
    <div className="flex flex-col sm:flex-row gap-4">

      <div className={cardStyle}>
              <div className={valueStyle}>
                <FaUsers size={20} className="text-blue-500" />
                {totalService}
              </div>
              <p className="text-sm text-gray-500 mt-1">Total customers</p>
            </div>

            
      <div className={cardStyle}>
              <div className={valueStyle}>
                <FaUsers size={20} className="text-blue-500" />
                {thisMonth}
              </div>
              <p className="text-sm text-gray-500 mt-1">Total customers</p>
            </div>

            
      <div className={cardStyle}>
              <div className={valueStyle}>
                <FaUsers size={20} className="text-blue-500" />
                {unSatisfedCustomer}
              </div>
              <p className="text-sm text-gray-500 mt-1">Total customers</p>
            </div>

            
      <div className={cardStyle}>
              <div className={valueStyle}>
                <FaUsers size={20} className="text-blue-500" />
                {notAssignedService}
              </div>
              <p className="text-sm text-gray-500 mt-1">Total customers</p>
            </div>

            
      <div className={cardStyle}>
              <div className={valueStyle}>
                <FaUsers size={20} className="text-blue-500" />
                {PendingServices}
              </div>
              <p className="text-sm text-gray-500 mt-1">Total customers</p>
            </div>
      
     </div>
  )
} 

export default ServiceAnalytics