// pages/detail/detail.js
import {Spu} from "../../models/spu";
import {ShoppingWay} from "../../core/enum";
import {SaleExplainale} from "../../models/sale-explain";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        showRealm: false
    },

    onLoad: async function (options) {
        const pid = options.pid
        const spu = await Spu.getDetail(pid)
        const explain=await SaleExplainale.getFixed()
        this.setData({
            spu,
            explain
        })
        console.log('add',explain)
        console.log('data',this.data)
    },
    onGotoHome(evnet) {
        wx.switchTab({
            url: "/pages/home/home"
        })
    },
    onGotoCart(evnet) {
        wx.switchTab({
            url: "/pages/cart/cart"
        })
    },
    onAddToCart(event) {
        this.setData({
            showRealm: true,
            orderWay: ShoppingWay.CART
        })
        console.log('onAddToCart')
    },
    onBuy(event) {
        this.setData({
            showRealm: true,
            orderWay: ShoppingWay.BUY
        })
        console.log('onBuy')
    },
    onSpecChange(event) {
        this.setData({
            specs: event.detail
        })
    }

})
