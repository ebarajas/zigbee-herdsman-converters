/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
import type {
    Device as ZHDevice,
    Endpoint as ZHEndpoint,
    Group as ZHGroup,
} from 'zigbee-herdsman/dist/controller/model';

import * as exposes from './exposes';

export interface Logger {
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
    debug: (message: string) => void;
}

export type Range = [number, number];
export interface KeyValue {[s: string]: unknown}
export interface KeyValueString {[s: string]: string}
export interface KeyValueNumberString {[s: string]: string}
// eslint-disable-next-line
export interface KeyValueAny {[s: string]: any}
export type Publish = (payload: KeyValue) => void;
export type OnEventType = 'start' | 'stop' | 'message' | 'deviceJoined' | 'deviceInterview' | 'deviceAnnounce' |
    'deviceNetworkAddressChanged' | 'deviceOptionsChanged';
export type Access = 0b001 | 0b010 | 0b100 | 0b011 | 0b101 | 0b111;
export type Expose = exposes.Numeric | exposes.Binary | exposes.Enum | exposes.Composite | exposes.List | exposes.Light | exposes.Switch |
    exposes.Lock | exposes.Cover | exposes.Climate | exposes.Text;
export type Option = exposes.Numeric | exposes.Binary | exposes.Composite | exposes.Enum;
export interface Fingerprint {
    modelID?: string, manufacturerName?: string, type?: 'EndDevice' | 'Router', manufacturerID?: number, applicationVersion?: number,
    powerSource?: 'Battery' | 'Mains (single phase)', softwareBuildID?: string, ieeeAddr?: RegExp,
    endpoints?: {ID?: number, profileID?: number, deviceID?: number, inputClusters?: number[], outputClusters?: number[]}[],
}
export type WhiteLabel =
    {vendor: string, model: string, description: string, fingerprint: Fingerprint[]} |
    {vendor: string, model: string, description?: string};
export interface OtaUpdateAvailableResult {available: boolean, currentFileVersion: number, otaFileVersion: number}

export interface DefinitionMeta {
    separateWhite?: boolean,
    multiEndpoint?: boolean,
    publishDuplicateTransaction?: boolean,
    tuyaDatapoints?: Tuya.MetaTuyaDataPoints,
    disableDefaultResponse?: boolean,
    pinCodeCount?: number,
    coverInverted?: boolean,
    timeout?: number,
    multiEndpointSkip?: string[],
    tuyaSendCommand?: 'sendData' | 'dataRequest',
    coverStateFromTilt?: boolean,
    thermostat?: {
        weeklyScheduleMaxTransitions?: number,
        weeklyScheduleSupportedModes?: number[],
        weeklyScheduleFirstDayDpId?: number,
        dontMapPIHeatingDemand?: boolean
    },
    battery?: {voltageToPercentage?: string | {min: number, max: number}, dontDividePercentage?: boolean},
    applyRedFix?: boolean,
    turnsOffAtBrightness1?: boolean;
    tuyaThermostatPreset?: {[s: number]: string},
    tuyaThermostatSystemMode?: {[s: number]: string},
    tuyaThermostatPresetToSystemMode?: {[s: number]: string},
    supportsEnhancedHue?: boolean,
    disableActionGroup?: boolean,
    supportsHueAndSaturation?: boolean,
}

export type Configure = (device: Zh.Device, coordinatorEndpoint: Zh.Endpoint, logger: Logger) => Promise<void>;
export type OnEvent = (type: OnEventType, data: OnEventData, device: Zh.Device, settings: KeyValue, state: KeyValue) => Promise<void>;
export interface Extend {fromZigbee: Fz.Converter[], toZigbee: Tz.Converter[], exposes: Expose[], configure?: Configure, meta?: DefinitionMeta}

export interface OnEventData {
    endpoint?: Zh.Endpoint,
    meta?: {zclTransactionSequenceNumber?: number},
    cluster?: string,
    type?: string,
}

export type Definition = {
    model: string;
    vendor: string;
    description: string;
    whiteLabel?: WhiteLabel[];
    endpoint?: (device: Zh.Device) => {[s: string]: number},
    configure?: Configure,
    options?: Option[],
    meta?: DefinitionMeta,
    onEvent?: OnEvent,
    ota?: {
        isUpdateAvailable: (device: Zh.Device, logger: Logger, data?: KeyValue)
            => Promise<OtaUpdateAvailableResult>;
        updateToLatest: (device: Zh.Device, logger: Logger,
            onProgress: (progress: number, remaining: number) => void) => Promise<number>;
    }
} & ({ zigbeeModel: string[] } | { fingerprint: Fingerprint[] })
    & ({ extend: Extend } |
    { fromZigbee: Fz.Converter[], toZigbee: Tz.Converter[], exposes: (Expose[] | ((device: Zh.Device, options: KeyValue) => Expose[])) });

