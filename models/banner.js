import {Http} from "../utils/http";

class Banner {
    static locationB = 'b-1'
    static locationG = 'b-2'
    static async getHomelocationB() {
        return await Http.request({
            url: `banner/name/${Banner.locationB}`
        })
    }
    static async getHomelocationG() {
        return await Http.request({
            url: `banner/name/${Banner.locationG}`
        })
    }
}

export {
    Banner
}