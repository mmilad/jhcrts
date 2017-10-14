
export interface elemConfig {
    [propName: string]: any;
    tag?: string;
    attributes?: any;
    properties?: any;
    children?: Array<elemConfig>;
    callbacks?: Array<{ event: string, callback: Function }>;
    bind?: Array<{ properties: string, attribute:string, callback: Function }>;
    type?: string;
    types?: Array<string>;
    value?: string;
    html?: string;
    class?: string;
}

export interface elemTypeConfig {
    [propName: string]: elemConfig;
}

export interface elemRegisterConfig {
    [propName: string]: any;
    onSet: Function;
    onRemove?: Function;
}
