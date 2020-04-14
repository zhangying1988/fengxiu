import {Http} from "../utils/http";

class SaleExplainale {
    static async getFixed() {
        const explains = await Http.request({
            url: `sale_explain/fixed`
        })
        return explains.map(e=>{
            return e.text
        })
    }
}

export {
    SaleExplainale
}
