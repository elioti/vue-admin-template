<template>
  <div class="app-container">
    <div class="header">
      <el-input v-model="param" type="text" placeholder="请输入会员账号" clearable style="width: 30%" @clear="fetchRecords" @keyup.enter.native="fetchRecords">
        <el-button slot="append" icon="el-icon-search" @click="fetchRecords"/>
      </el-input>
      <el-button type="success" icon="el-icon-plus" style="margin-left: 20px" @click="addRecord">添加记录</el-button>
      <el-button type="info" @click="addRecord">导入execl</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="deleteAllRecords">一键删除</el-button>
    </div>
    <el-table
      v-loading="recordsLoading"
      :data="records"
      element-loading-text="获取中"
      border
      fit
      highlight-current-row
      style="margin-top: 20px"
      size="small"
      @selection-change="handleSelectionChange">
      <div slot="empty">暂无数据</div>
      <el-table-column type="selection" min-width="5%"/>
      <el-table-column align="center" label="编号" min-width="3%">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员账号" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="中奖ID" min-width="3%">
        <template slot-scope="scope">
          {{ scope.row.prizeId }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="中奖礼品" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.prizeName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="中奖时间" min-width="10%">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.datetime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="抽奖方式" min-width="7%">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type | typeToColor">{{ scope.row.type | typeToText }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="抽奖IP" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.ip }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否发送" min-width="7%">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isSend | sendToColor">{{ scope.row.isSend | sendToText }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发送时间" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.sendTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="15%">
        <template slot-scope="scope">
          <el-button type="primary" @click="editRecord(scope.$index)">编辑</el-button>
          <el-button type="danger" @click="deleteRecord(scope.$index)">删除</el-button>
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
      <el-form :model="record">
        <el-form-item v-if="dialogStatus === 'editRecord'" label="礼品编号" >
          {{ record.code }}
        </el-form-item>
        <el-form-item label="会员账号">
          <el-input v-model="record.username"/>
        </el-form-item>
        <el-form-item label="中奖礼品">
          <el-input v-model="record.prizeId"/>
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
  filters: {
    typeToColor(status) {
      const types = ['success', 'info', 'danger']
      return types[parseInt(status)]
    },
    typeToText(status) {
      const types = ['自然抽奖', '内定抽奖', '后台添加']
      return types[parseInt(status)]
    },
    sendToColor(status) {
      const types = ['warning', 'success']
      return types[parseInt(status)]
    },
    sendToText(status) {
      const types = ['未送出', '已送出']
      return types[parseInt(status)]
    }
  },
  data() {
    return {
      recordsLoading: true,
      records: null,
      record: {
        code: '',
        username: '',
        prizeId: '',
        prizeName: '',
        datetime: '',
        type: '',
        ip: '',
        isSend: '',
        sendTime: ''
      },
      titleMap: {
        addRecord: '新增记录',
        editRecord: '编辑记录'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      multipleSelection: [],
      param: '',
      currentPage: 1
    }
  },
  created() {
    this.fetchRecords()
  },
  methods: {
    fetchRecords() {
      if (this.param === '') {
        this.records = [
          { code: '1', username: 'test2', prizeId: '1', prizeName: 'eqeqe', datetime: '20190301', type: '0', ip: '192.168.0.1', isSend: '0', sendTime: '20190301' },
          { code: '2', username: 'test2', prizeId: '1', prizeName: 'eqeqe', datetime: '20190301', type: '1', ip: '192.168.0.1', isSend: '1', sendTime: '20190301' },
          { code: '3', username: 'test2', prizeId: '1', prizeName: 'eqe3qe', datetime: '20190301', type: '1', ip: '192.168.0.1', isSend: '1', sendTime: '20190301' },
          { code: '4', username: 'test2', prizeId: '31', prizeName: 'eq33eqe', datetime: '20190301', type: '2', ip: '192.168.0.1', isSend: '0', sendTime: '20190301' }
        ]
      } else {
        this.records = [
          { code: '1', username: 'test2', prizeId: '1', prizeName: 'eqeqe', datetime: '20190301', type: '0', ip: '192.168.0.1', isSend: '0', sendTime: '20190301' },
          { code: '2', username: 'test2', prizeId: '1', prizeName: 'eqeqe', datetime: '20190301', type: '1', ip: '192.168.0.1', isSend: '1', sendTime: '20190301' },
          { code: '3', username: 'test2', prizeId: '1', prizeName: 'eqe3qe', datetime: '20190301', type: '1', ip: '192.168.0.1', isSend: '0', sendTime: '20190301' },
          { code: '4', username: 'test2', prizeId: '31', prizeName: 'eq33eqe', datetime: '20190301', type: '2', ip: '192.168.0.1', isSend: '1', sendTime: '20190301' },
          { code: '5', username: 'test2', prizeId: '12', prizeName: 'eqeqe', datetime: '20190301', type: '0', ip: '192.168.0.1', isSend: '1', sendTime: '20190301' },
          { code: '6', username: 'test2', prizeId: '1', prizeName: 'eqe3qe', datetime: '20190301', type: '0', ip: '192.168.0.1', isSend: '0', sendTime: '20190301' },
          { code: '7', username: 'test2', prizeId: '1', prizeName: 'eqe3qe', datetime: '20190301', type: '0', ip: '192.168.0.1', isSend: '0', sendTime: '20190301' },
          { code: '8', username: 'test2', prizeId: '1', prizeName: 'eqeqe', datetime: '20190301', type: '1', ip: '192.168.0.1', isSend: '0', sendTime: '20190301' },
          { code: '9', username: 'test2', prizeId: '1', prizeName: 'eqeqe', datetime: '20190301', type: '0', ip: '192.168.0.1', isSend: '0', sendTime: '20190301' },
          { code: '11', username: 'test1', prizeId: '1', prizeName: 'eqeqe', datetime: '20190301', type: '1', ip: '192.168.0.1', isSend: '0', sendTime: '20190301' },
          { code: '12', username: 'test1', prizeId: '1', prizeName: 'eqeqe', datetime: '20190301', type: '1', ip: '192.168.0.1', isSend: '0', sendTime: '20190301' },
          { code: '13', username: 'test1', prizeId: '1', prizeName: 'eqeqe', datetime: '20190301', type: '1', ip: '192.168.0.1', isSend: '0', sendTime: '20190301' },
          { code: '14', username: 'test1', prizeId: '1', prizeName: 'eqeqe', datetime: '20190301', type: '1', ip: '192.168.0.1', isSend: '0', sendTime: '20190301' },
          { code: '15', username: 'test1', prizeId: '1', prizeName: 'eqeqe', datetime: '20190301', type: '1', ip: '192.168.0.1', isSend: '0', sendTime: '20190301' },
          { code: '16', username: 'test1', prizeId: '1', prizeName: 'eqeqe', datetime: '20190301', type: '1', ip: '192.168.0.1', isSend: '0', sendTime: '20190301' }
        ]
      }
      this.recordsLoading = true

      this.recordsLoading = false
    },
    addRecord() {
      this.dialogFormVisible = true
      this.dialogStatus = 'addRecord'
      this.record = {
        code: '',
        username: '',
        prizeId: '',
        prizeName: '',
        datetime: '',
        type: '',
        ip: '',
        isSend: '',
        sendTime: ''
      }
    },
    deleteRecord(id) {
      this.records.splice(id, 1)
    },
    editRecord(id) {
      this.record = this.records[id]
      this.dialogFormVisible = true
      this.dialogStatus = 'editRecord'
    },
    dialogConfirm() {
      this.dialogFormVisible = false
      if (this.dialogStatus === 'editRecord') {
        //  api: /record/id put
      } else {
        this.records.push(this.record)
        this.record = {
          code: '',
          name: '',
          prob: ''
        }
        // api: /record post
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    deleteAllRecords() {
      this.$confirm('该操作会永久删除所有信息，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({ type: 'success', message: '删除成功' })
        // api /records delete
        this.records = null
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

