import React from 'react'
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

const settings = {
  width: 90,
  height: 90,
  value: 60,
};

function TicketProgressChart() {
  return (
    <>
   <div style={{width:'150px'}}>
   <Gauge
   {...settings}
   cornerRadius="50%"
   sx={(theme) => ({
     [`& .${gaugeClasses.valueText}`]: {
       fontSize: 18,
     },
     [`& .${gaugeClasses.valueArc}`]: {
       fill: '#52b202',
     },
     [`& .${gaugeClasses.referenceArc}`]: {
       fill: theme.palette.text.disabled,
     },
   })}
   
    
  />
  </div>
  <div>
  <h3>{settings.value}% </h3>
  <p>Resolved</p>
  </div>
  
  
    </>
  )
}

export default TicketProgressChart
