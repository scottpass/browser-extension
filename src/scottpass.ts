export type MessageKind = "Request" | "Response";

export type RequestMessage = PingRequestMessage | GetConfigRequestMessage;
type ResponseMessage = PingResponseMessage | ErrorResponseMessage | GetConfigResponseMessage | EventMessage;
type RequestBodyType = "PingRequest" | "GetConfigRequest";

type EventMessage = {
    Kind: "Event";
    RequestID: string;
    BodyType: string;
    Body: any;
}

type PingRequestMessage = {
    Kind: "Request";
    RequestID: string;
    BodyType: "PingRequest";
    Body: Record<never, never>;
};

export type PingResponse = {
    "ServerVersion": string;
}

type PingResponseMessage = {
    Kind: "Response";
    RequestID: string;
    BodyType: "PingResponse";
    Body: PingResponse
};

type ErrorResponseMessage = {
    Kind: "Response";
    RequestID: string;
    BodyType: "ErrorResponse";
    Body: ErrorResponse
};

export type ErrorResponse = {
    "ResponseCode": number;
    "ErrorType": string;
    "Message": string;
}

type GetConfigRequestMessage = {
    Kind: "Request";
    RequestID: string;
    BodyType: "GetConfigRequest";
    Body: Record<never, never>;
};

type GetConfigResponseMessage = {
    Kind: "Response";
    RequestID: string;
    BodyType: "GetConfigResponse";
    Body: GetConfigResponse;
}

export type GetConfigResponse = {
    "WorkingDirectory": string;
    "BaseURL": string;
    "CAFile": string;
}

type PromisePair = {
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
}

export class ScottPass {
    private readonly pendingRequests: Map<string, PromisePair>;
    private readonly port: chrome.runtime.Port;
    public readonly onEvent: EventTarget;
    private connected: boolean;

    constructor() {
        this.pendingRequests = new Map<string, PromisePair>();
        this.port = chrome.runtime.connectNative("com.scottpass.nm_host_client");
        this.port.onDisconnect.addListener(this.onDisconnect.bind(this));
        this.port.onMessage.addListener(this.onMessage.bind(this));
        this.onEvent = new EventTarget();
    }

    private onDisconnect() {
        this.connected = false;
        this.pendingRequests.forEach((value) => {
            value.reject(new Error("Native messaging host disconnected"));
        });
        this.pendingRequests.clear();
    }

    public get isConnected(): boolean {
        return this.connected;
    }

    private onMessage(message: ResponseMessage) {
        const req = this.pendingRequests.get(message.RequestID)
        this.pendingRequests.delete(message.RequestID)
        if (!req) {
            if (message.Kind == "Event") {
                this.onEvent.dispatchEvent(new CustomEvent(message.BodyType, { detail: message.Body }))
                return
            }
            console.error("Received response for unknown request ID: " + message.RequestID);
            return
        }
        if (message.BodyType == "ErrorResponse") {
            req.reject(message.Body)
            return
        }
        req.resolve(message.Body)
    }

    public ping(): Promise<PingResponse> {
        return this.sendRequest<PingResponse>("PingRequest", {})
    }

    public getConfiguration(): Promise<GetConfigResponse> {
        return this.sendRequest<GetConfigResponse>("GetConfigRequest", {})
    }

    private sendRequest<T>(requestType: RequestBodyType, requestBody: any) : Promise<T> {
        const msg : RequestMessage = {
            Kind: "Request",
            RequestID: crypto.randomUUID(),
            BodyType: requestType,
            Body: requestBody
        }

        const promise = new Promise<T>((resolve, reject) => {
            this.pendingRequests.set(msg.RequestID, { resolve, reject });
        });

        try {
            this.port.postMessage(msg)
        } catch (e) {
            this.pendingRequests.get(msg.RequestID)?.reject(e)
            this.pendingRequests.delete(msg.RequestID)
        }

        return promise;
    }
}