import { DeviceRequest } from "./DeviceForRequest";

export class DeviceResponse extends DeviceRequest {
    constructor(
        deviceData: DeviceRequest,
        public lastActiveDate: string,
        public deviceId: number,
        public expireTime: string) {
        super(deviceData.ip, deviceData.title);

    }
}