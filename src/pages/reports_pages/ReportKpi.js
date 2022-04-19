import React, {useState, useEffect} from 'react'
import { useParams } from "react-router-dom";
import axios from 'axios';
import AOS from "aos";
import './report.css'

function ReportKpi() {

  const { id } = useParams();
  const [dataReport, setDataReport] = useState([])

  const getKpiReports = async () => {
    let res = await axios.get(`https://sleepy-wave-82877.herokuapp.com/api/employees/validKPIS/${id}`)
    try {
      setDataReport(res.data.data.valid_kpi)
    }catch(err){
      console.log(err)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
      AOS.init();
      AOS.refresh();
      getKpiReports()
  }, []);

  return (
    <div className='reportData' >
        <div className='body'>
          <div className='scroll'>

          {dataReport.map((data, i) => {
            return (
              <div className='details' key={i} data-aos-duration="1500" data-aos="fade-up">
                <div className='detail'>
                  <h6>{'Kpi'}</h6>
                  <h5>{data.name}</h5>
                </div>
                <div className='detail'>
                  <h6>{'Rate'}</h6>
                  <h5>{data.latest_kpi.rate}</h5>
                </div>
              </div>
            )
          })}
          </div>
        </div>
    </div>
  )
}

export default ReportKpi