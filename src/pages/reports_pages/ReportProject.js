import React, {useState, useEffect} from 'react'
import { useParams } from "react-router-dom";
import axios from 'axios';
import AOS from "aos";
import './report.css'

function ReportProject() {

  const { id } = useParams();
  const [dataReport, setDataReport] = useState([])

  const getReportProject = async () => {
    let res = await axios.get(`https://sleepy-wave-82877.herokuapp.com/api/employees/reportProject/${id}`)
    try {
      setDataReport(res.data.data.projec_report)
      console.log(res.data.data.projec_report)
    }catch(err){
      console.log(err)
    }
  }


  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    AOS.init();
    AOS.refresh();
    getReportProject()
  }, []);

  return (
    <div className='reportData' >
        <div className='body'>
          <div className='scroll'>

          {dataReport.map((data, i) => {
            return (
              <div className='details' key={i} data-aos-duration="1500" data-aos="fade-up">
                <div className='detail'>
                  <h6>{'Project'}</h6>
                  <h5>{data.name}</h5>
                </div>
                <div className='detail'>
                  <h6>{'Role'}</h6>
                  <h5>{data.role[0]?.rolename}</h5>
                </div>
              </div>
            )
          })}

          </div>
        </div>
    </div>
  )
}

export default ReportProject