import axios from "axios";
import { useEffect, useState } from 'react'

import Charts from "./components/charts/Chart"
import DataTable from "./components/dataTable/DataTable"
import GeoVisualization from "./components/geoVisualization/GeoVisualization"

import { getHourlyStats, getDailyStats, getHourlyEvents, getDailyEvents, getPoi } from "./services/services"

import './App.css';
import { Container } from "react-bootstrap";

function App() {
  const [hourlyEvents, setHourlyEvents] = useState([])
  const [dailyEvents, setDailyEvents] = useState([])
  const [hourlyStats, setHourlyStats] = useState([])
  const [dailyStats, setDailyStats] = useState([])
  const [stats, setStats] = useState([])
  const [poi, setPoi] = useState([])

  const servicesApi = async () => {
    try {
      getHourlyStats().then(({ data }) => {
        setHourlyStats(data)
      })

      getDailyStats().then(({ data }) => {
        setDailyStats(data)
      })

      getHourlyEvents().then(({ data }) => {
        setHourlyEvents(data)
      })

      getDailyEvents().then(({ data }) => {
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
      <Container>
        <h1>
          EQ Works Internship
      </h1>
        <div>
          <h1 style={{ textAlign: 'left' }}>Data Tables</h1>
          <DataTable hourlyStats={hourlyStats} hourlyEvents={hourlyEvents} />
        </div>
      </Container>
    </div >
  );
}

export default App;
