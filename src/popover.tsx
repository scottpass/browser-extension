import './popover.css'
import React from 'react'
import ReactDOM from 'react-dom/client'

function Popover() : JSX.Element {
  return (
    <>
        <div className="App">
            Hello World
        </div>
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Popover />
    </React.StrictMode>,
)
