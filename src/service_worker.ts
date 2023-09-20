import {ScottPass} from "./scottpass";

const sp = new ScottPass();
const pingResponse = await sp.ping();
console.log("Got ping response server_version = " + pingResponse.ServerVersion);