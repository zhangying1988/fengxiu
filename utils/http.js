import {promisic} from "./util";
import {config} from "../config/config";

class Http {
    static async request({url, data, method = "GET"}) {
        const res = await promisic(wx.request)({
            url: `${config.apiBaseUrl}${url}`,
            method,
            header: {
                appkey: `${config.appkey}`
            },
            data
        })
        return res.data
    }
}

export {Http}