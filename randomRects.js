/**
 * 随机生成矩形
 */

/**
 * 随机生成整数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 */
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

/**
 * 
 * @param {Number} x 横坐标
 * @param {Number} y 纵坐标
 * @param {Number} width 宽度
 * @param {Number} height 高度
 */
function Rect(x, y, width, height) {
  this.x = x
  this.y = y
  this.width = width
  this.height = height
}

/**
 * 
 * @param {Number} width 画布宽度
 * @param {Number} height 画布高度
 * @param {Number} nums 生成数量
 */
function CreateRects(width, height, nums) {
  this.width = width
  this.height = height
  this.nums = nums
}

/**
 * 连接放置生成矩形的容器
 * @param {String|HtmlElement} element 
 */
CreateRects.prototype.connectContainer = function(element) {
  if (typeof element === 'string') {
    if (element.startsWith('#')) {
      this.element = document.getElementById(element.slice(1))
    } else if (element.startsWith('.')) {
      this.element = document.getElementsByClassName(element.slice(1))[0]
    }
    // 容器必须是div类型
    if (!(this.element instanceof HTMLDivElement)) {
      throw new Error('容器不存在')
    }
  }
}

// 生成矩形网格点列表
CreateRects.prototype.generateRectsPoints = function() {
  if (!this.width || !this.height || !this.nums) {
    throw new Error('参数缺失，请检查！')
  }

  const areaSize = this.width * this.height
  // 计算固定步长
  let step = Math.sqrt(areaSize / this.nums)
  const columnNum = Math.floor(this.width / step) + 1
  step = this.width / columnNum
  // 根据固定步长生成 this.nums个网格点

  // 初始位置
  const initPosition = {
    x: 0,
    y: 0
  }
  // 网格点列表： 二维数组，行列直接关联绘制结果中正方形的行列
  const rectList = []
  let rowIndex = 0
  // 上一次迭代的网格点位置
  const lastPosition = JSON.parse(JSON.stringify(initPosition))
  for (let i = 0; i < this.nums; i++) {
    let x
    let y

    if (i === 0) {
      x = 0
      y = 0
    } else if (lastPosition.x + 2 * step > this.width) { // 某一行放不下了，换个行
      x = initPosition.x
      y = lastPosition.y + step
      // 行索引加一
      rowIndex++
    } else { // 横坐标移动step的距离，纵坐标不变
      x = lastPosition.x + step
      y = lastPosition.y
    }
    // 下一个网格点的基准位置
    const position = {
      x,
      y
    }

    let minAngle
    let maxAngle
    if (x === 0 && y === 0) {
      minAngle = 0
      maxAngle = 90
    } else if (x === 0 && y !== 0) {
      minAngle = -90
      maxAngle = 90
    } else if (x !== 0 && y === 0) {
      minAngle = 0
      maxAngle = 180
    } else {
      minAngle = 0
      maxAngle = 360
    }

    // 更新lastPosition
    lastPosition.x = position.x
    lastPosition.y = position.y
    // 网格点朝任意方向随机移动不超过step的距离
    const randomAngle = getRndInteger(0, 90)
    const randomStepX = Math.cos((randomAngle/360) * Math.PI * 2) * step / 2
    const randomStepY = Math.sin((randomAngle/360) * Math.PI * 2) * step / 2
    position.x += randomStepX
    position.y += randomStepY

    const sideLength = getRndInteger(20, Math.min(step - randomStepX, step - randomStepY))
    const rect = new Rect(position.x, position.y, sideLength, sideLength)
    // 将新生成的网格点推入列表

    if (!rectList[rowIndex]) {
      rectList.push([])
    }
    rectList[rowIndex].push(rect)
  }
  this.rectList = rectList
  return this.rectList
}

/**
 * 绘制图形
 */
CreateRects.prototype.drawReacts = function() {
  const container = this.element
  let customIndex = 0
  this.rectList.forEach(rectListItem => {
    rectListItem.forEach(rect => {
      const div = document.createElement('div')

      // 自定义类型
      if (this.type === 'custom') {
        div.style.backgroundImage = this.customList[customIndex]
        div.style.backgroundSize = '100% 100%'
        customIndex++
      } else {
        if (this.type === 'circle') {
          div.style.borderRadius = '50%'
        }
        if (this.colorList) {
          div.style.backgroundColor = this.colorList[customIndex]
          customIndex++
        } else {
          const color = getRndInteger(0, 16777215)
          div.style.backgroundColor = `#${color.toString(16)}`
        }
      }

      

      div.style.width = `${rect.width}px`
      div.style.height = `${rect.height}px`
      div.style.position = 'absolute'
      div.style.transform = `translate(${rect.x}px, ${rect.y}px)`
      container.appendChild(div)
    })
  })
}

/**
 * 
 * @param {Object} option 初始化参数
 * option参数: {
 *  element: 要链接的容器, 可使用id选择器，类选择器，或者直接传入dom元素，不过元素类型只能是div
 *  type: 绘制的元素类型-- 'square' 正方形; 'circle' 圆形; 'custom' 自定义
 *  colorList: 自定义颜色列表 若未定义此参数，颜色则随机，此数组长度必须与要绘制的图形数量一致
 *  customList: 自定义绘制图形列表，此参数只有type参数是 custom 时才有效
 * } 
 */
CreateRects.prototype.init = function (option) {
  if (option.element) {
    this.connectContainer(option.element)
  }
  if (!option.element) {
    throw new Error('未连接绘制容器')
  }
  this.type = option.type
  this.colorList = option.colorList
  this.customList = option.customList
  this.generateRectsPoints()
}

// const createRectssss = new CreateRects(400, 300, 10)

// console.log(createRectssss.generateRectsPoints())

// export default CreateRects
