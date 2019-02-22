<template>
  <div class="app-container">
    <el-form ref="infoForm" label-width="160px" abel-position="left" style="margin-top: 30px">
      <el-form-item label="是否启用">
        <el-switch v-model="isOpen" active-color="#13ce66" inactive-color="#ff4949"/>
      </el-form-item>
      <el-form-item label="关闭提示">
        <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="text" style="width: 400px" type="textarea" clearable/>
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="datetimerange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"/>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="handleReset">重置表单</el-button>
        <el-button type="primary" @click="handleCommit">提交保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'Index',
  data() {
    return {
      isOpen: false,
      text: '',
      datetimerange: []
    }
  },
  methods: {
    handleCommit() {},
    handleReset() {
      this.isOpen = false
      this.text = ''
      this.datetimerange = []
    }
  }
}
</script>

<style scoped>

</style>
