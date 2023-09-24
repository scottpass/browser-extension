import React from 'react'
import './shared.css'

async function onClick() {
    await chrome.tabs.create(
        {
            url: "https://www.scottpass.com/install",
            active: true
        },
    );
}

function NoTools(): JSX.Element {
    return <>
        <div className="short-window">
            <h1><img src="images/WarningBlue48.png" alt="friendly alert icon"/><span>Native tools are not installed</span></h1>
            <p className="dialog-text"><i>Scottpass uses your computer's native hardware to protect your data with the highest
                level of security. This requires native tools to be installed.</i></p>
            <div className="centered-button-container"><button onClick={onClick}>Install</button></div>
        </div>
    </>
}

export default NoTools;