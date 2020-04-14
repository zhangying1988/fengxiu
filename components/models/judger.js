import {SkuCode} from "./sku-code";
import {CellStatus} from "../../core/enum";
import {Joiner} from "../../utils/joiner";
import {SkuPending} from "./sku-pending";

class Judger {
    fencesGroup
    pathDict = []
    skuPending

    constructor(fencesGroup) {
        this.fencesGroup = fencesGroup
        this._initPathDict()
        this._initSkuPending()

    }

    isSkuIntact() {
        return this.skuPending.isIntact()
    }

    getCurrentValues() {
        console.log(this.skuPending.getCurrentSpecValues())
        return this.skuPending.getCurrentSpecValues()

    }

    getMissingKeys() {
        const missingKeysIndex = this.skuPending.getMissingSpecKeysIndex()
        return missingKeysIndex.map(i => {
            return this.fencesGroup.fences[i].title
        })
    }

    _initSkuPending() {
        const specsLength = this.fencesGroup.fences.length
        this.skuPending = new SkuPending(specsLength)//初始化空的skupending
        const defaultSku = this.fencesGroup.getDefaultSku()
        if (!defaultSku) {
            return
        }
        this.skuPending.init(defaultSku)
        //在judge之前将fenceGroup里面的数据状态更新一下
        this._initSelectedCell()
        this.judge(null, null, null, true)
        console.log(this.skuPending)
    }

    _initSelectedCell() {
        this.skuPending.pending.forEach(cell => {
            this.fencesGroup.setCellStatusById(cell.id, CellStatus.SELECTED)
        })
    }

    _initPathDict() {
        this.fencesGroup.spu.sku_list.forEach(s => {
            const skuCode = new SkuCode(s.code)
            this.pathDict = this.pathDict.concat(skuCode.totalSegments)
        })
        console.log('pathDict', this.pathDict)
    }


    judge(cell, x, y, isInit = false) {
        if (!isInit) {
            this._changeCurrentCellStatus(cell, x, y)
        }

        this.fencesGroup.eachCell((cell, x, y) => {
            const path = this._findPotentinalPath(cell, x, y)
            if (!path) {
                return
            }
            const isIn = this._isInDict(path)
            if (isIn) {
                this.fencesGroup.setCellStatusByXY(x, y, CellStatus.WAITING)
                // this.fencesGroup.fences[x].cells[y].status = CellStatus.WAITING
            } else {
                this.fencesGroup.setCellStatusByXY(x, y, CellStatus.FORBIDEN)
                // this.fencesGroup.fences[x].cells[y].status = CellStatus.FORBIDEN
            }
        })

    }

    getDeterminateSku() {
        const code = this.skuPending.getSkuCode()
        console.log('code', code)
        const sku = this.fencesGroup.getSku(code)
        return sku

    }

    _isInDict(path) {
        return this.pathDict.includes(path)
    }

    _findPotentinalPath(cell, x, y) {
        const joiner = new Joiner('#')
        for (let i = 0; i < this.fencesGroup.fences.length; i++) {
            const selected = this.skuPending.findSelectdCellByX(i)
            if (x === i) {
                // 当前行 path cell id 1-42
                if (this.skuPending.isSelected(cell, x)) {//当前行被选
                    return
                }
                const cellCode = this._getCellCode(cell.spec)
                joiner.join(cellCode)
            } else {
                // 其他行
                if (selected) {
                    //selected cell id 加入到path 3-56
                    const cellCode = this._getCellCode(selected.spec)
                    joiner.join(cellCode)
                }
            }
        }
        return joiner.getStr()
    }

    _getCellCode(spec) {
        return spec.key_id + '-' + spec.value_id
    }


    _changeCurrentCellStatus(cell, x, y) {
        if (cell.status === CellStatus.WAITING) {
            // cell.status = CellStatus.WAITING
            this.fencesGroup.setCellStatusByXY(x, y, CellStatus.SELECTED)
            // this.fencesGroup.fences[x].cells[y].status = CellStatus.SELECTED
            this.skuPending.insertCell(cell, x)

        }
        if (cell.status === CellStatus.SELECTED) {
            // cell.status === CellStatus.SELECTED
            this.fencesGroup.setCellStatusByXY(x, y, CellStatus.WAITING)
            // this.fencesGroup.fences[x].cells[y].status = CellStatus.WAITING
            this.skuPending.removeCell(x)
        }
    }
}


export {
    Judger
}