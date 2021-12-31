<template>
  <!-- 用户组管理管理 -->
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
            <span class="searchTxt">用户组名称:</span>
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
          <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
          <el-table-column prop="groupName" align="center" label="用户组名称"></el-table-column>
          <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
          <el-table-column prop="updateTime" align="center" label="修改时间"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="editData(scope.row)">编辑</el-button>
              <el-button type="primary" size="small" @click="addToData(scope.row)">添加</el-button>
              <!-- <el-button type="primary" size="small" @click="editRoleData(scope.row)">角色</el-button> -->
              <el-button type="primary" size="small" @click="delData(scope.row)">删除</el-button>
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
      <el-dialog title="权限编辑" :visible.sync="dialogEditSta" class="dia">
        <el-form :model="editList">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户组名称">
                <el-input v-model="editList.name" autocomplete="off" size="small" class="searchInp"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditSta = false" size="small">取 消</el-button>
          <el-button type="primary" @click="editYes" size="small">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 新增 -->
      <el-dialog title="用户组新增" :visible.sync="dialogAddSta">
        <el-form :model="addList">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户组名称">
                <el-input v-model="addList.name" autocomplete="off" size="small" class="searchInp"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddSta = false" size="small">取 消</el-button>
          <el-button type="primary" @click="addYes" size="small">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加用户 -->
      <el-dialog title="添加用户" :visible.sync="dialogAddToSta">
        <el-form :model="addToDataList">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户选择">
                  <el-select v-model="addToDataList.sta" multiple placeholder="请选择">
                    <el-option
                      v-for="item in addToDataList.option"
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
          <el-button @click="dialogAddToSta = false" size="small">取 消</el-button>
          <el-button type="primary" @click="jhYes" size="small">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 设置角色 -->
      <el-dialog title="设置角色" :visible.sync="dialogEditRoleSta">
        <el-form :model="editRole">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户选择">
                  <el-select v-model="editRole.sta" multiple placeholder="请选择">
                    <el-option
                      v-for="item in editRole.option"
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
          <el-button @click="dialogEditRoleSta = false" size="small">取 消</el-button>
          <!-- <el-button type="primary" @click="jsYes" size="small">确 定</el-button> -->
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
        name: '' // 权限名称
      },
      dataList: {},
      dialogAddToSta: false,
      addToDataList: {
        id: '',
        option: [],
        sta: []
      },
      editRole: {
        id: '',
        option: [],
        sta: []
      },
      dialogEditRoleSta: false
    }
  },
  methods: {
    editRoleData (val) {

    },
    addToData (val) {
      this.addToDataList = {
        id: '',
        option: [],
        sta: []
      }
      this.addToDataList.id = val.id
      this.getAddToUserData(val.id)
    },
    jhYes () {
      const data = {
        grouoId: this.addToDataList.id,
        userIdList: this.addToDataList.sta
      }
      ApiService.post('http://10.6.110.18:8088/relationship/addGURelation ', data, res => {
        this.dialogAddToSta = false
        this.getTableList()
      })
    },
    getAddToDataList () {
      const data = {
        tenantCode: '91310117MA1J196M4B'
      }
      ApiService.get('http://10.6.110.18:8088/user', data, res => {
        for (const key in res.data.content) {
          this.addToDataList.option.push({
            value: res.data.content[key].id,
            label: res.data.content[key].userName
          })
        }
        this.dialogAddToSta = true
      })
    },
    getAddToUserData (val) {
      const data = {
        userGroupId: val
      }
      ApiService.get('http://10.6.110.18:8088/userGroup/queryUserListByGroupId', data, res => {
        for (const key in res.data) {
          this.addToDataList.sta.push(res.data[key].id)
        }
        this.getAddToDataList()
      })
    },
    // 获取所有用户信息
    getGenerateData () {
      const data = {

      }
      ApiService.post('', data, res => {
        console.log(res)
        if (res.code == '200') {

        }
      })
    },
    // 获取用户组信息
    getUserZuData () {
      const data = {

      }
      ApiService.post('', data, res => {
        if (res.code == '200') {

        }
      })
    },
    // 删除用户组
    delData (val) {
      ApiService.dele('http://10.6.110.18:8088/userGroup/' + val.id, {}, res => {
        console.log(res)
        this.getTableList()
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
      this.dialogAddSta = true
    },
    // 新增确定
    addYes () {
      const data = {
        groupName: this.addList.name,
        tenantCode: '91310117MA1J196M4B'
      }
      ApiService.post('http://10.6.110.18:8088/userGroup', data, res => {
        this.dialogAddSta = false
        this.getTableList()
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
      this.dataList.groupName = this.editList.name
      ApiService.put('http://10.6.110.18:8088/userGroup', this.dataList, res => {
        this.dialogEditSta = false
        this.getTableList()
      })
    },
    // 编辑按钮
    editData (data) {
      this.dataList = data
      this.editList.id = data.id
      this.editList.name = data.groupName
      this.dialogEditSta = true
    },
    //   获取table数据
    getTableList () {
      const data = {
        size: this.tableQuery.limit,
        page: this.tableQuery.indexNo,
        tenantCode: '91310117MA1J196M4B',
        groupName: this.searchSta ? this.searchBox.name : ''
      }
      ApiService.get('http://10.6.110.18:8088/userGroup', data, res => {
        console.log(res)
        this.tableData = res.data.content
        this.total = res.data.totalElements
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
