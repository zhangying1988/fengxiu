import {promisic} from "./util";
import {px2rpx} from "../miniprogram_npm/lin-ui/utils/util";

const getSystemSize = async function () {//定义成一个函数
    const res = await promisic(wx.getSystemInfo)()
    return {
        windowHeight: res.windowHeight,
        windowWidth: res.windowWidth,
        screenWidth: res.screenWidth,
        screenHeight: res.screenHeight
    }
    // const res = await wx.getSystemInfo({ //小程序提供内置api获取高度 getSystemInfo()是异步 里面需要接收回调函数接收信息
    //     success(res) {
    //         console.log(res)
    //     }
    // })
}
const getWindowHeightRpx = async function () {
    const res = await getSystemSize()
    return  px2rpx(res.windowHeight)
}
export {
    getSystemSize,
    getWindowHeightRpx
}
