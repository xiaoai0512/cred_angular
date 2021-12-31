<template>
  <!-- 权限管理 -->
  <div class="module_par">
    <div class="module_top">
      <div class="module_top_con">
        <s-breadcrumb />
      </div>
    </div>
    <div class="module_con">
      <!-- 搜索区域 -->
      <div class="search_box">
        <el-row :gutter="20" class="box_center">
          <el-col>
            <span class="searchTxt">权限名称:</span>
            <el-input v-model="searchBox.name" autocomplete="off" size="small" class="searchInp"></el-input>
            <el-button type="primary" class="searchBtn" @click="goSearch()" size="small">查询</el-button>
            <el-button type="primary" class="searchBtn reditBtn" @click="redit()" size="small">重置</el-button>
            <el-button type="primary" class="searchBtn reditBtn" @click="addData()" size="small">新增</el-button>
          </el-col>
        </el-row>
      </div>
      <!-- 主体内容 -->
      <div class="table-content">
        <el-table :data="tableData" border tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="permName" align="center" label="权限名称"></el-table-column>
          <el-table-column prop="eleType" align="center" label="元素类型"></el-table-column>
          <el-table-column prop="operType" align="center" label="操作类型"></el-table-column>
          <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
          <el-table-column prop="updateTime" align="center" label="修改时间"></el-table-column>
          <!-- <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="editData(scope.row)">编辑</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <el-pagination
          v-show="total>0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 15, 420]"
          :page-size="tableQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <!-- 编辑 -->
      <el-dialog title="权限编辑" :visible.sync="dialogEditSta">
        <el-form :model="editList">
          <el-row :gutter="20">
            <el-col :span="12">
              <span class="searchTxt">接口名称:</span>
              <el-input v-model="editList.name" autocomplete="off" size="small" class="searchInp"></el-input>
            </el-col>
            <el-col :span="12">
              <span class="searchTxt">接口地址:</span>
              <el-input v-model="editList.path" autocomplete="off" size="small" class="searchInp"></el-input>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditSta = false" size="small">取 消</el-button>
          <el-button type="primary" @click="editYes" size="small">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 新增 -->
      <el-dialog title="权限新增" :visible.sync="dialogAddSta">
        <el-form :model="addList">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="权限名称">
                <el-input v-model="addList.name" autocomplete="off" size="small" class="searchInp"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单ID">
                <el-select v-model="addList.menuId" value-key="optionValue" placeholder="请选择" size="small" @change="setParentId">
                  <el-option
                    v-for="item in addList.optionMenuId"
                    :key="item.optionValue"
                    :label="item.optionName"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="元素类型">
                <el-select v-model="addList.eleType" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in addList.optionEleType"
                    :key="item.paramCode"
                    :label="item.paramName"
                    :value="item.paramCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="系统接口">
                <el-select v-model="addList.apiId" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in addList.optionApiId"
                    :key="item.optionValue"
                    :label="item.optionName"
                    :value="item.optionValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="操作类型">
                <el-select v-model="addList.operType" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in addList.optionOperType"
                    :key="item.paramCode"
                    :label="item.paramName"
                    :value="item.paramCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddSta = false" size="small">取 消</el-button>
          <el-button type="primary" @click="addYes" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ApiService from '@/api/api-service'
