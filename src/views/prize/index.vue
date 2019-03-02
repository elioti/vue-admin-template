<!--suppress ALL -->
<template>
  <div class="app-container">
    <el-button type="success" @click="addPrize">添加礼品</el-button>
    <el-table
      v-loading="prizeLoading"
      :data="prizes"
      element-loading-text="获取中"
      border
      fit
      highlight-current-row
      style="margin-top: 20px">
      <el-table-column align="center" label="礼品编号" min-width="12.5%">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="礼品名称" min-width="37.5%">
        <template slot-scope="scope">
          {{ scope.row.prize_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="中奖权重" min-width="12.5%">
        <template slot-scope="scope">
          {{ scope.row.probability }}
        </template>
      </el-table-column>
      <el-table-column label="中奖率" min-width="12.5%" align="center">
        <template slot-scope="scope">
          {{ scope.row.probability/totalProb | toPer }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="25%">
        <template slot-scope="scope">
          <el-button type="primary" @click="editPrize(scope.row)">编辑</el-button>
          <el-button type="danger" @click="deletePrize(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="titleMap[dialogStatus]"
      :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="礼品编号">
          <el-input v-model="form.code"/>
        </el-form-item>
        <el-form-item label="礼品名称">
          <el-input v-model="form.prize_name"/>
        </el-form-item>
        <el-form-item label="中奖权重">
          <el-input v-model="form.probability"/>
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
import { getPrize, updatePrize, deltePrize, createPrize } from '../../api/prize'

export default {
  name: 'Prize',
  filters: {
    toPer(point) {
      if (point === 0) {
        return 0
      } else {
        let str = Number(point * 100).toFixed(2)
        str += '%'
        return str
      }
    }
  },
  data() {
    return {
      prizes: null,
      prizeLoading: true,
      titleMap: {
        addPrize: '新增礼品',
        editPrize: '编辑礼品'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      form: {
        code: '',
        prize_name: '',
        probability: ''
      }
    }
  },
  computed: {
    totalProb() {
      let total = 0
      this.prizes.forEach(function(value, index, array) {
        total += parseFloat(value.probability)
      })
      return total
    }
  },
  created() {
    this.fetchPrizes()
  },
  methods: {
    fetchPrizes() {
      this.prizeLoading = true
      // api: /prizes
      getPrize().then(response => {
        this.prizes = response.data.results
      })
      // this.prizes = [
      //   { code: 1, prize_name: '8元现金', probability: '21.3' },
      //   { code: 2, prize_name: '18元现金', probability: '2.3' },
      //   { code: 3, prize_name: '28元现金', probability: '23.3' },
      //   { code: 4, prize_name: '38元现金', probability: '1.3' },
      //   { code: 5, prize_name: '48元现金', probability: '5.3' }
      // ]
      this.prizeLoading = false
    },
    addPrize() {
      this.dialogFormVisible = true
      this.dialogStatus = 'addPrize'
      this.form = {
        code: '',
        prize_name: '',
        probability: ''
      }
    },
    deletePrize(row) {
      deltePrize(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.prizes.splice(row.$index, 1)
      })
    },
    editPrize(row) {
      this.form = Object.assign({}, row)
      this.dialogFormVisible = true
      this.dialogStatus = 'editPrize'
    },
    dialogConfirm() {
      if (this.dialogStatus === 'editPrize') {
        const tempData = Object.assign({}, this.form)
        updatePrize(tempData.id, tempData).then(() => {
          for (const v of this.prizes) {
            if (v.id === this.form.id) {
              const index = this.prizes.indexOf(v)
              this.prizes.splice(index, 1, this.form)
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
      } else {
        createPrize(this.form).then(response => {
          this.prizes.push(response.data)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        })
      }
    }
  }
}

</script>

<style scoped>

</style>

