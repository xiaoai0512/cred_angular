<template>
  <div class="menue-tree-container">
    <a-row>
      <a-col :span="8" v-if="columnItem.disabled !== 'T'">
        <a-tree
          checkable
          :defaultExpandAll="true"
          :checkedKeys="checkedKeys"
          @check="handleMenuSelect"
          :treeData="treeData"/>
      </a-col>
      <a-col
        :span="2"
        style="text-align:right;margin-right:10px;">
        已选菜单:
      </a-col>
      <a-col :span="12" style="padding-top:2px">
        <a-tree
          :autoExpandParent="true"
          :expandedKeys="expandedKeys"
          :treeData="selectedTreeData"/>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import ApiService from '@/api/api-service'
import { arrayToString } from '../_util/util'
export default {
  name: 'MenuSelector',
  props: {
    tempFormValue: {
      type: Object,
      default: () => { return {} }
    },
    columnItem: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {
      treeData: [],
      selectedTreeData: [],
      expandedKeys: [],
      checkedKeys: []
    }
  },
  created () {
    this.initMenuData()
  },
  watch: {
    tempFormValue: {
      immediate: true,
      handler (newValue) {
        this.checkedKeys = []
        this.expandedKeys = []
        this.selectedTreeData = []
        this.initMenuData(() => {
          this.checkedKeys = newValue[this.columnItem.columnName] || []
          this.handleMenuSelect(this.checkedKeys)
        })
      }
    }
  },
  methods: {
    initMenuData (callback) {
      if (!this.treeData || this.treeData.length === 0) {
        ApiService.post('/api/menuTrade/queryAllMenuTree', {}, res => {
          this.treeData = res.menuList
          callback && callback()
        })
      }
    },
    handleMenuSelect (checkedKeys, isInit) {
      this.checkedKeys = checkedKeys
      const expandedKeys = []
      const selectedTreeData = this.buildSelectedTreeData(checkedKeys, this.deepCopy(this.treeData), expandedKeys)
      this.selectedTreeData = this.deepCopy(selectedTreeData)
      this.expandedKeys = expandedKeys
      this.$emit('change', this.columnItem.columnName, arrayToString(expandedKeys))
      this.$forceUpdate()
    },
    buildSelectedTreeData (checkedKeys, treeData, expandedKeys) {
      const selectedTreeData = []
      for (let i = 0; i < treeData.length; i++) {
        const treeNode = this.deepCopy(treeData[i])
        if (treeNode.children && treeNode.children.length > 0) {
          treeNode.children = this.buildSelectedTreeData(checkedKeys,
            this.deepCopy(treeNode.children), expandedKeys)
          if (treeNode.children.length > 0) {
            selectedTreeData.push(treeNode)
            expandedKeys.push(treeNode.key)
          }
        } else {
          if (checkedKeys.indexOf(treeNode.key) !== -1) {
            selectedTreeData.push(treeNode)
            expandedKeys.push(treeNode.key)
          }
        }
      }
      return selectedTreeData
    }
  }
}
</script>
<style scoped>
  .menue-tree-container{
    width: 100%;
    height: 400px;
    overflow: auto;
    width: 100%;
  }
</style>
