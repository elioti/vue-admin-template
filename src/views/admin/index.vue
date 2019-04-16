<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column label="编号" prop="id" sortable="custom" align="center" min-width="50px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理账号" align="center" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="超级用户状态" align="center" min-width="70px">
        <template slot-scope="scope">
          <span><i :class="[scope.row.is_superuser===true?'el-icon-success':'el-icon-error', 'el-alert__icon']" :style="scope.row.is_superuser===true?'color: #67c23a':'color:#333333'"/></span>
        </template>
      </el-table-column>
      <el-table-column label="上次登录" align="center" min-width="195px">
        <template slot-scope="scope">
          <span>{{ scope.row.last_login | datetimeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="288px">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" :rules="setRules" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="会员账号" prop="username">
          <el-input v-model="temp.username"/>
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" label="密码" prop="password">
          <el-input v-model="temp.password" type="password"/>
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" label="密码确认" prop="passwordCheck">
          <el-input v-model="temp.passwordCheck" type="password"/>
        </el-form-item>
        <el-form-item label="超级用户">
          <el-switch v-model="temp.is_superuser" active-color="#13ce66" inactive-color="#ff4949"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUser, createUser, updateUser, delteUser } from '../../api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Admin',
  components: { Pagination },
  filters: {
    statusFilter(flag) {
    },
    datetimeFilter(time) {
      if (time) {
        return time.split('.')[0].replace('T', ' ')
      } else {
        return time
      }
    }
  },
  data() {
    const checkPass = (rule, value, callback) => {
      if (this.temp.passwordCheck && !(this.temp.passwordCheck === value)) {
        callback(new Error('两次密码不一致'))
      } else if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else { callback() }
    }
    const checkCheck = (rule, value, callback) => {
      if (value === this.temp.password) {
        callback()
      } else {
        callback(new Error('两次密码不一致'))
      }
    }
    const checkName = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    return {
      total: 0,
      tableKey: 0,
      list: null,
      listLoading: true,
      downloadLoading: false,
      listQuery: {
        page: 1,
        page_size: 20,
        ordering: '-id'
      },
      textMap: {
        create: '添加',
        update: '编辑'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        id: undefined,
        username: '',
        password: '',
        is_superuser: undefined,
        passwordCheck: ''
      },
      setRules: {
        password: [{ required: true, trigger: 'blur', validator: checkPass }],
        passwordCheck: [{ required: true, trigger: 'blur', validator: checkCheck }],
        username: [{ required: true, trigger: 'blur', validator: checkName }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getUser(this.listQuery).then(response => {
        this.list = response.data.results
        this.total = response.data.count
        this.listLoading = false
      })
    },
    // 处理查询请求
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 处理添加记录
    handleCreate() {
      this.temp = {
        id: undefined,
        username: '',
        password: '',
        is_superuser: undefined,
        passwordCheck: ''
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 处理更改记录
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 处理删除记录
    handleDelete(row) {
      this.$confirm(`该操作会删除账号：${row.username}，是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delteUser(row.id).then(() => {
          // 删除细节  todo
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        if (order === 'ascending') {
          this.listQuery.ordering = 'id'
        } else {
          this.listQuery.ordering = '-id'
        }
        this.handleFilter()
      }
    },
    // 新增记录
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUser(this.temp).then(response => {
            this.list.unshift(response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 更新记录
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateUser(tempData.id, tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