export namespace Fz {
    export interface Message {
        // eslint-disable-next-line
        data: any, 
        endpoint: Zh.Endpoint, device: Zh.Device, meta: {zclTransactionSequenceNumber: number}, groupID: number, type: string, cluster: string}
    export interface Meta {state: KeyValue, logger: Logger, device: Zh.Device}
    export interface Converter {
        cluster: string | number,
        type: string[] | string,
        options?: Option[] | ((definition: Definition) => Option[]);
        convert: (model: Definition, msg: Message, publish: Publish, options: KeyValue, meta: Fz.Meta) => KeyValueAny | void | Promise<void>;
    }
}

export namespace Tz {
    export interface Meta {
        logger: Logger,
        message: KeyValue,
        device: Zh.Device,
        mapped: Definition,
        options: KeyValue,
        state: KeyValue,
        endpoint_name: string,
    }
    export interface Converter {
        key: string[],
        options?: Option[] | ((definition: Definition) => Option[]);
        convertSet?: (entity: Zh.Endpoint | Zh.Group, key: string, value: unknown, meta: Tz.Meta) =>
            Promise<{state?: KeyValue, readAfterWriteTime?: number} | void>,
        convertGet?: (entity: Zh.Endpoint | Zh.Group, key: string, meta: Tz.Meta) => Promise<void>,
    }
}

export namespace Zh {
    export type Endpoint = ZHEndpoint;
    export type Device = ZHDevice;
    export type Group = ZHGroup;
}

export namespace Tuya {
    export interface DpValue {dp: number, datatype: number, data: Buffer | number[]}
    export interface ValueConverterSingle {
        to?: (value: unknown, meta?: Tz.Meta) => unknown,
        from?: (value: unknown, meta?: Fz.Meta, options?: KeyValue, publish?: Publish) => number|string|boolean|KeyValue,
    }
    export interface ValueConverterMulti {
        to?: (value: unknown, meta?: Tz.Meta) => unknown,
        from?: (value: unknown, meta?: Fz.Meta, options?: KeyValue, publish?: Publish) => KeyValue,
    }
    export interface MetaTuyaDataPointsMeta {skip: (meta: Tz.Meta) => boolean, optimistic?: boolean}
    export type MetaTuyaDataPointsSingle = [number, string, Tuya.ValueConverterSingle, MetaTuyaDataPointsMeta?];
    export type MetaTuyaDataPoints = MetaTuyaDataPointsSingle[];
}

export namespace Extend {
    export interface options_switch {
        disablePowerOnBehavior?: boolean, toZigbee?: Tz.Converter[], fromZigbee?: Fz.Converter[], exposes?: Expose[]
    }
    export interface options_light_onoff_brightness {
        disablePowerOnBehavior?: boolean, toZigbee?: Tz.Converter[], fromZigbee?: Fz.Converter[], exposes?: Expose[], disableEffect?: boolean,
        disableMoveStep?: boolean, disableTransition?: boolean, noConfigure?: boolean
    }
    export interface options_light_onoff_brightness_colortemp {
        disablePowerOnBehavior?: boolean, toZigbee?: Tz.Converter[], fromZigbee?: Fz.Converter[], exposes?: Expose[], disableEffect?: boolean,
        disableMoveStep?: boolean, disableTransition?: boolean, noConfigure?: boolean, disableColorTempStartup?: boolean, colorTempRange?: Range,
    }
    export interface options_light_onoff_brightness_color {
        disablePowerOnBehavior?: boolean, toZigbee?: Tz.Converter[], fromZigbee?: Fz.Converter[], exposes?: Expose[], disableEffect?: boolean,
        disableMoveStep?: boolean, disableTransition?: boolean, noConfigure?: boolean, disableColorTempStartup?: boolean, colorTempRange?: Range,
        preferHueAndSaturation?: boolean, supportsHueAndSaturation?: boolean,
    }
    export interface options_light_onoff_brightness_colortemp_color {
        disablePowerOnBehavior?: boolean, toZigbee?: Tz.Converter[], fromZigbee?: Fz.Converter[], exposes?: Expose[], disableEffect?: boolean,
        disableMoveStep?: boolean, disableTransition?: boolean, noConfigure?: boolean, disableColorTempStartup?: boolean, colorTempRange?: Range,
        preferHueAndSaturation?: boolean, supportsHueAndSaturation?: boolean,
    }
}
