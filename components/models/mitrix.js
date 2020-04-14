class Matrix {//矩阵操作 所有操作在这个类里操作
    m

    constructor(matrix) {//接收一个二维数组 参数定义成matrix
        this.m = matrix
    }

    get rowsNum() {// 矩阵多少行
        return this.m.length
    }

    get colsNum() {// 矩阵多少列
        return this.m[0].length//m[0]是否存在
    }


    currnetJ = -1

    forEach(cb) {//cb是一个函数
        for (let j = 0; j < this.colsNum; j++) {
            for (let i = 0; i < this.rowsNum; i++) {
                const element = this.m[i][j]
                // return element 不可以这样 return 后forEach就会结束
                cb(element, i, j)//每遍历一个 element 通过回调函数的调用 将element,i,j 传递出去
            }
        }
    }

    transpose(){
        const desArr = []
        for (let j = 0; j < this.colsNum; j++) {
            desArr[j] = []
            for (let i = 0; i < this.rowsNum; i++) {
                desArr[j][i] = this.m[i][j]
            }
        }
        return desArr
    }

}

export {
    Matrix
}