<template>
  <div class="table-content" v-show="showTable">
    <div style="padding-bottom:10px">
      <a-button
        class="button-item"
        v-for="(item, index) in topButtons"
        :key="index"
        @click="()=>item.click(item)"
        :type="item.type || 'primary'">{{ item.name }}</a-button>
    </div>
    <a-table
      size="small"
      :rowSelection="rowSelection"
      :columns="columns"
      :rowKey="record => record.pk"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
      @change="handleTableChange"
      bordered
    >
      <template
        v-show="item.dataIndex"
        v-for="(item, index) in columns"
        :slot="item.dataIndex"
        slot-scope="text">
        <span
          :key="index"
        >
          {{ handleValueMap(item, text) }}
        </span>
      </template>
      <span slot="operation" slot-scope="text,record" style="width:100%;display:inline-block;text-align:center">
        <a-button
          class="button-item"
          v-for="(item, index) in buttons"
          :key="index"
          @click="()=>item.click(item, record)"
          :type="item.type || 'primary'">{{ item.name }}</a-button>
      </span>
    </a-table>
    <div
      v-show="this.tableConfig.pageQuery === 'T' &&
        dataSource && dataSource.length > 0"
      class="table-pagination">
      <a-pagination
        :total="pagination.totalCount"
        :showTotal="total => `共${total}条记录`"
        :pageSize="pagination.pageSize"
        :current="pagination.currentPage"
        :pageSizeOptions="['1','5','10', '20', '50', '100', '200']"
        showQuickJumper
        showSizeChanger
        @change="handleCurrentPageChange"
        @showSizeChange="handlePageSizeChange"
      />
    </div>
    <component
      v-show="dynamicComponent"
      :paramValue="dynamicComponentParamValue"
      :is="dynamicComponent"/>
  </div>
</template>
<script>

import ApiService from '@/api/api-service'
import { sensitiveHandler } from '../_util/util'
import { getBlob } from '../_util/base64ToFile'

