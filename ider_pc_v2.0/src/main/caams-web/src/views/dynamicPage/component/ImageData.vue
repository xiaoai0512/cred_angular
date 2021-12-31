<template>
  <div>
    <a-row>
      <a-col :span="6" v-show="!fullScreen">
        <div class="image-tree" :style="`height:${height}px;overflow:auto`">
          <div class="batch-import">
            <a-checkbox
              v-if="edit"
              :checked="checkStatus"
              @change="(e)=>{checkStatus=e.target.checked}">拖动后保持选择原分类</a-checkbox>
          </div>
          <div
            v-for="item in imageTypeList"
            :key="item.pk"
            :class="imageTypeClass(item)"
            @dragenter="(e)=>{dragenter(item.type,e)}"
            @dragleave="()=>(dragleave(item.type))"
            @click="()=>handleImageTypeSelect(item.type)"
          >
            {{ item.name }}（{{ imageCount(item.type) }}）
          </div>
          <div>
          </div>
        </div>
      </a-col>
      <a-col :span="fullScreen?24:18">
        <div class="img-container">
          <div class="img-list" v-show="!fullScreen">
            <draggable
              class="list-group"
              element="ul"
              v-model="imageList"
              :options="dragOptions"
              @start="handleImageStartMove"
              @end="handleImageMoveEnd">
              <transition-group
                title="imageList"
                class="drag-container"
                tag="ul"
                type="transition">
                <li
                  v-for="(imgItem, index) in imageList"
                  :class="index === selectedImageIndex?'img-active':'img'"
                  @click="showBigImage(index)"
                  :key="'image_'+index">
                  <img :src="imgItem"/>
                  <span v-if="edit" class="close" @click="(event)=>deleteImage(event, index)">
                    <a-icon type="close-circle" />
                  </span>
                </li>
              </transition-group>
            </draggable>
            <a-upload
              v-if="selectedImageType && edit"
              name="avatar"
              listType="picture-card"
              :showUploadList="false"
              :multiple="true"
              :customRequest="(fileInfo)=>handleUpload(fileInfo)"
            >
              <div>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">添加</div>
              </div>
            </a-upload>
          </div>
          <div class="big-img" id="bigImg" :style="fullScreen?'height:'+(height-52)+'px':'height:'+ (height-132) +'px'">
            <img
              :style="`width:${currentWidth}%`"
              v-if="(selectedImageIndex || selectedImageIndex === 0) && selectedImageIndex < imageList.length"
              class="img"
              id="img"
              :src="imageList[selectedImageIndex]"/>
          </div>
          <div class="img-operate">
            <div v-show="selectedImageIndex || selectedImageIndex === 0">
              <a-button type="primary" @click="handleFullScreen">
                {{ fullScreen?'小屏':'全屏' }}
              </a-button>
              <a-button type="primary" style="margin-left:10px" @click="biggerImage">放大</a-button>
              <a-button @click="smallerImage" style="margin-left:10px" type="primary">缩小</a-button>
              <a-button @click="()=>{currentWidth=100}" style="margin-left:10px" type="primary">还原原始大小</a-button>
              <a-button v-if="edit" @click="handleRotate" style="margin-left:10px" type="primary">旋转</a-button>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import HashMap from 'hashmap'