import Breadcrumb from '@/components/tools/Breadcrumb'
Vue.use(Element)
export default {
  components: {
    's-breadcrumb': Breadcrumb
  },
  data () {
    return {
      searchBox: {
        name: ''
      }, // 搜索内容
      tableData: [], // table数据
      total: 0,
      tableQuery: {
        limit: 5,
        indexNo: 0
      },
      dialogEditSta: false, // 编辑弹框判断
      editList: {
        id: '',
        name: '',
        path: ''
      }, // 编辑弹框数据
      searchSta: false, // 搜索状态判断
      dialogAddSta: false,
      addList: {
        name: '', // 权限名称
        menuId: '', // 菜单ID
        menuParentId: '', // 菜单父ID
        optionMenuId: [], // 菜单ID选项
        eleType: '', // 页面元素类型
        optionEleType: [], // 页面元素类型选项
        apiId: '', // 系统接口ID
        optionApiId: [], // 系统接口ID选项
        operType: '', // 操作类型
        optionOperType: [] // 操作类型选项
      }
    }
  },
  methods: {
    setParentId (val) {
      console.log(val)
      this.addList.menuId = val.optionValue
      this.addList.menuParentId = val.menuParentId
    },
    getMenuId () {
      this.addList.optionMenuId = []
      ApiService.get('http://10.6.110.18:8088/menu/level2', {}, res => {
        for (const key in res.data) {
          this.addList.optionMenuId.push({
            optionValue: res.data[key].id,
            optionName: res.data[key].menuName,
            menuParentId: res.data[key].parentId
          })
        }
      })
    },
    getHttpPath () {
      this.addList.optionApiId = []
      ApiService.get('http://10.6.110.18:8088/api/interface', {}, res => {
        for (const key in res.data.content) {
          this.addList.optionApiId.push({
            optionValue: res.data.content[key].id,
            optionName: res.data.content[key].apiName
          })
        }
      })
    },
    getOptionList () {
      const data = {
        groupCodeList: ['ELE_TYPE', 'OPER_TYPE']
      }
      ApiService.post('/api/paramTrade/paramData', data, res => {
        for (const key in res.data) {
          if (res.data[key].groupCode == 'ELE_TYPE') {
            this.addList.optionEleType = res.data[key].paramList
          }
          if (res.data[key].groupCode == 'OPER_TYPE') {
            this.addList.optionOperType = res.data[key].paramList
          }
        }
      })
    },
    handleSizeChange (val) {
      console.log(val)
      this.tableQuery.limit = val
      this.tableQuery.indexNo = 0
      this.getTableList()
    },
    handleCurrentChange (val) {
      this.tableQuery.indexNo = val - 0 - 1
      this.getTableList()
    },
    //   新增按钮
    addData () {
      this.addList.name = ''
      this.addList.menuId = ''
      this.addList.menuParentId = ''
      this.addList.eleType = ''
      this.addList.apiId = ''
      this.addList.operType = ''
      this.dialogAddSta = true
    },
    // 新增确定
    addYes () {
      const data = {
        permName: this.addList.name,
        menuId: this.addList.menuId,
        menuParentId: this.addList.menuParentId,
        eleType: this.addList.eleType,
        apiId: this.addList.apiId,
        operType: this.addList.operType
      }
      ApiService.post('http://10.6.110.18:8088/permission', data, res => {
        this.getTableList()
        this.dialogAddSta = false
      })
    },
    // 重置按钮
    redit () {
      this.searchBox.name = ''
      this.searchSta = false
      this.getTableList()
    },
    // 搜索按钮
    goSearch () {
      this.searchSta = true
      this.getTableList()
    },
    // 编辑弹框确定
    editYes () {
      const data = {
        id: this.editList.id,
        apiName: this.editList.name,
        apiUrl: this.editList.path
      }
      ApiService.put('http://10.6.110.18:8088/api/interface', data, res => {
        this.dialogEditSta = false
      })
    },
    // 编辑按钮
    editData (data) {
      this.editList.id = data.id
      this.editList.name = data.apiName
      this.editList.path = data.apiUrl
      this.dialogEditSta = true
    },
    //   获取table数据
    getTableList () {
      const data = {
        size: this.tableQuery.limit,
        page: this.tableQuery.indexNo,
        permName: this.searchSta ? this.searchBox.name : ''
      }
      ApiService.get('http://10.6.110.18:8088/permission', data, res => {
        console.log(res)
        this.tableData = res.data.content
        this.total = res.data.totalElements
      })
    }
  },
  activated () {
    this.getMenuId()
    this.getHttpPath()
    this.getOptionList()
    this.getTableList()
  }
}
</script>

<style scoped>
@import '../../assets/css/base.css';
.search_box {
  background: #fff;
  border-radius: 5px;
  padding: 40px 40px 60px 40px;
  margin: 0 0 20px 0;
}
.box_center {
  text-align: left;
}
.searchBtn {
  margin-left: 80px;
}
.reditBtn {
  margin-left: 20px;
}
</style>
