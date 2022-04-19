/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import Chart from "react-apexcharts";
import { useParams } from "react-router-dom";
import axios from 'axios'
import Loading from '../../components/shared/Loading'
import AOS from "aos";


function ReportGraph() {

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const getData = (async () => {
    axios.get(`https://sleepy-wave-82877.herokuapp.com/api/employees/groupKpi/${id}`)
      .then(res => {
        setData(res.data.data.group_kpi)
      })
      .finally(() => {
        setLoading(false)
      })
      .catch(err => console.log(err))
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    AOS.init();
    AOS.refresh();
    await getData()
  }, []);

  return (
    <>
      <div className='reportGraph' >
        {loading ?
          <Loading />
          :
          <div className='reportGraph-body'>
            {data.map((e, i) => {

              let options = {
                colors: ["#caab36c9", "#FF9800"],
                chart: {
                  height: 350,
                  type: 'bar',
                },
                plotOptions: {
                  bar: {
                    borderRadius: 10,
                    padding: '10px',
                    dataLabels: {
                      position: 'top', // top, center, bottom
                    },
                  }
                },
                dataLabels: {
                  enabled: true,
                  offsetY: -20,
                  style: {
                    fontSize: '12px',
                    colors: ["var(--textcolor1)"]
                  }
                },
                xaxis: {
                  categories: [

                  ]
                },
              }

              let series = [{ name: "People Born", data: [], }]
              e.kpi.map(d => {
                options.xaxis.categories.unshift(d.created_at.substring(0, 7))
                series[0].data.unshift(d.rate)
              })

              return (
                <div key={i}>
                  <h4 style={{ color: 'var(--textcolor1)' }}>{e.name}</h4>

                  <Chart
                    options={options}
                    series={series}
                    type="histogram"
                    width="400"
                  />
                </div>
              )
            })}
          </div>
        }
      </div>
    </>
  )
}

export default ReportGraph