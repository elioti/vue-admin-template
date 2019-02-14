<template>
  <div class="app-container">
    <div class="header">
      <el-input v-model="param" type="text" placeholder="请输入会员账号" clearable style="width: 30%" @clear="fetchMembers" @keyup.enter.native="fetchMembers">
        <el-button slot="append" icon="el-icon-search" @click="fetchMembers"/>
      </el-input>
      <el-button type="success" icon="el-icon-plus" style="margin-left: 20px" @click="addMember">添加会员</el-button>
      <el-button type="info" @click="addMember">导入execl</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="deleteAllMembers">一键删除</el-button>
    </div>
    <el-table
      v-loading="membersLoading"
      :data="members"
      element-loading-text="获取中"
      border
      fit
      highlight-current-row
      style="margin-top: 20px"
      size="small"
      @selection-change="handleSelectionChange">
      <div slot="empty">暂无数据</div>
      <el-table-column type="selection" min-width="12.5%"/>
      <el-table-column align="center" label="编号" min-width="12.5%">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员账号" min-width="25%">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="抽奖次数" min-width="12.5%">
        <template slot-scope="scope">
          {{ scope.row.number }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" min-width="25%">
        <template slot-scope="scope">
          {{ scope.row.datetime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="25%">
        <template slot-scope="scope">
          <el-button type="primary" @click="editMember(scope.$index)">编辑</el-button>
          <el-button type="danger" @click="deleteMember(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="1000"
      background
      layout="prev, pager, next"
      style="text-align: center;margin-top: 20px"
      @current-change="handleCurrentChange"/>
    <el-dialog
      :title="titleMap[dialogStatus]"
      :visible.sync="dialogFormVisible">
      <el-form :model="member">
        <el-form-item v-if="dialogStatus === 'editMember'" label="礼品编号" >
          {{ member.code }}
        </el-form-item>
        <el-form-item label="会员账号">
          <el-input v-model="member.username"/>
        </el-form-item>
        <el-form-item label="抽奖次数">
          <el-input v-model="member.number"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button @click="dialogConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      membersLoading: true,
      members: null,
      member: {
        code: '',
        username: '',
        number: '',
        datetime: ''
      },
      titleMap: {
        addMember: '新增会员',
        editMember: '编辑会员'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      multipleSelection: [],
      param: '',
      currentPage: 1
    }
  },
  created() {
    this.fetchMembers()
  },
  methods: {
    fetchMembers() {
      if (this.param === '') {
        this.members = [
          { code: 1, username: 'test1', number: 2, datetime: '20190123' },
          { code: 2, username: 'test2', number: 4, datetime: '20190123' }
        ]
      } else {
        this.members = [
          { code: 1, username: 'june1', number: 2, datetime: '20190123' },
          { code: 2, username: 'june2', number: 4, datetime: '20190123' },
          { code: 3, username: 'june3', number: 14, datetime: '20190123' },
          { code: 4, username: 'june4', number: 24, datetime: '20190123' },
          { code: 5, username: 'june5', number: 34, datetime: '20190123' }
        ]
      }
      this.membersLoading = true

      this.membersLoading = false
    },
    addMember() {
      this.dialogFormVisible = true
      this.dialogStatus = 'addMember'
      this.member = {
        code: '',
        username: '',
        number: '',
        datetime: ''
      }
    },
    deleteMember(id) {
      this.members.splice(id, 1)
    },
    editMember(id) {
      this.member = this.members[id]
      this.dialogFormVisible = true
      this.dialogStatus = 'editMember'
    },
    dialogConfirm() {
      this.dialogFormVisible = false
      if (this.dialogStatus === 'editMember') {
        //  api: /member/id put
      } else {
        this.members.push(this.member)
        this.member = {
          code: '',
          name: '',
          prob: ''
        }
        // api: /member post
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    deleteAllMembers() {
      this.$confirm('该操作会永久删除所有信息，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({ type: 'success', message: '删除成功' })
        // api /members delete
        this.members = null
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleCurrentChange(cpage) {
      this.currentPage = cpage
    }
  }
}
</script>

<style scoped>

</style>