import draggable from 'vuedraggable'
import { getBase64 } from '@/components/_util/util'
export default {
  name: 'ImageData',
  components: { draggable },
  props: {
    edit: {
      type: Object,
      default: () => { return false }
    }
  },
  data () {
    return {
      height: undefined,
      loading: false,
      fullScreen: false,
      selectedImageType: undefined,
      imageMap: new HashMap(),
      imageList: [],
      currentWidth: 100,
      selectedImageIndex: undefined,
      moveToImageType: undefined,
      checkStatus: true,
      imageDragging: false,
      dragOptions: {
        animation: 0,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
        sort: true
      },
      imageTypeList: []
    }
  },
  computed: {
    imageTypeClass () {
      return function (imgItem) {
        if (imgItem.type === this.moveToImageType) {
          return 'item-move-to'
        }
        if (imgItem.type === this.selectedImageType) {
          return 'item-active'
        } else {
          return 'item'
        }
      }
    },
    imageCount () {
      return function (type) {
        const imageList = this.imageMap.get(type)
        if (!imageList) {
          return 0
        } else {
          return imageList.length
        }
      }
    }
  },
  watch: {
    selectedImageIndex: {
      immediate: true,
      handler (newValye) {
        // 处理图片跟随鼠标移动效果
        window.setTimeout(() => {
          if (!document.getElementById('img')) {
            return
          }
          let startPostion = {}
          let moveImg = false
          document.getElementById('img').ondragstart = function () {
            return false
          }
          document.getElementById('img').onmousedown = function (e) {
            startPostion = {
              x: e.clientX,
              y: e.clientY
            }
            moveImg = true
          }
          document.getElementById('img').onmousemove = function (e) {
            const moveX = startPostion.x - e.clientX
            const moveY = startPostion.y - e.clientY
            startPostion = {
              x: e.clientX,
              y: e.clientY
            }
            if (moveImg) {
              document.getElementById('bigImg').scrollLeft += moveX
              document.getElementById('bigImg').scrollTop += moveY
            }
          }
          document.getElementById('img').onmouseup = function () {
            moveImg = false
          }
          document.getElementById('img').onmouseout = function () {
            moveImg = false
          }
        }, 100)
      }
    }
  },
  created () {
    const clientHeight = document.documentElement.clientHeight
    this.height = (clientHeight - 210)
    this.queryImagesType()
  },
  methods: {
    queryImagesType () {
      const bizScene = this.$store.getters.extendData.bizScene
      this.post('/api/imagesService/queryImages', { bizScene: bizScene }, res => {
        const imageTypeList = res.map(item => {
          return {
            type: item.imageTypeId,
            name: item.imageTypeName
          }
        })
        this.imageTypeList = imageTypeList
      })
    },
    handleUpload (fileInfo) {
      this.loading = true
      getBase64(fileInfo.file, imageUrl => {
        const imageList = this.imageMap.get(this.selectedImageType) || []
        this.handleAddWater(imageUrl, imageBase64 => {
          imageList.push(imageBase64)
          this.imageMap.set(this.selectedImageType, imageList)
          this.imageList = imageList
          this.selectedImageIndex = this.imageList.length - 1
          this.loading = false
        })
      })
    },
    handleImageTypeSelect (imageType) {
      this.selectedImageType = imageType
      this.imageList = this.imageMap.get(imageType)
      if (this.imageList && this.imageList.length > 0) {
        this.selectedImageIndex = 0
      } else {
        this.selectedImageIndex = undefined
      }
    },
    showBigImage (index) {
      this.selectedImageIndex = index
    },
    deleteImage (event, index) {
      if (event) {
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true
      }
      this.$confirm({
        title: '确定删除该项?',
        onOk: () => {
          const imageList = this.imageMap.get(this.selectedImageType)
          imageList.splice(index, 1)
          this.imageList = imageList
        }
      })
    },
    biggerImage () {
      let currentWidth = this.currentWidth
      if (currentWidth < 500) {
        currentWidth = currentWidth + 50
      }
      this.currentWidth = currentWidth
    },
    smallerImage () {
      let currentWidth = this.currentWidth
      if (currentWidth > 100) {
        currentWidth = currentWidth - 50
      }
      this.currentWidth = currentWidth
    },
    handleImageStartMove (event) {
      this.imageDragging = true
      this.selectedImageIndex = event.oldIndex
    },
    handleImageMoveEnd (event) {
      this.imageDragging = false
      if (this.moveToImageType) {
        // 将元素移动到已选中的分类
        const imageList = this.imageMap.get(this.moveToImageType) || []
        imageList.push(this.imageList[event.oldIndex])
        this.imageMap.set(this.moveToImageType, imageList)
        // 将以前的元素移出
        const oldImageList = this.imageMap.get(this.selectedImageType)
        oldImageList.splice(event.oldIndex, 1)
        this.imageMap.set(this.selectedImageType, oldImageList)
        // 处理当前已选中的影像类型
        if (!this.checkStatus) {
          this.selectedImageType = this.moveToImageType
          this.imageList = imageList
          this.selectedImageIndex = this.imageList.length - 1
        } else {
          this.imageList = this.imageMap.get(this.selectedImageType)
        }
        this.$forceUpdate()
      } else {
        this.selectedImageIndex = event.newIndex
      }
    },
    dragenter (imageType, e) {
      if (!this.imageDragging || imageType === this.selectedImageType) {
        return
      }
      this.moveToImageType = imageType
    },
    dragleave (imageType) {
      if (this.moveToImageType === imageType) {
        window.setTimeout(() => {
          this.moveToImageType = undefined
        }, 100)
      }
    },
    handleRotate () {
      // 处理旋转
      const imageBase64 = this.imageList[this.selectedImageIndex]
      var image = document.createElement('img')
      image.setAttribute('src', imageBase64)
      window.setTimeout(() => {
        const canvas = document.createElement('canvas')
        canvas.width = image.height
        canvas.height = image.width
        const context = canvas.getContext('2d')
        var obj = {
          x: canvas.width / 2,
          y: canvas.height / 2,
          w: image.width,
          h: image.height
        }
        // 设置旋转中心圆点到绘制的中心位置
        context.translate(obj.x, obj.y)
        context.rotate(90 * Math.PI / 180)
        context.translate(-obj.x, -obj.y)
        context.fillRect(obj.x - obj.w / 2, obj.y - obj.h / 2, obj.w, obj.h)
        context.drawImage(image, obj.x - obj.w / 2, obj.y - obj.h / 2, obj.w, obj.h)
        const imageData = canvas.toDataURL()
        const imageList = this.imageList
        imageList[this.selectedImageIndex] = imageData
        this.imageList = this.deepCopy(imageList)
      }, 0)
    },
    handleAddWater (imageBase64, callback) {
      // 处理添加水印
      var image = document.createElement('img')
      image.setAttribute('src', imageBase64)
      window.setTimeout(() => {
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        context.font = '50px microsoft yahei'
        context.fillStyle = 'rgba(0,0,0,0.2)'
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 10; j++) {
            context.fillText('成都农商银行', 20 + i * 400, 20 + j * 150)
          }
        }
        callback && callback(canvas.toDataURL())
      }, 0)
    },
    handleFullScreen () {
      if (this.fullScreen) {
        this.fullScreen = false
      } else {
        this.fullScreen = true
      }
    }
  }
}
</script>
<style scoped>
  .img-container{
    border:1px solid #e2e2e2;
  }
  .img-container .img-list{
    padding: 10px;
    height: 80px;
    border-bottom: 1px solid #e2e2e2;
  }
  .img-container .img-list .img{
    width:60px;
    height:60px;
    margin-right:15px;
    display: block;
    float: left;
    border: 1px solid #e2e2e2;
    font-size: 32px;
    text-align: center;
    color: #e2e2e2;
    padding-bottom: 1px;
    position: relative;
  }

   .img-container .img-list .img-active{
    width:60px;
    height:60px;
    margin-right:15px;
    display: block;
    float: left;
    border: 1px solid #ff5c00;
    font-size: 32px;
    text-align: center;
    color: #e2e2e2;
    padding-bottom: 1px;
     position: relative;
  }

  .img-container .img-list .close{
    color: #ff5c00;
    position: absolute;
    top: -5px;
    right: 0px;
    font-size: 20px;
  }

  .img-container .img-list img{
    width:100%;
    height:100%;
    cursor: pointer;
  }

  .img-container .big-img{
    width: 100%;
    overflow: auto;
    border-bottom: 1px solid #e2e2e2;
    cursor: pointer;
  }
  .img-container .img{
    width: 100%;
  }
  .img-container .img-operate{
    text-align: center;
    height: 50px;
    line-height: 50px;
  }
  .img-container >>> .ant-upload-select-picture-card{
    width: 60px;
    height: 60px;
    margin-top: -13px;
  }
  ul{
    padding-inline-start: 0px;
  }
  .image-tree{
    border: 1px solid #e2e2e2;
    border-right: 0px;
  }
  .image-tree .batch-import{
    height: 80px;
    line-height: 80px;
    text-align: center;
    border-bottom: 1px solid #e2e2e2;
  }
  .image-tree .item{
    padding: 10px 0 10px 0;
    padding-left: 20px;
    border-bottom: 1px solid #e2e2e2;
    cursor: pointer;
  }
  .image-tree .item-active{
    padding: 10px 0 10px 0;
    padding-left: 20px;
    border-bottom: 1px solid #e2e2e2;
    background: #1890ff;
    cursor: pointer;
    color: #fff;
  }
  .image-tree .item-move-to{
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    border-bottom: 1px solid #e2e2e2;
    background: #ff5c00;
    cursor: pointer;
    color: #fff;
  }
</style>
