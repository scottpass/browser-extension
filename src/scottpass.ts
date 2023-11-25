export type MessageKind = "Request" | "Response";

export type RequestMessage = PingRequestMessage | CreateAccountRequestMessage
type ResponseMessage = PingResponseMessage | ErrorResponseMessage | EventMessage | CreateAccountResponseMessage;
type RequestBodyType = "PingRequest" | "CreateAccountRequest"
type ClientType = "Chrome";
type CryptoProvider = "AppleEnclave" | "YubiKey" | "Unprotected";

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

type CreateAccountRequestMessage = {
    Kind: "Request";
    RequestID: string;
    BodyType: "CreateAccountRequest";
    Body: CreateAccountRequest;
};

type CreateAccountRequest = {
    Email : string;
    ClientType: ClientType
    CryptoProvider: CryptoProvider;
    DeviceName: string;
}

type CreateAccountResponseMessage = {
    Kind: "Response";
    RequestID: string;
    BodyType: "CreateAccountResponse";
    Body: CreateAccountResponse;
};

type CreateAccountResponse = {
    AccountID: string;
    Email: string;
    Created: string;
    DeviceName: string;
}

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
        this.connected = true;
    }

    public close() {
        this.port.disconnect();
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

    public createAccount(request: CreateAccountRequest): Promise<CreateAccountResponse> {
        return this.sendRequest<CreateAccountResponse>("CreateAccountRequest", request)
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