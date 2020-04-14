import {Http} from "../utils/http";

class Category {
    static async getHomelocationC() {
        return await Http.request({
            url: `category/grid/all`
        })
    }
}

export {
    Category
}