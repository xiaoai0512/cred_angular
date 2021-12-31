<template>
  <!-- 接口管理 -->
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
            <span class="searchTxt">接口名称:</span>
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
          <el-table-column prop="apiName" align="center" label="接口名称"></el-table-column>
          <el-table-column prop="apiUrl" align="center" label="接口地址"></el-table-column>
          <el-table-column prop="createUser" align="center" label="创建人"></el-table-column>
          <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
          <el-table-column prop="updateUser" align="center" label="修改人"></el-table-column>
          <el-table-column prop="updateTime" align="center" label="修改时间"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="editData(scope.row)">编辑</el-button>
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
      <el-dialog title="接口编辑" :visible.sync="dialogEditSta">
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
      <el-dialog title="新增" :visible.sync="dialogAddSta">
        <el-form :model="addList">
          <el-row :gutter="20">
            <el-col :span="12">
              <span class="searchTxt">接口名称:</span>
              <el-input v-model="addList.name" autocomplete="off" size="small" class="searchInp"></el-input>
            </el-col>
            <el-col :span="12">
              <span class="searchTxt">接口地址:</span>
              <el-input v-model="addList.path" autocomplete="off" size="small" class="searchInp"></el-input>
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
      searchSta: false,
      dialogAddSta: false,
      addList: {
        name: '',
        path: ''
      }
    }
  },
  methods: {
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
        apiName: this.addList.name,
        apiUrl: this.addList.path
      }
      ApiService.post('http://10.6.110.18:8088/api/interface', data, res => {
        this.dialogAddSta = false
        this.getTableList()
      })
    },
    editYes () {
      const data = {
        id: this.editList.id,
        apiName: this.editList.name,
        apiUrl: this.editList.path
      }
      ApiService.put('http://10.6.110.18:8088/api/interface', data, res => {
        this.dialogEditSta = false
        this.getTableList()
      })
    },
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
        apiName: this.searchSta ? this.searchBox.name : ''
      }
      ApiService.get('http://10.6.110.18:8088/api/interface', data, res => {
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
