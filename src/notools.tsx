import React from 'react'
import './shared.css'
import Grid from '@mui/joy/Grid';
import Button from '@mui/joy/Button';

async function onClick() {
    /*await chrome.tabs.create(
        {
            url: "https://www.scottpass.com/install",
            active: true
        },
    );*/
    try {
        const x = await chrome.runtime.sendMessage({
            Type: "CreateAccount",
            Body: {
                Email: "scott@scottdw2.com",
                ClientType: "Chrome",
                CryptoProvider: "AppleEnclave",
                DeviceName: "Space"
            }
        });
        alert(JSON.stringify(x));
    } catch (e) {
        alert(e);
    }

}

function NoTools(): JSX.Element {
    return <>
        <div className="tiny-window">
            <Grid container rowSpacing={0.5} columnSpacing={1}>
                <Grid xs={2}>
                    <div className={"alertIcon"}>􀇿</div>
                </Grid>
                <Grid xs={10}>
                    <div className={"alertTextContainer"}>
                        <div className={"alertText"}>Native Tools Not Installed</div>
                    </div>
                </Grid>
                <Grid xs={12}>
                    <div className={"dialogText"}><i>Scottpass uses your computer's native encryption hardware to protect
                        data with the highest level of security. This requires native tools to be installed.</i></div>
                </Grid>
                <Grid xs={12}>
                    <div className={"buttonContainer"}>
                        <Button onClick={onClick}>Install</Button>
                    </div>
                </Grid>
            </Grid>
        </div>
    </>
}

export default NoTools;