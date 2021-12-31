<template>
  <div class="module_par">
    <!-- 菜单管理 -->
    <div class="module_top">
      <div class="module_top_con">
        <s-breadcrumb />
      </div>
    </div>
    <div class="module_con">
      <!-- 搜索区域 -->
      <div class="search_box">
        <a-row :gutter="20">
          <a-col :span="6">
            <span class="inpText">菜单名称:</span>
            <a-input v-model="searchBox.name"></a-input>
          </a-col>
          <a-col :span="6">
            <span class="inpText">菜单级别:</span>
            <a-select v-model="searchBox.selOptionSta">
              <a-select-option :value="ele.optionValue" v-for="(ele,index) in searchBox.selOption" :key="index">
                {{ ele.optionName }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <span class="inpText">启用状态:</span>
            <a-select v-model="searchBox.sta">
              <a-select-option :value="ele.optionValue" v-for="(ele,index) in searchBox.selOption2" :key="index">
                {{ ele.optionName }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <a-button type="primary" style="margin-right:20px;" @click="goSearch">查询</a-button>
            <a-button type="primary" style="margin-right:20px;" @click="resetData">重置</a-button>
            <a-button type="primary" style="margin-right:20px;" @click="addDataList">新增</a-button>
          </a-col>
        </a-row>
      </div>
      <!-- 主内容 -->
      <div class="table-content">
        <el-table
          :data="tableData"
          border
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            prop="menuName"
            align="center"
            label="菜单名称">
          </el-table-column>
          <el-table-column
            prop="menuLevel"
            align="center"
            label="菜单级别">
            <template slot-scope="scope">
              <span v-if="scope.row.menuLevel == '1'">一级菜单</span>
              <span v-if="scope.row.menuLevel == '2'">二级菜单</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="menuUrl"
            align="center"
            label="菜单路径">
          </el-table-column>
          <el-table-column
            prop="isDynamicPage"
            align="center"
            label="是否动态">
          </el-table-column>
          <el-table-column
            prop="pagePk"
            align="center"
            label="动态页">
          </el-table-column>
          <el-table-column
            prop="createTime"
            align="center"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="menuType"
            align="center"
            label="启用状态">
            <template slot-scope="scope">
              <span v-if="scope.row.menuType == '1'">是</span>
              <span v-if="scope.row.menuType == '0'">否</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="300"
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="seeData(scope.row)" size="small">详 情</el-button>
              <el-button type="primary" @click="editList(scope.row)" size="small">编 辑</el-button>
              <el-button type="primary" @click="delList(scope.row)" size="small">删 除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="total>0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="tableQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <!-- 新增 -->
      <el-dialog title="新增菜单" :visible.sync="dialogAddSta">
        <el-form :model="addData">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="菜单名称">
                <el-input v-model="addData.name" autocomplete="off" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单级别">
                <el-select v-model="addData.sta" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in addData.optionSta"
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
              <el-form-item label="菜单路径">
                <el-input v-model="addData.path" autocomplete="off" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否启用">
                <el-select v-model="addData.menuSta" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in addData.optionMenuSta"
                    :key="item.optionValue"
                    :label="item.optionName"
                    :value="item.optionValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="addData.sta == '2'">
            <el-col :span="12">
              <el-form-item label="是否动态页">
                <el-select v-model="addData.orSta" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in addData.optionOrSta"
                    :key="item.optionValue"
                    :label="item.optionName"
                    :value="item.optionValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="动态页码">
                <el-select v-model="addData.dtSta" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in addData.optionDtSta"
                    :key="item.optionValue"
                    :label="item.optionName"
                    :value="item.optionValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" v-if="addData.sta == '2'">
              <el-form-item label="父菜单码">
                <el-select v-model="addData.ParSta" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in addData.optionParSta"
                    :key="item.optionValue"
                    :label="item.optionName"
                    :value="item.optionValue">
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
      <!-- 编辑 -->
      <el-dialog title="编辑菜单" :visible.sync="dialogEditSta">
        <el-form :model="editData">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="菜单名称">
                <el-input v-model="editData.name" autocomplete="off" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单级别">
                <el-select v-model="editData.sta" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in editData.optionSta"
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
              <el-form-item label="菜单路径">
                <el-input v-model="editData.path" autocomplete="off" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否启用">
                <el-select v-model="editData.menuSta" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in editData.optionMenuSta"
                    :key="item.optionValue"
                    :label="item.optionName"
                    :value="item.optionValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="editData.sta == '2'">
            <el-col :span="12" v-if="editData.sta == '2'">
              <el-form-item label="是否动态页">
                <el-select v-model="editData.orSta" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in editData.optionOrSta"
                    :key="item.optionValue"
                    :label="item.optionName"
                    :value="item.optionValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="editData.sta == '2'">
              <el-form-item label="动态页码">
                <el-select v-model="editData.dtSta" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in editData.optionDtSta"
                    :key="item.optionValue"
                    :label="item.optionName"
                    :value="item.optionValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="editData.sta == '2'">
            <el-col :span="12" v-if="editData.sta == '2'">
              <el-form-item label="父菜单码">
                <el-select v-model="editData.ParSta" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in editData.optionParSta"
                    :key="item.optionValue"
                    :label="item.optionName"
                    :value="item.optionValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditSta = false" size="small">取 消</el-button>
          <el-button type="primary" @click="editYes" size="small">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 查看详情 -->
      <el-dialog title="菜单详情" :visible.sync="dialogdetaSta">
        <el-form :model="detailsList">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="菜单名称">
                <el-input v-model="detailsList.name" autocomplete="off" size="small" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上级名称">
                <el-input v-model="detailsList.parName" autocomplete="off" size="small" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="菜单级别">
                <el-input v-model="detailsList.level" autocomplete="off" size="small" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单路径">
                <el-input v-model="detailsList.path" autocomplete="off" size="small" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="创建人">
                <el-input v-model="detailsList.creatName" autocomplete="off" size="small" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间">
                <el-input v-model="detailsList.creatTime" autocomplete="off" size="small" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="创建人工号">
                <el-input v-model="detailsList.creatCode" autocomplete="off" size="small" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="修改人">
                <el-input v-model="detailsList.editName" autocomplete="off" size="small" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="修改人工号">
                <el-input v-model="detailsList.editCode" autocomplete="off" size="small" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="修改时间">
                <el-input v-model="detailsList.edtTime" autocomplete="off" size="small" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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
        name: '', // 菜单名称
        selOption: [
          {
            optionValue: '1',
            optionName: '一级菜单'
          },
          {
            optionValue: '2',
            optionName: '二级菜单'
          }
        ], // 菜单级别选项
        selOptionSta: '', // 菜单级别
        selOption2: [
          {
            optionValue: '1',
            optionName: '是'
          },
          {
            optionValue: '0',
            optionName: '否'
          }
        ], // 是否启用选项
        sta: '' // 是否启用
      }, // 搜索相关
      tableData: [], // table数据
      dialogAddSta: false, // 新增菜单控制
      addData: {
        name: '', // 菜单名称
        path: '', // 菜单路径
        sta: '', // 菜单级别
        optionSta: [
          {
            optionValue: '1',
            optionName: '一级菜单'
          },
          {
            optionValue: '2',
            optionName: '二级菜单'
          }
        ], // 菜单级别选项
        dtSta: '', // 动态页码
        optionDtSta: [], // 动态页码选项
        optionParSta: [], // 父级菜单码选项
        ParSta: '', // 父级菜单码
        orSta: '', // 是否动态
        optionOrSta: [
          {
            optionValue: 'T',
            optionName: 'T'
          },
          {
            optionValue: 'F',
            optionName: 'F'
          }
        ], // 是否动态选项
        optionMenuSta: [
          {
            optionValue: '1',
            optionName: '是'
          },
          {
            optionValue: '0',
            optionName: '否'
          }
        ], // 是否启用选项
        menuSta: '' // 是否启用
      },
      dialogEditSta: false, // 编辑菜单控制
      editData: {
        name: '', // 菜单名称
        path: '', // 菜单路径
        sta: '', // 菜单级别
        optionSta: [
          {
            optionValue: '1',
            optionName: '一级菜单'
          },
          {
            optionValue: '2',
            optionName: '二级菜单'
          }
        ], // 菜单级别
        dtSta: '', // 动态页码
        optionDtSta: [], // 动态页码选项
        optionParSta: [], // 父菜单码选项
        ParSta: '', // 父菜单码
        orSta: '', // 是否动态页
        optionOrSta: [
          {
            optionValue: 'T',
            optionName: 'T'
          },
          {
            optionValue: 'F',
            optionName: 'F'
          }
        ], // 是否动态页选项
        optionMenuSta: [
          {
            optionValue: '1',
            optionName: '是'
          },
          {
            optionValue: '0',
            optionName: '否'
          }
        ], // 是否启用选项
        menuSta: '' // 启动状态
      },
      total: 0,
      tableQuery: {
        limit: 5,
        indexNo: 0
      },
      dialogdetaSta: false, // 查看详情弹框控制
      detailsList: {
        name: '', // 菜单名称
        parName: '', // 上级菜单名称
        level: '', // 菜单级别
        path: '', // 菜单路径
        creatName: '', // 创建人
        creatTime: '', // 创建时间
        creatCode: '', // 创建人工号
        editName: '', // 修改人
        editCode: '', // 修改人工号
        edtTime: '' // 修改时间
      }
    }
  },
  methods: {
    // 搜索按钮
    goSearch () {

    },
    addDataList () {
      this.addData.name = ''
      this.addData.path = ''
      this.addData.sta = ''
      this.addData.dtSta = ''
      this.addData.ParSta = ''
      this.addData.orSta = ''
      this.addData.menuSta = ''
      this.dialogAddSta = true
    },
    // 重置按钮
    resetData () {
      this.searchBox.name = ''
      this.searchBox.selOptionSta = ''
      this.searchBox.sta = ''
      this.getTableList()
    },
    // 编辑菜单确定
    editYes () {
      let data
      if (this.editData.sta == '') {
        this.$message.error('请选择菜单级别')
        return false
      }
      if (this.editData.name == '') {
        this.$message.error('请输入菜单名称')
        return false
      }
      if (this.editData.path == '') {
        this.$message.error('请输入菜单路径')
        return false
      }
      if (this.editData.menuSta == '') {
        this.$message.error('请选择是否启用')
        return false
      }
      if (this.editData.sta == '1') {
        // eslint-disable-next-line no-const-assign
        data = {
          menuType: this.editData.menuSta,
          menuName: this.editData.name,
          menuUrl: this.editData.path,
          menuLevel: this.editData.sta,
          parentId: 0
        }
      } else {
        if (this.editData.orSta == '') {
          this.$message.error('请选择是否动态页')
          return false
        }
        if (this.editData.dtSta == '' && this.editData.orSta != '' && this.editData.orSta != 'F') {
          this.$message.error('请选择动态页码')
          return false
        }
        if (this.editData.ParSta == '') {
          this.$message.error('请选择父级菜单码')
          return false
        }
        // eslint-disable-next-line no-unused-vars
        // eslint-disable-next-line no-const-assign
        data = {
          menuType: this.editData.menuSta,
          menuName: this.editData.name,
          menuUrl: this.editData.path,
          menuLevel: this.editData.sta,
          parentId: this.editData.ParSta,
          pagePk: this.editData.dtSta,
          isDynamicPage: this.editData.orSta
        }
      }

      // eslint-disable-next-line no-undef
      ApiService.post('http://10.6.110.18:8088/menu', data, res => {
        if (res.code == '200') {
          this.dialogEditSta = false
        }
      })
    },
    // 查看菜单详情
    seeData (data) {
      console.log(data)
      this.detailsList.name = data.menuName
      this.detailsList.parName = data.menuName
      this.detailsList.level = data.menuLevel == '1' ? '一级菜单' : '二级菜单'
      this.detailsList.path = data.menuUrl
      this.detailsList.creatName = data.createUser
      this.detailsList.creatTime = data.createTime
      this.detailsList.creatCode = data.name
      this.detailsList.editName = data.updateUser
      this.detailsList.editCode = data.name
      this.detailsList.edtTime = data.updateTime
      this.dialogdetaSta = true
    },
    // 新增菜单
    addYes () {
      if (this.addData.sta == '') {
        this.$message.error('请选择菜单级别')
        return false
      }
      if (this.addData.name == '') {
        this.$message.error('请输入菜单名称')
        return false
      }
      if (this.addData.path == '') {
        this.$message.error('请输入菜单路径')
        return false
      }
      if (this.addData.menuSta == '') {
        this.$message.error('请选择是否启用')
        return false
      }
      let data = null
      if (this.addData.sta == '1') {
        // eslint-disable-next-line no-const-assign
        data = {
          menuType: this.addData.menuSta,
          menuName: this.addData.name,
          menuUrl: this.addData.path,
          menuLevel: this.addData.sta,
          parentId: 0
        }
      } else {
        if (this.addData.orSta == '') {
          this.$message.error('请选择是否动态页')
          return false
        }
        if (this.addData.dtSta == '' && this.addData.orSta != '' && this.addData.orSta != 'F') {
          this.$message.error('请选择动态页码')
          return false
        }
        if (this.addData.ParSta == '') {
          this.$message.error('请选择父级菜单码')
          return false
        }
        // eslint-disable-next-line no-unused-vars
        // eslint-disable-next-line no-const-assign
        data = {
          menuType: this.addData.menuSta,
          menuName: this.addData.name,
          menuUrl: this.addData.path,
          menuLevel: this.addData.sta,
          parentId: this.addData.ParSta,
          pagePk: this.addData.dtSta,
          isDynamicPage: this.addData.orSta
        }
      }

      // eslint-disable-next-line no-undef
      ApiService.post('http://10.6.110.18:8088/menu', data, res => {
        if (res.code == '200') {
          this.dialogAddSta = false
          this.getTableList()
          this.getParentPk()
        }
      })
    },
    // 编辑菜单按钮
    editList (data) {
      console.log(data)
      this.dialogEditSta = true
      this.editData.name = data.menuName
      this.editData.path = data.menuUrl
      this.editData.sta = String(data.menuLevel)
      this.editData.dtSta = data.pagePk
      this.editData.ParSta = data.parentId
      this.editData.orSta = data.isDynamicPage
      this.editData.menuSta = data.menuType
    },
    // 删除对应菜单
    delList (val) {
      // const data = {

      // }
      // ApiService.delete('http://47.105.38.207:8088/menu/level1', data)
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
    // 获取父级菜单码
    getParentPk () {
      ApiService.get('http://10.6.110.18:8088/menu/level1', {}, res => {
        console.log(res)
        this.addData.optionParSta = []
        for (const key in res.data) {
          this.addData.optionParSta.push({
            optionValue: res.data[key].id,
            optionName: res.data[key].menuName
          })
          this.editData.optionParSta.push({
            optionValue: res.data[key].id,
            optionName: res.data[key].menuName
          })
        }
      })
    },
    // 获取table数据
    getTableList () {
      // eslint-disable-next-line no-unused-vars
      const data = {
        size: this.tableQuery.limit,
        page: this.tableQuery.indexNo
      }
      ApiService.get('http://10.6.110.18:8088/menu', data, res => {
        this.tableData = []
        for (const key in res.data.content) {
          this.tableData.push(res.data.content[key])
        }
        this.total = res.data.totalElements
      })
    },
    // 获取所有动态页码
    getDtPageList () {
      const data = {
        currentPage: 1,
        gid: 'c6ed25dec81c448eb907b5b3f0349c31',
        modelName: 'com.tansun.magicube.cim.model.dyPage.model.DyPage',
        orderBy: 'create_time desc',
        pageSize: 10000,
        searchConditionJson: "{'openPage': 'T'}"
      }
      ApiService.post('/api/commonCrudService/commonPageQuery', data, res => {
        this.addData.optionDtSta = []
        for (const key in res.data.content) {
          this.addData.optionDtSta.push({
            optionValue: res.data.content[key].pk,
            optionName: res.data.content[key].pageName
          })
          this.editData.optionDtSta.push({
            optionValue: res.data.content[key].pk,
            optionName: res.data.content[key].pageName
          })
        }
      })
    }
  },
  activated () {
    this.getTableList()
    this.getParentPk()
    this.getDtPageList()
  }
}
</script>

<style scoped>
@import '../../assets/css/base.css';
.search_box{
    background: #fff;
    border-radius: 5px;
    padding: 40px 40px 60px 40px;;
    margin: 0 0 20px 0;
}
a-input{
  width: 100px;
}
.ant-input-affix-wrapper{
  display: inline;
}
.ant-input-affix-wrapper .ant-input{
  width: 200px !important;
}
.inpText{
  margin-right: 10px;
}
.el-form-item{
  display: flex;
}
</style>
