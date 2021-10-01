import axios from "axios";
import { useEffect, useState } from 'react'

import Chart from "./components/charts/Chart"
import DataTable from "./components/dataTable/DataTable"
import GeoVisualization from "./components/geoVisualization/GeoVisualization"

import { getHourlyStats, getDailyStats, getHourlyEvents, getDailyEvents, getPoi } from "./services/services"

import './App.css';

function App() {
  const [hourlyEvents, setHourlyEvents] = useState({})
  const [dailyEvents, setDailyEvents] = useState({})
  const [hourlyStats, setHourlyStats] = useState([])
  const [dailyStats, setDailyStats] = useState({})
  const [stats, setStats] = useState({})
  const [poi, setPoi] = useState({})

  const servicesApi = async () => {
    try {
      await getHourlyStats().then(({ data }) => {
        setHourlyStats(data)
      })

      await getDailyStats().then(({ data }) => {
        setDailyStats(data)
      })

      await getHourlyEvents().then(({ data }) => {
        setHourlyEvents(data)
      })

      await getDailyEvents().then(({ data }) => {
        setDailyEvents(data)
      })

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    servicesApi()
  }, [])

  return (
    < div className="App" >
      <h1>
        Hello
      </h1>
    </div >
  );
}

export default App;
