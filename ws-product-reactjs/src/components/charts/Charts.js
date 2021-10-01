import React from 'react'
import EventChart from './EventChart'
import StatChart from './StatChart'

const Charts = ({ dailyEvents, dailyStats }) => {
    return (
        <div>
            <EventChart dailyEvents={dailyEvents} />
            <StatChart dailyStats={dailyStats} />
        </div>
    )
}

export default Charts
