import boolean from "../miniprogram_npm/lin-ui/common/async-validator/validator/boolean";
import {Http} from "./http";

class Paging {
    //不关心细节
    // 实例化 new Paging
    start
    count
    req
    locker = false
    url
    moreData = true
    accumulator = []

    constructor(req, count = 10, start = 0) {
        this.start = start
        this.count = count
        this.req = req
        this.url = req.url
    }

    async getMoreData() { // 公开方法供外部调用
        if (!this.moreData) {
            return
        }
        // request 防止重复发请求 锁loading getLocker releaseLocker
        if (!this._getLocker()) {//如果不能获取到锁 返回
            return
        }
        const data = await this._actualGetData()
        this._releaseLocer()
        return data
    }

    async _actualGetData() {
        const req = this._getCurrentReq()
        let paging = await Http.request(req)
        if (!paging) {//paging请求失败对象不存在返回
            return null
        }
        if (paging.total === 0) {//如果paging对象一条数据都没有
            return {
                empty: true,
                items: [],
                moreData: false,
                accumulator: []
            }
        }
        this.moreData = Paging._moreData(paging.total_page, paging.page)
        if (this.moreData) {//判断如果还有下一页 数量累加
            this.start += this.count
        }
        this._accumulate(paging.items)
        return {
            empty: false,
            items: paging.items,
            moreData: this.moreData,
            accumulator: this.accumulator
        }
        // return {
        //     empty:boolean,//一条数据都没有
        //     items:[],//当前请求回来的数据
        //     moreData:boolean,//是不是最后一个 是true不是最后一页 false是最后一页
        //     accumulator:[]//累加器 历史请求数据累加
        // }
    }

    _accumulate(items) {
        this.accumulator = this.accumulator.concat(items)
    }

    static _moreData(totalPage, pageNum) {//当前页面小于总页数 返回true
        return pageNum < totalPage - 1
    }

    _getCurrentReq() {
        // let url=this.req.url//参数会出现重复拼接
        let url = this.url
        const params = `start=${this.start}&count=${this.count}`
        //url=v1/spu/latest+'?'+params
        //url=v1/sup/latest?other=abc+'&'+params
        if (url.includes('?')) {//问号不存在返回值为-1 如果不等于-1 说明？是存在的
            url += '&' + params
        } else {
            url += '?' + params
        }
        this.req.url = url
        return this.req
        //值类型 引用类型
    }

    _getLocker() {
        if (this.locker) {
            return false
        }
        this.locker = true //锁住
        return true//返回true getLocker已经获取到一个锁
    }

    _releaseLocer() {
        this.locker = false
    }
}

export {
    Paging
}