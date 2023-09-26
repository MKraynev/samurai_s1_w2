import { TokenHandler, tokenHandler } from "../../../Common/Authentication/User/TokenAuthentication";
import { AvailableDbTables, ExecutionResult, ExecutionResultContainer } from "../../../Common/Database/DataBase";
import { MongoDb, mongoDb } from "../../../Common/Database/MongoDb";
import { ServiseExecutionStatus } from "../../Blogs/BuisnessLogic/BlogService";
import { UserServiceExecutionResult, userService } from "../../Users/Common/BuisnessLogic/UserService";
import { Token } from "../../Users/Common/Entities/Token";
import { DeviceResponse } from "../Entities/DeviceForDataBase";


class DeviceService {
    private userTable = AvailableDbTables.users;

    constructor(private db: MongoDb, private tokenHandler: TokenHandler) { }

    public async GetUserDevices(token: Token): Promise<ExecutionResultContainer<ServiseExecutionStatus, DeviceResponse[]>> {
        let getUser = await userService.GetUserByToken(token);

        if (getUser.executionStatus !== UserServiceExecutionResult.Success || !getUser.executionResultObject) {
            return new ExecutionResultContainer(ServiseExecutionStatus.Unauthorized);
        }

        let devices = getUser.executionResultObject.devices;
        devices.map(device => {
            let obj = {
                ip: device.ip,
                title: device.title,
                lastActiveDate: device.lastActiveDate,
                deviceId: device.deviceId
            }

            return obj;
        })

        return new ExecutionResultContainer(ServiseExecutionStatus.Success, devices);
    }
    public async DeleteDevices(token: Token, deviceId?: number): Promise<ExecutionResultContainer<ServiseExecutionStatus, DeviceResponse[]>> {
        let getUser = await userService.GetUserByToken(token);

        if (getUser.executionStatus !== UserServiceExecutionResult.Success || !getUser.executionResultObject) {
            return new ExecutionResultContainer(ServiseExecutionStatus.Unauthorized);
        }

        let user = getUser.executionResultObject;

        let getTokenData = await this.tokenHandler.GetTokenLoad(token);
        let tokenData = getTokenData.propertyVal;


        
        // if (deviceId === -1) {
        //     let deviceInfo = user.devices.find(device => device.deviceId === tokenData?.deviceId);
        //     if (!deviceInfo) {
        //         return new ExecutionResultContainer(ServiseExecutionStatus.NotFound);
        //     }

        //     user.devices = [];
        //     user.devices.push(deviceInfo!);
        // }
        // else {
        //     let delPos = user.devices.findIndex(device => device.deviceId === deviceId);
        //     if (delPos > -1) {
        //         user.devices.splice(delPos, 1);
        //     }
        //     else {
        //         return new ExecutionResultContainer(ServiseExecutionStatus.NotFound);
        //     }
        // }

        let updateDeviceData = await this.db.UpdateOneProperty(this.userTable, user.id, "devices", user.devices);
        if (updateDeviceData.executionStatus !== ExecutionResult.Pass) {
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);
        }

        return new ExecutionResultContainer(ServiseExecutionStatus.Success, user.devices);


    }

}

export const deviceService = new DeviceService(mongoDb, tokenHandler);