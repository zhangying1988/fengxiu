import {Matrix} from "./mitrix";
import {Fence} from "./fence";

class FenceGroup {
    spu
    skuList = []
    fences = []

    constructor(spu) {
        this.spu = spu
        this.skuList = spu.sku_list
    }

    getDefaultSku() {
        const defaultSkuId = this.spu.default_sku_id
        if (!defaultSkuId) {
            return
        }
        return this.skuList.find(s => s.id === defaultSkuId)
    }

    getSku(skuCode) {
        const fullSkuCode = this.spu.id + '$' + skuCode
        const sku = this.spu.sku_list.find(s => s.code === fullSkuCode)
        return sku ? sku : null
    }

    setCellStatusById(cellId, status) {
        this.eachCell((cell) => {
            if (cell.id === cellId) {
                cell.status = status
            }
        })
    }

    setCellStatusByXY(x, y, status) {
        this.fences[x].cells[y].status = status
    }

    initFences1() {
        const matrix = this._creatMatrix(this.skuList)
        const fences = []
        //for 循环封装到matrix 方法中
        let currentJ = -1//判断是否开启新列
        matrix.forEach((element, i, j) => {//一共4行3列 12个element
            if (currentJ !== j) {//如果currentJ不等于当前元素的j 此次循环开启了一新列
                //开启一个新列 需要创建一个新的Fence
                currentJ = j
                fences[currentJ] = this._creatFence(element)//新增的fence 新增到数组里面去
                //creatFence
            }
            fences[currentJ].pushValueTitle(element.value)
        })
        console.log('fences', fences)
    }

    initFences() {
        const matrix = this._creatMatrix(this.skuList)
        const fences = []
        const AT = matrix.transpose()
        AT.forEach(r => {
            const fence = new Fence(r)
            fence.init()
            if(this._hasSketchFence() && this._isSketchFence(fence.id)){
                fence.setFenceSketch(this.skuList)
            }
            fences.push(fence)
        })
        this.fences = fences
        console.log(fences)
    }

    _hasSketchFence() {//是否有sketch
        // sketch_spec_id不为空 则spec_id 为1是可视化规格
        return this.spu.sketch_spec_id ? true : false
    }

    _isSketchFence(fenceId) {//specs[0].key_id 决定是否可视化规格
        return this.spu.sketch_spec_id === fenceId?true:false
    }

    eachCell(cb) {
        for (let i = 0; i < this.fences.length; i++) {
            for (let j = 0; j < this.fences[i].cells.length; j++) {
                const cell = this.fences[i].cells[j]
                cb(cell, i, j)
            }
        }
    }

    _creatFence(element) {
        const fence = new Fence()
        // fence.pushValueTitle(element.value)
        return fence
    }

    _creatMatrix(skuList) {//创建矩阵 得到所有sku 二维数组
        const m = []
        skuList.forEach(sku => {
            m.push(sku.specs)
        })
        return new Matrix(m)//不要直接返回二维数组m  返回一个类 当这个类并不只是仅仅有数据的时候还需要操作方法的时候要返回一个类
        // [[1,2,3],[4,5,6],[7,8,9]]
    }
}

export {
    FenceGroup
}