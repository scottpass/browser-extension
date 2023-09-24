import React from 'react'
import './shared.css'
import PuffLoader from "../node_modules/react-spinners/PuffLoader";

function Spinner() : JSX.Element {
    return <div className="short-window">
        <div className="spinner-container">
            <PuffLoader size={128} color={"#6a96e1"} />
        </div>
    </div>
}

export default Spinner;