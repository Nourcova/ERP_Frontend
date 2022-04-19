import React, { useEffect } from 'react'
import './loading.css'

function Loading() {


    return (
        <div className='loading'>
            <div id="loader">
                <div id="shadow"></div>
                <div id="box"></div>
            </div>
        </div>
    )
}

export default Loading