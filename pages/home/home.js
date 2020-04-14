// pages/home/home.js
import {
    Theme
} from "../../models/theme";
import {
    Banner
} from "../../models/banner";
import {
    Category
} from "../../models/category";
import {
    Activity
} from "../../models/activity";
import {SpuPaging} from "../../components/models/spu-paging";

Page({
    data: {
        themeA: null,
        bannerB: null,
        grid: [],
        activityD: null,
        themeE: null,
        spuPaging: null,
        loadingType:"loading"
    },
    async onLoad(options) {
        this.initAllData()
        this.initBottomSpuList()
    },
    async initBottomSpuList() {
        const paging = SpuPaging.getLatestPaging()
        this.data.spuPaging = paging//数据 从对象里面获取 当用户触发滑动事件 需要获取原来的paging对象不能重新new一个paging对象 保存最初始的paging对象
        const data = await paging.getMoreData()
        if (!data) {
            return
        }
        wx.lin.renderWaterFlow(data.items)
        // wx.lin.renderWaterFlow(data.items,false,()=>{
        //     console.log('渲染成功1', data.items)
        // })
    },
    onReachBottom: async function () {
        console.log('332323')
        const data = await this.data.spuPaging.getMoreData()
        if (!data) {
            return
        }
        wx.lin.renderWaterFlow(data.items)
        if(!data.moreData){
            this.setData({
                loadingType:'end'
            })
        }
    },
    async initAllData() {
        const theme = new Theme()
        await theme.getThemes()
        const themeA = theme.getHomeLocationA()
        const themeE = theme.getHomeLocationE()
        const themeF = theme.getHomeLocationF()
        const themeH = theme.getHomeLocationH()

        let themeESpu = []
        if (themeE.online) {
            const data = await Theme.getHomeLocationESpu()
            if (data) {
                themeESpu = data.spu_list.slice(0, 8)
            }
        }
        //原来

        //函数式编程 find、filter、map、some、reduce
        // const themes = await Theme.getThemes()
        // const themeA = themes.find(t => t.name === 't-1')
        const bannerB = await Banner.getHomelocationB()
        const grid = await Category.getHomelocationC()
        const activityD = await Activity.getHomelocationD()

        const bannerG = await Banner.getHomelocationG()
        this.setData({
            themeA,
            bannerB: bannerB,
            grid: grid,
            activityD: activityD,
            themeE,
            themeESpu,
            themeF,
            themeH,
            bannerG
        })
        // console.log('themes', bannerG)

    },
    onReady: function () {

    },

})