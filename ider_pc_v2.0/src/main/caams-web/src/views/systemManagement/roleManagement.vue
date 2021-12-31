<template>
  <!-- 角色管理 -->
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
            <span class="searchTxt">角色名称:</span>
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
          <el-table-column prop="roleName" align="center" label="角色名称"></el-table-column>
          <el-table-column prop="id" align="center" label="id"></el-table-column>
          <el-table-column prop="tenantCode" align="center" label="租户代码"></el-table-column>
          <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
          <el-table-column prop="updateTime" align="center" label="修改时间"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="editData(scope.row)">编辑</el-button>
              <el-button type="primary" size="small" @click="editQX(scope.row)">权限</el-button>
              <el-button type="primary" size="small" @click="seeData(scope.row)">详情</el-button>
            </template>
          </el-table-column>
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
      <el-dialog title="角色编辑" :visible.sync="dialogEditSta">
        <el-form :model="editList">
          <el-row :gutter="20">
            <el-col :span="12">
              <span class="searchTxt">角色名称:</span>
              <el-input v-model="editList.name" autocomplete="off" size="small" class="searchInp"></el-input>
            </el-col>
            <el-col :span="12">
              <span class="searchTxt">角色ID:</span>
              <el-input v-model="editList.id" autocomplete="off" size="small" class="searchInp" :disabled="true"></el-input>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditSta = false" size="small">取 消</el-button>
          <el-button type="primary" @click="editYes" size="small">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 新增 -->
      <el-dialog title="角色新增" :visible.sync="dialogAddSta">
        <el-form :model="addList">
          <el-row :gutter="20">
            <el-col :span="12">
              <span class="searchTxt">角色名称:</span>
              <el-input v-model="addList.name" autocomplete="off" size="small" class="searchInp"></el-input>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddSta = false" size="small">取 消</el-button>
          <el-button type="primary" @click="addYes" size="small">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 详情 -->
      <el-dialog title="详情" :visible.sync="dialogSeeSta">
        <el-form :model="seeDataList">
          <el-row :gutter="20">
            <el-col :span="12">
              <span class="searchTxt">角色名称:</span>
              <el-input v-model="seeDataList.name" disabled autocomplete="off" size="small" class="searchInp"></el-input>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户信息">
                  <el-select v-model="seeDataList.user" multiple disabled placeholder="暂无">
                    <el-option
                      v-for="item in seeDataList.option"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSeeSta = false" size="small">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 权限设置 -->
      <el-dialog title="权限设置" :visible.sync="dialogQxSta">
        <el-form :model="qxDataList">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="权限选择">
                  <el-select v-model="qxDataList.sta" multiple placeholder="请选择">
                    <el-option
                      v-for="item in qxDataList.option"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogQxSta = false" size="small">取 消</el-button>
          <el-button type="primary" @click="qxYes" size="small">确 定</el-button>
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
        name: ''
      }, // 编辑弹框数据
      searchSta: false,
      dialogAddSta: false,
      addList: {
        name: '',
        path: ''
      },
      dataList: {},
      dialogSeeSta: false,
      seeDataList: {
        name: '',
        user: [],
        option: []
      },
      dialogQxSta: false,
      qxDataList: {
        id: '',
        option: [],
        sta: []
      }
    }
  },
  methods: {
    editQX (data) {
      this.qxDataList = {
        id: '',
        option: [],
        sta: []
      }
      this.qxDataList.id = data.id
      this.getUserQxList(data.id)
    },
    getQxDataList () {
      ApiService.get('http://10.6.110.18:8088/permission', {}, res => {
        for (const key in res.data.content) {
          this.qxDataList.option.push({
            label: res.data.content[key].permName,
            value: res.data.content[key].id
          })
        }
        this.dialogQxSta = true
      })
    },
    getUserQxList (id) {
      const data = {
        roleId: id
      }
      ApiService.get('http://10.6.110.18:8088/role/queryPermissionByRoleId', data, res => {
        for (const key in res.data) {
          this.qxDataList.sta.push(res.data[key].id)
        }
        this.getQxDataList()
      })
    },
    qxYes () {
      const data = {
        roleId: this.qxDataList.id,
        permissionIdList: this.qxDataList.sta
      }
      ApiService.post('http://10.6.110.18:8088/relationship/addRPRelation', data, res => {
        this.dialogQxSta = false
        this.getTableList()
      })
    },
    seeData (data) {
      this.seeDataList = {
        name: '',
        user: [],
        option: []
      }
      console.log(data)
      this.seeDataList.name = data.roleName
      this.getSeeDataList(data.id)
    },
    getSeeDataList (id) {
      const data = {
        roleId: id
      }
      ApiService.get('http://10.6.110.18:8088/role/queryUserListByRoleId', data, res => {
        res.data = res.data || []
        if (res.data.length) {
          for (const key in res.data) {
            this.seeDataList.option.push({
              value: res.data[key].userName,
              label: res.data[key].userName
            })
            this.seeDataList.user.push(res.data[key].userName)
          }
        }
        this.dialogSeeSta = true
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
    addData () {
      this.addList.name = ''
      this.addList.path = ''
      this.dialogAddSta = true
    },
    redit () {
      this.searchSta = false
      this.getTableList()
    },
    goSearch () {
      this.searchSta = true
      this.getTableList()
    },
    addYes () {
      const data = {
        roleName: this.addList.name,
        tenantCode: '91310117MA1J196M4B'
      }
      ApiService.post('http://10.6.110.18:8088/role', data, res => {
        this.dialogAddSta = false
        this.getTableList()
      })
    },
    editYes () {
      const data = this.dataList
      data.roleName = this.editList.name
      ApiService.put('http://10.6.110.18:8088/role', data, res => {
        this.dialogEditSta = false
        this.getTableList()
      })
    },
    editData (data) {
      this.dataList = data
      this.editList.id = data.id
      this.editList.name = data.roleName
      this.dialogEditSta = true
    },
    //   获取table数据
    getTableList () {
      const data = {
        tenantCode: '91310117MA1J196M4B',
        roleName: this.searchSta ? this.searchBox.name : '',
        size: this.tableQuery.limit,
        page: this.tableQuery.indexNo
      }
      ApiService.get('http://10.6.110.18:8088/role', data, res => {
        console.log(res)
        this.total = res.data.totalElements
        this.tableData = res.data.content
      })
    }
  },
  activated () {
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
