// components/counter/index.js
import {Cart} from '../../models/cart'

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        count: {
            type: Number,
            value: Cart.SKU_MIN_COUNT
        },
        min: {
            type: Number,
            value: Cart.SKU_MIN_COUNT
        },
        max: {
            type: Number,
            value: Cart.SKU_MAX_COUNT
        }
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        onOverStart(event) {
            const minOrMaxOut = event.detail.type
            console.log(minOrMaxOut)
            if (minOrMaxOut == 'overflow_max') {
              wx.showToast({
                icon:'none',
                duration:3000,
                title:`超出最大购买数量`
              })
            }
            if (minOrMaxOut == 'overflow_min') {
                wx.showToast({
                    icon:'none',
                    duration:3000,
                    title:`最少购买${Cart.SKU_MIN_COUNT}件`
                })
            }
        }
    }
})
