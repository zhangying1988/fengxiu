const getSystemSize = function () {//定义成一个函数
    const res = wx.getSystemInfo({ //小程序提供内置api获取高度 getSystemInfo()是异步 里面需要接收回调函数接收信息
        success(res){
            console.log(res)
        }
    })
}
export {
    getSystemSize
}
