<template>
  <a-modal
    title="页面设计器"
    :visible="visible"
    :maskClosable="false"
    width="100%"
    @ok="handleOk"
    @cancel="visible = false"
  >
    <a-row>
      <a-col :span="4">
        <div class="design-container">
          <div class="component-item">
            备选组件
          </div>
          <div class="component-item" style="padding:0">
            <a-input placeholder="请输入过滤条件" @change="(e) => {handleBackupComponentFilter(e.target.value)}"/>
          </div>
          <div class="component-container">
            <draggable
              class="list-group"
              element="ul"
              v-model="backupComponentList"
              :options="dragOptions('from')"
              @start="(event) => {startMove(event)}"
              @end="(event)=> {handleBackupComponentMove(event)}">
              <transition-group
                title="backupContainer"
                class="drag-container"
                tag="ul"
                type="transition">
                <li class="component-item" v-for="(element, index) in backupComponentList" :key="'component'+index">
                  <a-icon v-if="element.componentType === 'table'" class="icon" type="table" />
                  <a-icon v-if="element.componentType === 'form'" class="icon" type="profile" />
                  <a-icon v-if="element.componentType === 'selfDefined'" class="icon" type="menu-unfold" />
                  {{ element.componentName }}
                </li>
              </transition-group>
            </draggable>
          </div>
        </div>
      </a-col>
      <a-col :span="4">
        <div class="design-container">
          <div class="component-item">
            已选组件
          </div>
          <div class="component-container">
            <draggable
              element="ul"
              v-model="selectedComponentList"
              :options="dragOptions('to')"
              @end="(event)=> {handleSelectedComponentMove(event)}">
              <transition-group title="selectedContainer" class="drag-container" tag="ul">
                <li class="component-item" v-for="(element, index) in selectedComponentList" :key="'selectedComponent'+index">
                  <a-icon v-if="element.componentType === 'table'" class="icon" type="table" />
                  <a-icon v-if="element.componentType === 'form'" class="icon" type="profile" />
                  <a-icon v-if="element.componentType === 'selfDefined'" class="icon" type="menu-unfold" />
                  {{ element.componentName }}
                </li>
              </transition-group>
            </draggable>
          </div>
        </div>
      </a-col>
      <a-col :span="16">
        <div class="page-container">
          <DynamicCrudPage
            v-if="pageType === 'crudPage'"
            :showPageHeader="false"
            :designerMode="true"
            :config="pageConfig"/>
          <DynamicInputPage
            v-if="pageType === 'inputPage'"
            :designerMode="true"
            :config="pageConfig"/>
          <DynamicApprovePage
            v-if="pageType === 'approvePage'"
            :designerMode="true"
            :config="pageConfig"/>
        </div>
      </a-col>
    </a-row>
  </a-modal>
</template>
<script>
import DynamicCrudPage from '@/components/DynamicCrudPage'
import DynamicInputPage from '@/components/DynamicInputPage'
import DynamicApprovePage from '@/components/DynamicApprovePage'
import ApiService from '@/api/api-service'
import draggable from 'vuedraggable'
export default {
  name: 'ComponentDesigner',
  components: { DynamicCrudPage, draggable, DynamicInputPage, DynamicApprovePage },
  props: {
    paramValue: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {
      visible: true,
      pageConfig: [],
      pageType: undefined,
      backupComponentList: [],
      backupComponentListCopy: [],
      selectedComponentList: [],
      movedItem: {}
    }
  },
  computed: {
    dragOptions () {
      return function (type) {
        let sort = true
        if (type === 'from') {
          sort = false
        }
        return {
          animation: 0,
          group: 'description',
          disabled: false,
          ghostClass: 'ghost',
          sort: sort
        }
      }
    }
  },
  created () {
    this.pageType = this.paramValue.pageType
    this.queryPageComponents()
  },
  methods: {
    queryAllComponents () {
      ApiService.post('/api/dyComponentService/listAll', {}, res => {
        res = res || []
        console.log(res)
        // 过滤掉已经被选中的组件
        const selectedComponenetPkList = this.selectedComponentList.map(item => { return item.pk })
        res = res.data.content.filter(item => selectedComponenetPkList.indexOf(item.pk) === -1)
        this.backupComponentList = res
        this.backupComponentListCopy = this.deepCopy(this.backupComponentList)
      })
    },
    queryPageComponents () {
      ApiService.post('/api/dyPageService/queryPageComponent', { pk: this.paramValue.pk }, res => {
        res = res || []
        console.log(res)
        this.selectedComponentList = res.data.map(item => {
          item.componentConfig = JSON.parse(item.componentConfig)
          return item
        })
        const pageConfig = this.selectedComponentList.map(item => {
          return item.componentConfig
        })
        this.pageConfig = pageConfig
        this.queryAllComponents()
      })
    },
    handleOk () {
      const componentPkList = this.selectedComponentList.map(item => item.pk)
      const params = {
        pk: this.paramValue.pk,
        componentPkList: componentPkList
      }
      ApiService.post('/api/dyPageService/savePage', params, res => {
        this.$message.success('保存成功')
        this.visible = false
      })
    },
    startMove (event) {
    },
    handleBackupComponentMove (event) {
      if (event.to.title === 'selectedContainer') {
        const moveItem = this.selectedComponentList[event.newIndex]
        // 被移动的组件重新获取配置信息
        ApiService.post('/api/dyComponentService/queryConfig', { pk: moveItem.pk }, res => {
          const componentConfig = JSON.parse(res.data.componentConfig)
          moveItem.componentConfig = componentConfig
          const pageConfig = this.selectedComponentList.map(item => {
            return item.componentConfig
          })
          this.pageConfig = pageConfig
        })
      }
    },
    handleSelectedComponentMove (event) {
      const pageConfig = this.selectedComponentList.map(item => {
        return item.componentConfig
      })
      this.pageConfig = pageConfig
    },
    handleBackupComponentFilter (searchValue) {
      if (searchValue) {
        this.backupComponentList = this.backupComponentListCopy.filter(item =>
          item.componentName.indexOf(searchValue) !== -1)
      } else {
        this.backupComponentList = this.deepCopy(this.backupComponentListCopy)
      }
    }
  }
}
</script>
<style scoped>
  .design-container{
    margin-top: 2px;
    height:600px;
    background:white;
    border: 1px solid #e2e2e2;
    margin-right:10px;
  }
  .component-container{
    height:510px;
    overflow: auto;
  }
  .drag-container{
    height: 545px;
    border-right: 1px solid #e2e2e2;
  }
  .page-container{
    margin-top: 2px;
    padding: 10px;;
    margin-left: 10px;
    height:600px;
    background:white;
    border: 1px solid #e2e2e2;
    margin-right:10px;
    overflow: auto;
  }
  ul{
    padding-inline-start: 0px;
  }
  .component-item{
    padding: 10px 10px 10px 0;
    padding-left: 20px;
    border-bottom: 1px solid #e2e2e2;
  }
  .icon{
    margin-right: 5px;
    color: #1890ff;
  }
</style>
