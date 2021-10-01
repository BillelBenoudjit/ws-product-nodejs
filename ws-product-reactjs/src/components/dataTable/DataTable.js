import React, { useState } from 'react'
import { Table, Pagination, Container } from 'react-bootstrap';
import moment from 'moment'

const DataTable = ({ hourlyStats, hourlyEvents }) => {
    const [currentStatPage, setCurrentStatPage] = useState(1)
    const [currentEventPage, setCurrentEventPage] = useState(1)
    const [statPageSize, setStatPageSize] = useState(5)
    const [eventPageSize, setEventPageSize] = useState(5)

    return (
        <>
            <h2 style={{ textAlign: 'left' }}>Hourly Stats</h2>
            <Pagination>
                <Pagination.First onClick={() => setCurrentStatPage(1)} />
                <Pagination.Prev onClick={() => currentStatPage > 1 ?
                    setCurrentStatPage(currentStatPage - 1) :
                    setCurrentStatPage(1)} />
                <Pagination.Item onClick={() => setCurrentStatPage(1)}>{1}</Pagination.Item>
                <Pagination.Ellipsis />
                <Pagination.Item onClick={() => setCurrentStatPage(Math.floor(hourlyStats?.length / statPageSize))}>
                    {Math.floor(hourlyStats?.length / statPageSize)}
                </Pagination.Item>
                <Pagination.Next onClick={() => currentStatPage < Math.floor(hourlyStats?.length / statPageSize) ?
                    setCurrentStatPage(currentStatPage + 1) :
                    setCurrentStatPage(Math.floor(hourlyStats?.length / statPageSize))} />
                <Pagination.Last onClick={() => setCurrentStatPage(Math.floor(hourlyStats?.length / statPageSize))} />
            </Pagination>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Clicks</th>
                        <th>Hour</th>
                        <th>Impression</th>
                        <th>Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        hourlyStats?.slice(currentStatPage * statPageSize, (currentStatPage + 1) * statPageSize)?.map((stat, index) => {
                            return (
                                <tr key={index}>
                                    <td className="text-left">{moment(stat.date).utc().format('MM/DD/YYYY')}</td>
                                    <td className="text-left">{stat.clicks}</td>
                                    <td className="text-left">{stat.hour}</td>
                                    <td className="text-left">{stat.impressions}</td>
                                    <td className="text-left">{stat.revenue}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>

            <hr></hr>

            <h2 style={{ textAlign: 'left' }}>Hourly Events</h2>
            <Pagination>
                <Pagination.First onClick={() => setCurrentEventPage(1)} />
                <Pagination.Prev onClick={() => currentEventPage > 1 ?
                    setCurrentEventPage(currentEventPage - 1) :
                    setCurrentEventPage(1)} />
                <Pagination.Item onClick={() => setCurrentEventPage(1)}>{1}</Pagination.Item>
                <Pagination.Ellipsis />
                <Pagination.Item onClick={() => setCurrentEventPage(Math.floor(hourlyEvents?.length / eventPageSize))}>
                    {Math.floor(hourlyEvents?.length / eventPageSize)}
                </Pagination.Item>
                <Pagination.Next onClick={() => currentEventPage < Math.floor(hourlyEvents?.length / eventPageSize) ?
                    setCurrentEventPage(currentEventPage + 1) :
                    setCurrentEventPage(Math.floor(hourlyEvents?.length / eventPageSize))} />
                <Pagination.Last onClick={() => setCurrentEventPage(Math.floor(hourlyEvents?.length / eventPageSize))} />
            </Pagination>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Hour</th>
                        <th>Events</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        hourlyEvents?.slice(currentEventPage * eventPageSize, (currentEventPage + 1) * eventPageSize)?.map((stat, index) => {
                            return (
                                <tr key={index}>
                                    <td className="text-left">{moment(stat.date).utc().format('MM/DD/YYYY')}</td>
                                    <td className="text-left">{stat.hour}</td>
                                    <td className="text-left">{stat.events}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        </>
    )
}

export default DataTable
