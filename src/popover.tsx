import React from 'react'
import ReactDOM from 'react-dom/client'
import NoTools  from "./notools";


//what do I want to do?
//1. Check to see if the native tools are installed.
//2. If they are, load the default account, and show the account view.
//3. If there is no account, show the "add account" view.
//3. If they are no tools, show the "no tools" view. Kick off a timer to check every second if the tools have been installed. On install goto step 2.

async function Popover() : Promise<JSX.Element> {

    return <NoTools/>
}

Popover().then((p) => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            {p}
        </React.StrictMode>,
    )
});
