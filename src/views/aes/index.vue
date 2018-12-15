<template>
  <div class="qqq1">
    <el-input v-model="input" placeholder="请输入内容">
      <el-button slot="prepend" type="info" @click="add_aes">加 密</el-button>
    </el-input>
    <el-input v-model="input">
      <template slot="prepend">原 文</template>
    </el-input>
    <el-input v-model="input1" type="textarea"/>
  </div>
</template>

<script>
import { encrypts, decrypts } from './data/aes.js'
export default {
  name: 'Aes',
  data () {
    return {
      input: '',
      input1: ''
    }
  },
  methods: {
    add_aes () {
      this.input1 = encrypts(this.input, 128)
    },
    upda_aes () {
      this.input1 = decrypts(this.input1, 128)
    }
  }
}
</script>

<style>
    .qqq1{
        margin-left: 50px;
        margin-top: 30px;
        width: 400px;
    }
</style>
