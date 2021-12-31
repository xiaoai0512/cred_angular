<template>
  <!-- 用户管理 -->
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
            <span class="searchTxt">用户名称:</span>
            <el-input v-model="searchBox.name" autocomplete="off" size="small" class="searchInp"></el-input>
            <span class="searchTxt" style="margin-left: 60px;">用户码:</span>
            <el-input v-model="searchBox.code" autocomplete="off" size="small" class="searchInp"></el-input>
            <el-button type="primary" class="searchBtn" @click="goSearch()" size="small">查询</el-button>
            <el-button type="primary" class="searchBtn reditBtn" @click="redit()" size="small">重置</el-button>
            <el-button type="primary" class="searchBtn reditBtn" @click="addData()" size="small">新增</el-button>
          </el-col>
        </el-row>
      </div>
      <!-- 主体内容 -->
      <div class="table-content">
        <el-table :data="tableData" border tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="userName" align="center" label="用户名称"></el-table-column>
          <el-table-column prop="userCode" align="center" label="用户码"></el-table-column>
          <el-table-column prop="createUser" align="center" label="创建人"></el-table-column>
          <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
          <el-table-column prop="updateUser" align="center" label="修改人"></el-table-column>
          <el-table-column prop="updateTime" align="center" label="修改时间"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="editData(scope.row)">编辑</el-button>
              <el-button type="primary" size="small" @click="jsData(scope.row)">角色</el-button>
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
      <el-dialog title="用户编辑" :visible.sync="dialogEditSta">
        <el-form :model="editList">
          <el-row :gutter="20">
            <el-col :span="12">
              <span class="searchTxt">用户名称:</span>
              <el-input v-model="editList.name" autocomplete="off" size="small" class="searchInp"></el-input>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditSta = false" size="small">取 消</el-button>
          <el-button type="primary" @click="editYes" size="small">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 新增 -->
      <el-dialog title="新增" :visible.sync="dialogAddSta">
        <el-form :model="addList">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户名称">
                <el-input v-model="addList.name" autocomplete="off" size="small" class="searchInp"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户码">
                <el-input v-model="addList.code" autocomplete="off" size="small" class="searchInp"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="密码">
                <el-input v-model="addList.pas" autocomplete="off" size="small" class="searchInp" show-password></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddSta = false" size="small">取 消</el-button>
          <el-button type="primary" @click="addYes" size="small">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 设置角色 -->
      <el-dialog title="角色设置" :visible.sync="dialogJsSta">
        <el-form :model="jsDataList">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="角色选择">
                  <el-select v-model="jsDataList.sta" multiple placeholder="请选择">
                    <el-option
                      v-for="item in jsDataList.option"
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
          <el-button @click="dialogJsSta = false" size="small">取 消</el-button>
          <el-button type="primary" @click="jsYes" size="small">确 定</el-button>
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
        name: '',
        code: ''
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
      searchSta: false,
      dialogAddSta: false,
      addList: {
        name: '',
        code: '',
        pas: ''
      },
      dataList: {},
      jsDataList: {
        id: '',
        sta: [],
        option: []
      },
      dialogJsSta: false
    }
  },
  methods: {
    jsYes () {
      const data = {
        userId: this.jsDataList.id,
        roleIdList: this.jsDataList.sta
      }
      ApiService.post('http://10.6.110.18:8088/relationship/addURRelation', data, res => {
        this.dialogJsSta = false
      })
    },
    jsData (val) {
      this.jsDataList = {
        id: '',
        sta: [],
        option: []
      }
      this.jsDataList.id = val.id
      this.getUserJsDataList(val.id)
    },
    getJsDataList () {
      const data = {
        tenantCode: '91310117MA1J196M4B'
      }
      ApiService.get('http://10.6.110.18:8088/role', data, res => {
        for (const key in res.data.content) {
          this.jsDataList.option.push({
            label: res.data.content[key].roleName,
            value: res.data.content[key].id
          })
        }
        this.dialogJsSta = true
      })
    },
    getUserJsDataList (id) {
      const data = {
        userId: id
      }
      ApiService.get('http://10.6.110.18:8088/user/queryRoleListByUserId', data, res => {
        if (res.data != null) {
          for (const key in res.data) {
            this.jsDataList.sta.push(res.data[key].id)
          }
        }
        this.getJsDataList()
      })
    },
    delData (val) {
      ApiService.dele('http://10.6.110.18:8088/user/' + val.id, {}, res => {
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
    addData () {
      this.addList = {
        name: '',
        code: '',
        pas: ''
      }
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
        userCode: this.addList.code,
        userName: this.addList.name,
        password: this.$md5(this.addList.pas),
        tenantCode: '91310117MA1J196M4B',
        isEncryption: '1'
      }
      ApiService.post('http://10.6.110.18:8088/user', data, res => {
        this.dialogAddSta = false
        this.getTableList()
      })
    },
    editYes () {
      this.dataList.userName = this.editList.name
      ApiService.put('http://10.6.110.18:8088/user', this.dataList, res => {
        this.dialogEditSta = false
        this.getTableList()
      })
    },
    editData (data) {
      this.dataList = data
      this.editList.name = data.userName
      this.dialogEditSta = true
    },
    //   获取table数据
    getTableList () {
      const data = {
        userCode: this.searchSta ? this.searchBox.code : '',
        userName: this.searchSta ? this.searchBox.name : '',
        tenantCode: '91310117MA1J196M4B',
        size: this.tableQuery.limit,
        page: this.tableQuery.indexNo
      }
      ApiService.get('http://10.6.110.18:8088/user', data, res => {
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
