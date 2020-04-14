import {combination} from "../../utils/util";

class SkuCode {
    code
    spuId
    totalSegments = []

    constructor(code) {
        // 2$1-42#3-10#4-15
        this.code = code
        this._spiltToSegments()

    }

    _spiltToSegments() {
        const spuAndSpec = this.code.split('$')
        this.spuId = spuAndSpec[0]
        const specCodeArray = spuAndSpec[1].split('#')
        const length = specCodeArray.length
        for (let i = 1; i <= length; i++) {
            const segments = combination(specCodeArray, i)
            const newSegments = segments.map(segs => {
                return segs.join('#')
            })
            this.totalSegments=this.totalSegments.concat(newSegments)
            // console.log('eee',newSegments)

        }
        // console.log('ffff',this.totalSegments)

    }
}

export {SkuCode}