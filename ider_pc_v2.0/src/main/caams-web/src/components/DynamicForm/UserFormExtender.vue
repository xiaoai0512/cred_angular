<template>
  <div class="user-form-extender">
    <a-row>
      <a-col :span="6">
        <div class="post-list">
          <a-directory-tree
            :defaultExpandAll="true"
            :selectedKeys="[selectedPost?selectedPost.postPk:undefined]"
            @select="handlePostSelect">
            <a-tree-node title="系统管理岗">
              <a-tree-node
                v-for="item in systemMangerPostList"
                :title="item.postName"
                :key="item.postPk"
                isLeaf/>
            </a-tree-node>
            <a-tree-node title="业务处理岗" @select="handlePostSelect">
              <a-tree-node
                v-for="item in bizHandlePostList"
                :title="item.postName"
                :key="item.postPk"
                isLeaf/>
            </a-tree-node>
          </a-directory-tree>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="post-list">
          <a-directory-tree
            :selectedKeys="[selectedGroup?selectedGroup.groupPk:undefined]"
            :defaultExpandAll="true"
            @select="handleGroupSelect">
            <a-tree-node
              v-for="item in groupList"
              :title="item.groupName"
              :key="item.groupPk"
              isLeaf/>
          </a-directory-tree>
        </div>
      </a-col>
      <a-col :span="2">
        <a-button style="margin-top:150px" type="primary" @click="handlePostGroupSelect">选择>></a-button>
      </a-col>
      <a-col :span="10">
        <div style="padding:10px;">
          <a-table
            :pagination="false"
            :columns="tableColumns"
            :dataSource="selectedPostGroupList"
            bordered
            size="small">
            <span slot="operation" slot-scope="text,record" style="width:100%;display:inline-block;text-align:center">
              <a-button
                @click="()=>handlePostGroupDelete(record)"
                type="primary">删除</a-button>
            </span>
          </a-table>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import HashMap from 'hashmap'
const tableColumns = [
  {
    dataIndex: 'postName',
    title: '岗位名称'
  },
  {
    dataIndex: 'groupName',
    title: '组别名称'
  },
  {
    scopedSlots: { customRender: 'operation' },
    title: '操作'
  }
]
export default {
  name: 'UserFormExtender',
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
      postMap: new HashMap(),
      groupMap: new HashMap(),
      systemMangerPostList: [],
      bizHandlePostList: [],
      groupList: [],
      selectedPost: undefined,
      selectedGroup: undefined,
      selectedPostGroupList: [],
      tableColumns: tableColumns
    }
  },
  watch: {
    tempFormValue: {
      immediate: true,
      handler (newValue) {
        const selectedPostGroupList = this.tempFormValue[this.columnItem.columnName]
        this.selectedPostGroupList = selectedPostGroupList
      }
    }
  },
  created () {
    this.queryAllPost()
  },
  methods: {
    queryAllPost () {
      this.post('/api/postService/queryPost', {}, res => {
        this.systemMangerPostList = res.filter(item => item.postType === '1')
        this.bizHandlePostList = res.filter(item => item.postType === '2')
        res.forEach(item => {
          this.postMap.set(item.postPk, item)
        })
      })
    },
    handlePostSelect (postPk) {
      const post = this.postMap.get(postPk[0])
      this.selectedGroup = undefined
      if (post) {
        this.selectedPost = post
        this.post('/api/postService/queryPostGroup', { postPk: post.postPk }, res => {
          this.groupList = res
          res.forEach(item => { this.groupMap.set(item.groupPk, item) })
        })
      }
    },
    handleGroupSelect (groupPk) {
      const group = this.groupMap.get(groupPk[0])
      if (group) {
        this.selectedGroup = group
      }
    },
    handlePostGroupSelect () {
      if (this.selectedPost && this.selectedGroup) {
        const selectedPostGroupList = this.deepCopy(this.selectedPostGroupList)
        if (selectedPostGroupList.filter(item => item.groupPk === this.selectedGroup.groupPk &&
        item.postPk === this.selectedPost.postPk).length > 0) {
          this.$message.error('请勿重复选择')
          return
        }
        const postGroup = {
          groupPk: this.selectedGroup.groupPk,
          groupName: this.selectedGroup.groupName,
          postPk: this.selectedPost.postPk,
          postName: this.selectedPost.postName
        }
        selectedPostGroupList.push(postGroup)
        this.selectedPostGroupList = selectedPostGroupList
        this.selectedPost = undefined
        this.selectedGroup = undefined
        this.$emit('change', this.columnItem.columnName, selectedPostGroupList)
      }
    },
    handlePostGroupDelete (postGroup) {
      let selectedPostGroupList = this.deepCopy(this.selectedPostGroupList)
      selectedPostGroupList = selectedPostGroupList.filter(item => {
        return item.groupPk !== postGroup.groupPk || item.postPk !== postGroup.postPk
      })
      this.selectedPostGroupList = selectedPostGroupList
      this.$emit('change', this.columnItem.columnName, selectedPostGroupList)
    }
  }
}
</script>
<style scoped>
  .post-list{
    padding: 10px;
    height: 400px;
    overflow: auto;
    margin-top: 10px;
    border: 1px solid #e2e2e2;
    margin-right: 10px;
  }
  .user-form-extender >>> .ant-table-placeholder{
    padding: 15px 15px;
  }
</style>