// 默认每页数据量
const DEFAULT_PAGE_SIZE = 5
const NOT_PAGE_QUERY_DEFAULT_PAGE_SIZE = 10000
export default {
  name: 'DynamicTable',
  props: {
    config: {
      type: Object,
      default () {
        return {
          columnItems: [],
          buttons: [],
          topButtons: []
        }
      }
    },
    queryCondition: {
      type: Object,
      default () {
        return {
        }
      }
    },
    designerMode: {
      type: Boolean,
      default () {
        return false
      }
    },
    componentPk: {
      type: String,
      default () {
        return undefined
      }
    }
  },
  data () {
    return {
      columns: {},
      dataSource: [],
      pagination: {
        currentPage: 1,
        pageSize: DEFAULT_PAGE_SIZE
      },
      dataItems: {},
      loading: false,
      buttons: [],
      topButtons: [],
      dynamicComponent: undefined,
      dynamicComponentParamValue: undefined,
      orderBy: undefined,
      openPage: undefined,
      rowSelection: undefined,
      selectedRows: [],
      selectedRowKeys: []
    }
  },
  computed: {
    showTable () {
      return !(this.openPage === 'T' && this.tableConfig.queryOnOpenPage === 'F')
    }
  },
  watch: {
    config: {
      immediate: true,
      handler (newValue, oldVlue) {
        this.initConfig(newValue)
      }
    },
    queryCondition: {
      immediate: true,
      handler (newValue, oldVlue) {
        this.openPage = newValue.openPage
        delete newValue.openPage
        this.queryCondition = newValue
        // 重置分页信息
        if (!newValue.triggerQuery || newValue.triggerQuery === 'resetPageQuery') {
          this.pagination.pageSize = DEFAULT_PAGE_SIZE
          this.pagination.currentPage = 1
        }
        this.handleQuery()
      }
    },
    componentPk: {
      immediate: true,
      handler (newValue) {
        if (newValue) {
          // 查询组件信息
          ApiService.post('/api/dyComponentService/queryConfig', { pk: newValue }, res => {
            const componentConfig = JSON.parse(res.componentConfig)
            this.tableConfig = componentConfig
          })
        }
      }
    },
    // 监听页面扩展数据，处理刷新操作
    '$store.getters.extendData': {
      immediate: true,
      handler (newValue) {
        console.log('111111111111111111111111111')
        if (newValue.handler === 'dynamicTable' && newValue.action === 'refresh') {
          this.handleQuery()
        }
      }
    }
  },
  methods: {
    initConfig (newValue) {
      const pageQuery = newValue.pageQuery || 'T'
      newValue.pageQuery = pageQuery
      this.tableConfig = newValue
      this.dataItems = newValue.dataItems
      const columnItems = this.deepCopy(newValue.columnItems || [])
      // 检测是否包含buttons,包含button时，新增操作栏
      if (newValue.buttons && newValue.buttons.length > 0) {
        columnItems.push({
          title: '操作',
          dataIndex: 'operation',
          width: this.tableConfig.operationWidth || 200
        })
      }
      // 表格第一列是否显示选择项
      if (this.tableConfig.rowSelectionType === 'checkbox' || this.tableConfig.rowSelectionType === 'radio') {
        this.rowSelection = {
          type: this.tableConfig.rowSelectionType,
          selectedRowKeys: this.selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            this.selectedRows = selectedRows
            this.selectedRowKeys = selectedRowKeys
            this.rowSelection.selectedRowKeys = selectedRowKeys
          }
        }
      } else {
        this.rowSelection = undefined
      }
      columnItems.forEach(item => {
        if (item.dataIndex) {
          // 给每一个包含dataIndex的column增加scopedSlots，方便枚举映射转换
          item.scopedSlots = { customRender: item.dataIndex }
        }
        // 处理是否可排序
        if (item.sortable === 'T') {
          item.sorter = true
        }
      })
      this.columns = columnItems
      this.orderBy = this.tableConfig.orderBy
      this.buttons = this.initButtonEvent(newValue.buttons)
      this.topButtons = this.initButtonEvent(newValue.topButtons, 'topButtons')
      // 从后端参数列表中初始化下拉选项值列表
      this.initDataItems(newValue.columnItems)
      // 处理默认查询
      this.handleQuery()
    },
    initButtonEvent (buttons, type) {
      // 初始化按钮事件
      buttons = buttons || []
      buttons.forEach(item => {
        item.click = (buttonConfig, record) => {
          if (this.designerMode) {
            // 设计模式下禁用按钮
            return
          }
          if (item.action === 'delete') {
            let title = '确定要删除该条记录吗?'
            const pkList = []
            if (type === 'topButtons') {
              if (this.selectedRows.length === 0) {
                this.$message.error('请选择一条或多条记录')
                return
              }
              title = '确认批量删除选择的记录吗?'
              this.selectedRows.forEach(item => {
                pkList.push(item.pk)
              })
            }
            this.$confirm({
              title: title,
              onOk: () => {
                const api = item.api
                if (!api) {
                  this.$message.error('请在删除按钮配置api属性')
                  return
                }
                const params = {
                  modelName: this.tableConfig.modelName,
                  pk: record && record.pk,
                  pkList: pkList,
                  check: this.tableConfig.check || 'F'
                }
                ApiService.post(api, params, (res) => {
                  if (this.tableConfig.check === 'T') {
                    this.$message.success('操作成功，将在复核完成后生效')
                  } else {
                    this.$message.success('删除成功')
                  }
                  this.handleQuery()
                })
              }
            })
          } else if (['edit', 'check', 'detail', 'clone'].indexOf(item.action) !== -1) {
            const api = item.api
            if (!api) {
              this.$message.error('请按钮配置api属性')
              return
            }
            if (type === 'topButtons') {
              if (this.selectedRows.length === 0) {
                this.$message.error('请选择一条记录')
                return
              } else if (this.selectedRows.length > 1) {
                this.$message.error('该操作只能选择一条记录')
                return
              }
              record = this.selectedRows[0]
            }
            const params = {
              modelName: buttonConfig.modelName || this.tableConfig.modelName,
              ...record
            }
            ApiService.post(api, params, (res) => {
              this.$emit('btnClick', item, res.data.modelData)
            })
          } else if (item.action === 'api') {
            const api = item.api
            if (!api) {
              this.$message.error('请配置按钮的api属性')
              return
            }
            if (type === 'topButtons') {
              if (this.selectedRows.length === 0) {
                if (this.tableConfig.rowSelectionType === 'radio') {
                  this.$message.error('请选择一条记录')
                } else if (this.tableConfig.rowSelectionType === 'checkbox') {
                  this.$message.error('请选择一条或多条记录')
                }
                return
              }
              record = this.selectedRows
            }
            const apiHandler = () => {
              const params = {
                modelName: this.tableConfig.modelName,
                modelJson: JSON.stringify(record),
                check: buttonConfig.check || 'F'
              }
              ApiService.post(api, params, (res) => {
                if (buttonConfig.check === 'T') {
                  this.$message.success('操作成功，将在复核完成后生效')
                } else {
                  const message = '操作成功'
                  this.$message.success(message)
                }
                this.handleQuery()
                this.$emit('btnClick', item, record)
              })
            }
            if (buttonConfig.confirm === 'T') {
              this.$confirm({
                title: buttonConfig.confirmText,
                onOk: () => {
                  apiHandler(buttonConfig)
                }
              })
            } else {
              apiHandler(buttonConfig)
            }
          } else if (item.action === 'selfComponent') {
            if (!item.selfComponent) {
              this.$message.error('请配置自定义组件路径')
              return
            }
            if (type === 'topButtons') {
              if (this.selectedRows.length === 0) {
                if (this.tableConfig.rowSelectionType === 'radio') {
                  this.$message.error('请选择一条记录')
                } else if (this.tableConfig.rowSelectionType === 'checkbox') {
                  this.$message.error('请选择一条或多条记录')
                }
                return
              }
              record = this.selectedRows
            }
            let selfComponent = item.selfComponent
            if (selfComponent.charAt(0) === '/') {
              selfComponent = selfComponent.substring(1)
            }
            const api = item.api
            if (!api) {
              this.dynamicComponent = (resolve) => require([`@/${selfComponent}`], resolve)
              this.dynamicComponentParamValue = record
            } else {
              const params = {
                modelName: this.tableConfig.modelName,
                modelJson: JSON.stringify(record)
              }
              ApiService.post(api, params, (res) => {
                res.check = this.tableConfig.check || 'F'
                this.dynamicComponent = (resolve) => require([`@/views${selfComponent}`], resolve)
                this.dynamicComponentParamValue = res
              })
            }
            this.$emit('btnClick', item, record)
          } else if (item.action === 'export') {
            const api = buttonConfig.api
            if (!api) {
              this.$message.error('请配置按钮的api属性')
              return
            }
            if (!buttonConfig.modelName) {
              this.$message.error('请配置导出数据的实体类')
              return
            }
            this.$emit('getQueryFormData', queryFormData => {
              const params = {
                modelName: buttonConfig.modelName,
                ...queryFormData
              }
              ApiService.post(api, params, (res) => {
                const blob = getBlob(res.base64Data)
                const download = document.createElement('a')
                download.download = res.fileName
                download.href = URL.createObjectURL(blob)
                download.click()
              })
            })
          } else if (item.action === 'selfHandle') {
            if (type === 'topButtons') {
              if (this.selectedRows.length === 0) {
                if (this.tableConfig.rowSelectionType === 'radio') {
                  this.$message.error('请选择一条记录')
                } else if (this.tableConfig.rowSelectionType === 'checkbox') {
                  this.$message.error('请选择一条或多条记录')
                }
                return
              }
              record = this.selectedRows
            }
            this.$emit('btnClick', item, record)
          }
        }
      })
      return buttons
    },
    handleValueMap (item, value) {
      // 将空值映射为-
      if (!value && value !== 0) {
        return '-'
      }
      // 处理值映射(值编码到值描述的映射)
      // 优先处理item里面直接传入数据
      if (item.dataItems) {
        const valueArray = item.dataItems.filter(item => item.value === value)
        const mapperValue = valueArray && valueArray.length > 0 ? valueArray[0].label : undefined
        return mapperValue || value
      }
      // 处理从表格配置和系统参数获取的数据(两类数据已通过initDataItems合并，表格配置的数据优先级高于系统参数)
      if (this.dataItems && this.dataItems[item.dataName]) {
        const valueArray = this.dataItems[item.dataName].filter(item => item.value === value)
        const mapperValue = valueArray && valueArray.length > 0 ? valueArray[0].label : undefined
        return mapperValue || value
      }

      // 处理敏感数据
      if (item.sensitiveType) {
        value = sensitiveHandler[item.sensitiveType](value)
      }
      return value
    },
    initDataItems (columnItems) {
      if (!this.showTable) {
        return
      }
      if (columnItems && columnItems.length > 0) {
        const groupCodeList = columnItems.filter(item => item.dataName).map(item => {
          return item.dataName
        })
        ApiService.post('/api/paramTrade/paramData', { groupCodeList: groupCodeList }, (res) => {
          if (res.data && res.data.length > 0) {
            const dataItems = {}
            res.data.forEach(item => {
              dataItems[item.groupCode] = item.paramList.map(item2 => {
                return {
                  label: item2.paramName,
                  value: item2.paramCode
                }
              })
            })
            this.dataItems = {
              ...dataItems,
              ...this.dataItems
            }
          }
        })
      }
    },
    handleTableChange (pagination, filters, sorter) {
      if (sorter.order === 'ascend') {
        this.orderBy = sorter.column.orderByColumn + ' asc'
        this.handleQuery()
      } else if (sorter.order === 'descend') {
        this.orderBy = sorter.column.orderByColumn + ' desc'
        this.handleQuery()
      }
    },
    handleQuery () {
      // 设计模式下不执行查询操作
      if (this.designerMode || !this.showTable) {
        return
      }
      // 重新查询时，置空已选择行
      if (this.rowSelection) {
        this.selectedRows = []
        this.selectedRowKeys = []
        this.rowSelection.selectedRowKeys = []
      }
      this.loading = true
      this.dataSource = []
      let queryCondition = this.queryCondition
      const configFormValue = this.tableConfig.configFormValue || []
      const defaultCondition = {}
      // 处理真实值
      configFormValue.filter(item => item.valueType === 'realValue').forEach(item => {
        defaultCondition[item.prop] = item.value
      })
      // 处理映射值
      configFormValue.filter(item => item.valueType === 'mapValue').forEach(item => {
        defaultCondition[item.prop] = this.queryCondition[item.value]
      })
      queryCondition = {
        ...defaultCondition,
        ...queryCondition
      }
      let params = {}
      params.modelName = this.tableConfig.modelName
      params.orderBy = this.orderBy
      params.currentPage = this.pagination.currentPage
      params.pageSize = this.tableConfig.pageQuery === 'T' ? this.pagination.pageSize : NOT_PAGE_QUERY_DEFAULT_PAGE_SIZE
      if (this.tableConfig.checkQuery === 'T') {
        params = {
          ...params,
          ...queryCondition,
          checkStatusList: this.tableConfig.checkStatus
        }
      } else {
        params.searchConditionJson = JSON.stringify(queryCondition)
      }
      if (!this.tableConfig.api) {
        return
      }
      ApiService.post(this.tableConfig.api, params, (res) => {
        console.log(res)
        this.dataSource = res.data.content
        // this.pagination = res.pageable
        const objPage2 = {
          currentPage: res.data.pageable.pageNumber == '0' ? 1 : res.data.pageable.pageNumber,
          pageSize: res.data.pageable.pageSize,
          totalCount: res.data.totalElements,
          totalPage: res.data.totalPages

        }
        this.pagination = objPage2
        this.loading = false
      }, () => {
        this.loading = false
      })
    },
    handleCurrentPageChange (currentPage, pageSize) {
      this.pagination.currentPage = currentPage
      this.pagination.pageSize = pageSize
      this.handleQuery()
    },
    handlePageSizeChange (currentPage, pageSize) {
      this.pagination.currentPage = currentPage
      this.pagination.pageSize = pageSize
      this.handleQuery()
    }
  }
}
</script>
<style scoped>
.table-content{
  background: #fff;
  padding: 10px;
  border-radius: 5px;
}
.button-item{
  margin-left: 10px;
}
.table-pagination{
  text-align: center;
  margin: 20px 0 10px 0;
}
.table-content >>> .ant-empty-normal{
  margin: 0px;
}
</style>
