import * as scottpass from "./scottpass";

var sp  = new scottpass.ScottPass();
ensureConnected();

async function wait(ms: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => resolve(), ms);
    });
}

async function ensureConnected(): Promise<void> {
    while (true) {
        await wait(500);
        if (sp?.isConnected) {
            console.log("verified native message host connection");
            return;
        }
        sp = new scottpass.ScottPass();
    }
}

async function processMessage(message: any): Promise<any> {
    switch (message.Type) {
    case "IsConnected":
        return sp != null && sp.isConnected;
    case "CreateAccount":
        return await sp.createAccount(message.Body);
    default:
        throw new Error("Unknown message type: " + message.Type);
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    processMessage(message).then(sendResponse);
    return true;
});