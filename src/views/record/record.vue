<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.user" placeholder="请输入会员账号" style="width: 200px" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">下载</el-button>
      <el-button class="filter-item" type="primary">一键派送</el-button>
      <el-button class="filter-item" type="danger">一键清空</el-button>
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
      <el-table-column label="编号" prop="id" sortable="custom" align="center" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员账号" align="center" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中奖ID" align="center" min-width="70px">
        <template slot-scope="scope">
          <span>{{ scope.row.prizeId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中奖礼品" align="center" min-width="195px">
        <template slot-scope="scope">
          <span>{{ scope.row.prizeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中奖时间" align="center" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.datetime | datetimeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="抽奖方式" class-name="status-col" min-width="96px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type | typeToColor">{{ scope.row.type | typeToText }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="抽奖IP" align="center" min-width="130px">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否发送" align="center" min-width="96px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isSend | sendToColor">{{ scope.row.isSend | sendToText }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发送时间" align="center" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.sendTime | datetimeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="288px">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.isSend === 1" type="primary" @click="handleSend(scope.$index, scope.row.id)">派送</el-button>
          <el-button type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="会员账号">
          <el-input v-model="temp.user"/>
        </el-form-item>
        <el-form-item label="中奖礼品">
          <el-input v-model="temp.prizeId"/>
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'create'" label="中奖时间" prop="datetime">
          <el-date-picker v-model="temp.datetime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间"/>
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
import { getRecord, createRecord, updateRecord, delteRecord } from '../../api/record'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: { Pagination },
  filters: {
    typeToColor(type) {
      const types = ['success', 'info', 'danger']
      return types[parseInt(type)]
    },
    typeToText(type) {
      const types = ['自然抽奖', '内定抽奖', '后台添加']
      return types[parseInt(type)]
    },
    sendToColor(status) {
      const types = ['warning', 'success']
      return types[parseInt(status)]
    },
    sendToText(status) {
      const types = ['未送出', '已送出']
      return types[parseInt(status)]
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
    return {
      total: 0,
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        user: undefined,
        ordering: '-id'
      },
      downloadLoading: false,
      textMap: {
        create: '添加',
        update: '编辑'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        id: undefined,
        user: '',
        prizeId: undefined,
        datetime: new Date()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getRecord(this.listQuery).then(response => {
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
        user: '',
        prizeId: undefined,
        datetime: new Date()
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
      delteRecord(row.id).then(() => {
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
    },
    // 处理下载Excel请求
    handleDownload() {},
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
          createRecord(this.temp).then(response => {
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
          console.log(tempData)
          updateRecord(tempData.id, tempData).then(() => {
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
    },
    // 处理派送
    handleSend(index, id) {
      const data = {
        isSend: 1,
        sendTime: new Date()
      }
      updateRecord(id, data).then(response => {
        for (const v of this.list) {
          if (v.id === id) {
            const index = this.list.indexOf(v)
            this.list.splice(index, 1, response.data)
            break
          }
        }
        this.$notify({
          title: '成功',
          message: '派送成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    deleteAllRecords() {
      this.$confirm('该操作会永久删除所有信息，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({ type: 'success', message: '删除成功' })
        // api /records delete
        this.list = null
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
