import axios from "axios";
import { useEffect, useState } from 'react'

import Chart from "./components/charts/Chart"
import DataTable from "./components/charts/DataTable"
import GeoVisualization from "./components/geoVisualization/GeoVisualization"

import './App.css';

function App() {
  const [hourlyEvents, setHourlyEvents] = useState({})
  const [dailyEvents, setDailyEvents] = useState({})
  const [hourlyStats, setHourlyStats] = useState({})
  const [dailyStats, setDailyStats] = useState({})
  const [stats, setStats] = useState({})
  const [poi, setPoi] = useState({})

  return (
    < div className="App" >
      <h1>
        Hello
      </h1>
    </div >
  );
}

export default App;
