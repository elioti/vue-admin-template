<!--suppress ALL -->
<template>
  <div class="app-container">
    <el-button type="success" @click="addPrize">添加礼品</el-button>
    <el-table
      v-loading="prizeLoading"
      :data="prizes"
      element-loading-text="获取中"
      border
      stripe
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
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="中奖权重" min-width="12.5%">
        <template slot-scope="scope">
          {{ scope.row.prob }}
        </template>
      </el-table-column>
      <el-table-column label="中奖率" min-width="12.5%" align="center">
        <template slot-scope="scope">
          {{ scope.row.prob/totalProb | toPer }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="25%">
        <template slot-scope="scope">
          <el-button type="primary" @click="editPrize(scope.$index)">编辑</el-button>
          <el-button type="danger" @click="deletePrize(scope.$index)">删除</el-button>
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
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="中奖权重">
          <el-input v-model="form.prob"/>
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
import { getPrize, setPrize } from '../../api/prize'

export default {
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
        name: '',
        prob: ''
      }
    }
  },
  computed: {
    totalProb() {
      let total = 0
      this.prizes.forEach(function(value, index, array) {
        total += parseFloat(value.prob)
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
        this.prizes = response.data
      })
      // this.prizes = [
      //   { code: 1, name: '8元现金', prob: '21.3' },
      //   { code: 2, name: '18元现金', prob: '2.3' },
      //   { code: 3, name: '28元现金', prob: '23.3' },
      //   { code: 4, name: '38元现金', prob: '1.3' },
      //   { code: 5, name: '48元现金', prob: '5.3' }
      // ]
      this.prizeLoading = false
    },
    addPrize() {
      this.dialogFormVisible = true
      this.dialogStatus = 'addPrize'
      this.form = {
        code: '',
        name: '',
        prob: ''
      }
    },
    deletePrize(id) {
      this.prizes.splice(id, 1)
      // api: /prize/id
    },
    editPrize(id) {
      this.form = this.prizes[id]
      this.dialogFormVisible = true
      this.dialogStatus = 'editPrize'
    },
    dialogConfirm() {
      this.dialogFormVisible = false
      if (this.dialogStatus === 'editPrize') {
        //  api: /prize/id put
      } else {
        const params = new URLSearchParams()
        params.append('code', this.form.code)
        params.append('name', this.form.name)
        params.append('prob', this.form.prob)
        setPrize(params)
        this.prizes.push(this.form)
        this.form = {
          code: '',
          name: '',
          prob: ''
        }
        // api: /prize post
      }
    }
  }
}

</script>

<style scoped>

</style>

