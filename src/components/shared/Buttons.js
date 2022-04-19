import React, {useEffect} from 'react'
import './Buttons.css'
import AOS from "aos";



const Buttons = ({
    aos,
    onClick,
    type,
    buttonStyle = "btn--primary--solid",
    buttonSize = "btn-md",
    text,
    icon,
}) => {
    useEffect(() => {
        AOS.init();
        AOS.refresh();
      }, [])
    return (
        <button
            data-aos-duration="1500" 
            data-aos={aos}
            className={`btn ${buttonStyle} ${buttonSize} `}
            onClick={onClick}
            type={type}
        >
            {icon}
            {text}
        </button>
    )
}

export default Buttons