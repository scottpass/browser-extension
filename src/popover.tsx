import React from 'react'
import ReactDOM from 'react-dom/client'
import NoTools from './notools'

async function Popover() : Promise<JSX.Element> {
    return <NoTools />
}

var p = await Popover();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {p}
    </React.StrictMode>,
)
