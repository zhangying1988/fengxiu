import {Cell} from "./cell";

class Fence {
    cells = []
    specs
    title
    id

    constructor(specs) {
        this.specs = specs
        this.title = specs[0].key
        this.id = specs[0].key_id
    }

    init() {
        this.initCells()
    }

    initCells() {
        this.specs.forEach(s => {
            const existed = this.cells.some(c => {//some一直在找符合条件的值，一旦找到，则不会继续迭代下去。
                return c.id === s.value_id
            })
            if (existed) {
                return
            }
            const cell = new Cell(s)
            this.cells.push(cell)
            // this.pushValueTitle(s.value)
        })
    }

    setFenceSketch(skuList) {//主要目的将sku和cell做关联  接收一组sku
        // 给已经存在的cells数组里面的每个cell和skuList里面的skuImg进行一个匹配
        this.cells.forEach(c => {
            this._setCellSkuImg(c, skuList)
        })
    }

    _setCellSkuImg(cell, skuList) {//cell 和每个skuImg进行匹配
        const specCode = cell.getCellCode()//规格的code
        const matchedSku = skuList.find(s => s.code.includes(specCode))
        // const matchedSku = skuList.find(s => {
        //     return  s.code.includes(specCode)
        // })
        console.log(matchedSku)
        if (matchedSku) {

            cell.skuImg = matchedSku.img
        }
    }

    pushValueTitle(title) {
        this.valueTitles.push(title)
    }
}

export {
    Fence
}