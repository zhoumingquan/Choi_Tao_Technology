<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <span>账户余额</span>
      <span><el-button type="text">2832.08</el-button></span>
      <span style="margin-left:30px;"><el-button type="text">充值</el-button></span>
    </div>
    <dir style="text-align: center;">
      <span>您有<el-button type="text">2个</el-button>账单未支付，将会影响您的正常使用。</span>
    </dir>
    <div style="text-align: center;margin-top:200px;">
      <el-button type="primary" round>订单查询</el-button>
      <el-button type="info" round>账单查询</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    text-align: right;
  }
  &-text {
    font-size: 18px;
    line-height: 46px;
  }
}
</style>
