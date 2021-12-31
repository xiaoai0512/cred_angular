/* eslint-disable vue/no-unused-vars */
<template>
  <!-- 机构树 -->
  <div class="module_par">
    <div class="module_top">
      <div class="module_top_con">
        <s-breadcrumb />
      </div>
    </div>
    <el-row class="con" :gutter="20">
      <el-col :span="5">
        <div class="con-left">
          <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" :expand-on-click-node="false" :default-expand-all="true">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <i class="el-icon-menu" v-if="data.code == 'T'"></i>
                <i class="el-icon-office-building" v-if="data.code == 'O'"></i>
                <i class="el-icon-school" v-if="data.code == 'D'"></i>
                <i class="el-icon-user" v-if="data.code == 'P'"></i>
                {{ node.label }}
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="19">
        <div class="con-right">
          <el-row :gutter="20" class="con-right-top">
            <el-col :span="8">
              <span class="tit">{{ tit }}</span>
            </el-col>
            <el-col :span="16" style="text-align: right;">
              <el-button type="primary" class="searchBtn" @click="addDataSta()" size="small" v-if="dataList.code == ''">新增</el-button>
              <el-button type="primary" class="searchBtn" @click="addDataSta()" size="small" v-if="dataList.code != 'P'">新增</el-button>
              <el-button type="primary" class="searchBtn" @click="addDataUser()" size="small" v-if="dataList.code == 'P'">新增</el-button>
              <el-button type="primary" class="searchBtn" @click="editData()" size="small">编辑</el-button>
              <el-button type="primary" class="searchBtn" @click="deleData()" size="small">删除</el-button>
            </el-col>
          </el-row>
          <div class="con-right-bot">
            <el-table :data="tableData" border tooltip-effect="dark" style="width: 100%">
              <el-table-column prop="userName" align="center" label="用户名"></el-table-column>
              <el-table-column prop="userCode" align="center" label="用户码"></el-table-column>
              <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
              <el-table-column prop="updateTime" align="center" label="修改时间"></el-table-column>
              <!-- <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="editData(scope.row)">编辑</el-button>
                </template>
              </el-table-column> -->
            </el-table>
            <!-- <el-pagination
              v-show="total>0"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[5, 10, 15, 420]"
              :page-size="tableQuery.limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination> -->
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 新增 -->
      <el-dialog title="新增" :visible.sync="dialogAddSta">
        <el-form :model="addList">
          <el-row :gutter="20">
            <el-col :span="12" v-if="this.dataList.code != 'P'">
              <span class="searchTxt">类型选择:</span>
              <el-select v-model="addList.type" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in addList.optionType"
                    :key="item.optionValue"
                    :label="item.optionName"
                    :value="item.optionValue">
                  </el-option>
                </el-select>
            </el-col>
            <el-col :span="12">
              <span class="searchTxt">{{ addList.type }}名称:</span>
              <el-input v-model="addList.name" autocomplete="off" size="small" class="searchInp"></el-input>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddSta = false" size="small">取 消</el-button>
          <el-button type="primary" @click="addYes" size="small">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 新增人 -->
      <el-dialog title="新增用户" :visible.sync="dialogAddUserSta">
        <el-form :model="addListUser">
          <el-row :gutter="20">
            <el-row>
              <el-col>
                <el-form-item label="用户选择">
                  <el-select v-model="addListUser.user" multiple placeholder="请选择">
                    <el-option
                      v-for="item in addListUser.option"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddUserSta = false" size="small">取 消</el-button>
          <el-button type="primary" @click="addUserYes" size="small">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑 -->
      <el-dialog title="编辑" :visible.sync="dialogEditSta">
        <el-form :model="editList">
          <el-row :gutter="20">
            <el-col :span="12">
              <span class="searchTxt">名称:</span>
              <el-input v-model="editList.name" autocomplete="off" size="small" class="searchInp"></el-input>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditSta = false" size="small">取 消</el-button>
          <el-button type="primary" @click="editYes" size="small">确 定</el-button>
        </div>
      </el-dialog>
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
  // T  根节点   O  机构  D 部门    P 岗位  code判断
  data () {
    return {
      dataList: {},
      treeData: [],
      defaultProps: {
        children: 'subGroup',
        label: 'name'
      },
      tit: '',
      dialogAddSta: false,
      dialogAddUserSta: false,
      addList: {
        name: '',
        type: '',
        optionType: []
      },
      addListUser: {
        user: [],
        option: []
      },
      tableUserList: [],
      tableData: [],
      dialogEditSta: false,
      editList: {
        name: ''
      }
    }
  },
  methods: {
    editData () {
      this.editList.name = this.dataList.name
      this.dialogEditSta = true
    },
    editYes () {
      // eslint-disable-next-line no-unused-vars
      const data = this.dataList
      data.name = this.editList.name
      // eslint-disable-next-line no-unused-vars
      let url = null
      if (this.dataList.code == 'P') {
        // data = {
        //   id: this.dataList.id,
        //   tenantCode: '88888888',
        //   postName: this.editList.name,
        //   parentId: this.dataList.parentId
        // }
        data.postName = this.editList.name
        url = 'http://10.6.110.18:8088/post'
      } else if (this.dataList.code == 'O') {
        // data = {
        //   id: this.dataList.id,
        //   tenantCode: '88888888',
        //   name: this.editList.name,
        //   type: this.dataList.type,
        //   parentId: this.dataList.parentId,
        //   lft: this.dataList.lft,
        //   rgt: this.dataList.rgt
        // }
        url = 'http://10.6.110.18:8088/organization'
      } else if (this.dataList.code == 'D') {
        // data = {
        //   id: this.dataList.id,
        //   tenantCode: '88888888',
        //   deptName: this.editList.name,
        //   parentId: this.dataList.parentId
        // }
        url = 'http://10.6.110.18:8088/dept'
      }
      ApiService.put(url, data, res => {
        this.dialogEditSta = false
      })
    },
    deleData () {
      // const data = {
      //   nodeId: this.dataList.id
      // }
      ApiService.dele('http://10.6.110.18:8088/tree/deleteNode/' + this.dataList.id, {}, res => {
        this.getTreeList()
      })
    },
    getUserList () {
      const data = {
        tenantCode: '91310117MA1J196M4B'
      }
      ApiService.get('http://10.6.110.18:8088/user', data, res => {
        for (const key in res.data.content) {
          this.addListUser.option.push({
            value: res.data.content[key].id,
            label: res.data.content[key].userName
          })
          if (this.tableUserList.length) {
            for (const key2 in this.tableUserList) {
              if (this.tableUserList[key2].userCode == res.data.content[key].userCode) {
                this.addListUser.user.push(res.data.content[key].id)
              }
            }
          }
        }
        this.dialogAddUserSta = true
      })
    },
    getTableUserList () {
      const data = {
        postId: this.dataList.id
      }
      ApiService.get('http://10.6.110.18:8088/post/queryUserByPostId', data, res => {
        this.tableUserList = res.data || []
        this.tableData = res.data || []
      })
    },
    addUserYes () {
      console.log(this.addListUser.user)
      const data = {
        postId: this.dataList.id,
        userIdList: this.addListUser.user
      }
      ApiService.post('http://10.6.110.18:8088/relationship/addUPRelation', data, res => {
        this.dialogAddUserSta = false
        this.getTableUserList()
      })
    },
    addDataUser () {
      this.addListUser = {
        option: [],
        user: []
      }
      this.getUserList()
    },
    addYes () {
      // 新增
      if (this.addList.type == '机构') {
        const data = {
          tenantCode: '91310117MA1J196M4B',
          name: this.addList.name,
          type: this.addList.type == '机构' ? '1' : '', // 0 总行  1 支行
          parentId: this.dataList.id
        }
        ApiService.post('http://10.6.110.18:8088/organization', data, res => {
          console.log(res)
          this.getTreeList()
          this.dialogAddSta = false
        })
      } else if (this.addList.type == '部门') {
        const data = {
          tenantCode: '91310117MA1J196M4B',
          deptName: this.addList.name,
          parentId: this.dataList.id
        }
        ApiService.post('http://10.6.110.18:8088/dept', data, res => {
          console.log(res)
          this.getTreeList()
          this.dialogAddSta = false
        })
      } else if (this.addList.type == '岗位') {
        const data = {
          tenantCode: '91310117MA1J196M4B',
          postName: this.addList.name,
          parentId: this.dataList.id
        }
        ApiService.post('http://10.6.110.18:8088/post', data, res => {
          console.log(res)
          this.getTreeList()
          this.dialogAddSta = false
        })
      }
    },
    addDataSta () {
      if (this.dataList.code == 'T') {
        this.addList.optionType = [{
          optionValue: '机构',
          optionName: '机构'
        }]
      } else if (this.dataList.code == 'O') {
        this.addList.optionType = [{
          optionValue: '部门',
          optionName: '部门'
        }, {
          optionValue: '岗位',
          optionName: '岗位'
        }, {
          optionValue: '机构',
          optionName: '机构'
        }]
      } else if (this.dataList.code == 'D') {
        this.addList.optionType = [{
          optionValue: '岗位',
          optionName: '岗位'
        }]
      }
      this.dialogAddSta = true
    },
    handleNodeClick (data) {
      console.log(data)
      this.dataList = data
      this.tit = data.name
      this.tableData = []
      if (this.dataList.code == 'P') {
        this.getTableUserList()
      } else {

      }
    },
    // getByNodeId () {
    //   const data = {
    //     nodeId: ''
    //   }
    //   ApiService.post('http://10.6.110.18:8088/post/queryUserByNodeId', data, res => {
    //     // this.tableUserList = res.data || []
    //     this.tableData = res.data || []
    //   })
    // },
    getTreeList () {
      const data = {
        parentId: '8b666547bfd343108b8e900e35cf94d9'
      }
      ApiService.get('http://10.6.110.18:8088/tree/listAllGroup', data, res => {
        console.log(res)
        this.treeData = res.data
      })
    }
  },
  activated () {
    this.getTreeList()
  }
}
</script>

<style scoped>
@import '../../assets/css/base.css';
.con{
    margin-top: 10px;
    padding: 0 24px;
}
.con-left{
    width: 100%;
    height: 80vh;
    background-color: #fff;
    overflow: hidden;
    overflow-y: scroll;
    padding: 20px 15px;
}
/*修改滚动条样式*/
.con-left::-webkit-scrollbar{
  width: 6px;
  height: 100%;
}
.con-left::-webkit-scrollbar-track{
  background: rgb(239, 239, 239);
  border-radius:2px;
}
.con-left::-webkit-scrollbar-thumb{
  background: #bfbfbf;
  border-radius:10px;
}
.con-left::-webkit-scrollbar-thumb:hover{
  background: #333;
}
.con-left::-webkit-scrollbar-corner{
  background: #179a16;
}
.con-right{
    width: 100%;
    height: 80vh;
    background-color: #fff;
}
.con-right-top{
  padding:20px;
  border-bottom: 2px solid #f0f2f5;
}
.tit{
  display: inline-block;
  width: 100%;
  font-size: 18px;
  color: black;
}
.custom-tree-node i{
  color: #0d78be;
}
</style>
