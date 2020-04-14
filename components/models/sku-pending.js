import {Cell} from "./cell";
import {Joiner} from "../../utils/joiner";

class SkuPending {
    pending = []//用来记录用户的选择
    size

    constructor(size) {
        this.size = size
    }

    init(sku) {
        for (let i = 0; i < sku.specs.length; i++) {
            const cell = new Cell(sku.specs[i])
            this.insertCell(cell, i)
        }
    }

    getCurrentSpecValues() {//获取已选择的spec
        const values = this.pending.map(cell => {//map映射pending里面数组有多少个，values里面就有多少个
            return cell ? cell.spec.value : null
        })
        return values
    }


    getMissingSpecKeysIndex() {//查找为选中的spec的index
        const keysIndex = []
        for (let i = 0; i < this.size; i++) {
            if (!this.pending[i]) {//如果是空值
                keysIndex.push(i)
            }
        }
        return keysIndex
    }

    isIntact() {//判断是否是一个完整的sku
        for (let i = 0; i < this.pending.length; i++) {
            if (this._isEmptyPart(i)) {
                return false
            }
        }
        return true
    }

    getSkuCode() {
        const joiner = new Joiner('#')
        this.pending.forEach(cell => {
            const cellCode = cell.getCellCode()
            joiner.join(cellCode)
        })
        return joiner.getStr()

    }

    _isEmptyPart(index) {
        return this.pending[index] ? false : true
    }

    insertCell(cell, x) {//需要有序的插入到pending中
        this.pending[x] = cell
    }

    removeCell(x) {//删除cell
        this.pending[x] = null
    }

    findSelectdCellByX(x) {
        return this.pending[x]
    }

    isSelected(cell, x) {
        const pendingCell = this.pending[x]
        if (!pendingCell) {
            return false
        }
        return cell.id === pendingCell.id
    }
}

export {
    SkuPending
}