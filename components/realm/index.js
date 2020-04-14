// components/realm/index.js
import {FenceGroup} from "../models/fence-group";
import {Judger} from "../models/judger";
import {Spu} from "../../models/spu";
import {Cell} from "../models/cell";
import {Cart} from "../../models/cart";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        spu: Object,
        orderWay: String
    },

    /**
     * 组件的初始数据
     */
    data: {
        judger: Object,
        previewImg: null,
        price: null,
        discountPrice: null,
        currentSkuCount: Cart.SKU_MIN_COUNT
    },

    observers: {
        'spu': function (spu) { //对spu属性数据 处理数据 使用observes 监听器
            if (!spu) {//若不存在 返回 不要继续
                return
            }
            if (Spu.isNoSpec(spu)) {
                this.processNoSpec(spu)
                // return
            } else {
                this.processHasSpec(spu)
            }
            this.triggerSpecEvent()
        }
    },
    methods: {
        processNoSpec(spu) {
            this.setData({
                noSpec: true,//spu 无规格选择
                noSpecStock: spu.sku_list[0].stok//无规格商品的库存noSpecStock
            })
            this.bindSkuData(spu.sku_list[0])
            // this.setStockStatus(spu.sku_list[0].stock,this.data.currentSkuCount)//无法进judger方法
            this.setStockStatus(spu.sku_list[0].stock)
        },
        processHasSpec(spu) {
            const fencesGroup = new FenceGroup(spu)
            fencesGroup.initFences()
            const judger = new Judger(fencesGroup)
            this.data.judger = judger
            const defaultSku = fencesGroup.getDefaultSku()
            if (defaultSku) {//存在绑定sku数据 不存在绑定spu数据
                this.bindSkuData(defaultSku)
                // this.setStockStatus(defaultSku.stock,this.data.currentSkuCount)//需要触发onSelectCount 这个时候不会触发
                this.setStockStatus(defaultSku.stock)
            } else {
                this.bindSpuData()
            }
            this.bindTipData()//
            this.bindFenceGroupData(fencesGroup)
        },
        triggerSpecEvent() {
            const noSpec = Spu.isNoSpec(this.properties.spu)
            if (noSpec) {
                this.triggerSpecEvent('specchange', {
                    noSpec
                })
            } else {
                this.triggerEvent('specchange', {
                    noSpec: Spu.isNoSpec(this.properties.spu),
                    skuIntact: this.data.judger.isSkuIntact(),//判断是否是一个完整的sku
                    currentValues: this.data.judger.getCurrentValues(),
                    missingKeys: this.data.judger.getMissingKeys()
                })
            }

        },
        bindSpuData() {
            const spu = this.properties.spu
            this.setData({
                previewImg: spu.img,
                title: spu.title,
                price: spu.price,
                discountPrice: spu.discount_price
            })
        },
        bindSkuData(sku) {
            this.setData({
                previewImg: sku.img,
                title: sku.title,
                price: sku.price,
                discountPrice: sku.discount_price,
                stock: sku.stock,
            })
        },
        bindTipData() {
            this.setData({
                skuIntact: this.data.judger.isSkuIntact(),//判断是否是一个完整的sku
                currentValues: this.data.judger.getCurrentValues(),
                missingKeys: this.data.judger.getMissingKeys()
            })
        },
        bindFenceGroupData(fencesGroup) {
            this.setData({
                fences: fencesGroup.fences,
            })
            // console.log('ddd', this.data.fences)
        },
        setStockStatus(stock) {
            const currentCount = this.data.currentSkuCount//改造无规格时点击数量报错
            this.setData({
                outStock: this.isOutOfStock(stock, currentCount)
            })
        },
        isOutOfStock(stock, currentCount) {
            return stock < currentCount
        },
        onSelectCount(event) {
            const currentCount = event.detail.count
            this.data.currentSkuCount = currentCount
            if (this.data.noSpec) {
                this.setStockStatus(this.data.noSpecStock)
            } else if (this.data.judger.isSkuIntact()) {//判断是否是完整sku
                const sku = this.data.judger.getDeterminateSku()//获取已确定sku
                // this.setStockStatus(sku.stock, currentCount)
                this.setStockStatus(sku.stock)
            }
        },
        onCellTap(event) {
            const data = event.detail.cell
            const x = event.detail.x
            const y = event.detail.y
            const cell = new Cell(data.spec)
            cell.status = data.status
            const judger = this.data.judger
            judger.judge(cell, x, y)
            const skuIntact = judger.isSkuIntact()//判断是否是一个完整的sku
            if (skuIntact) {
                const currentSku = judger.getDeterminateSku()
                this.bindSkuData(currentSku)
                // this.setStockStatus(currentSku.stock, this.data.currentSkuCount)
                this.setStockStatus(currentSku.stock)
            }
            this.bindTipData()
            this.bindFenceGroupData(judger.fencesGroup)
            this.triggerSpecEvent()
            // console.log(judger)
            // this.setData({
            //     fences: judger.fencesGroup.fences
            // })
        }
    }
})
