<template>
  <!-- 省-市-区三级联动 -->
  <div class="linkage">
    <el-select
      v-model="sheng"
      filterable
      size="medium"
      placeholder="省级地区"
      style="width:190px;"
      @change="choseProvince">
      <el-option
        v-for="item in province"
        :key="item.id"
        :label="item.value"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="shi"
      filterable
      size="medium"
      placeholder="市级地区"
      @change="choseCity">
      <el-option
        v-for="item in shi1"
        :key="item.id"
        :label="item.value"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="qu"
      filterable
      size="medium"
      placeholder="区级地区"
      @change="choseBlock">
      <el-option
        v-for="item in qu1"
        :key="item.id"
        :label="item.value"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      mapJson: '../../../../static/json/map.json',
      province: '',
      sheng: '',
      shi: '',
      shi1: [],
      qu: '',
      qu1: [],
      city: '',
      block: ''
    }
  },
  created: function () {
    this.getCityData()
  },
  methods: {
    // 加载china地点数据，三级
    getCityData () {
      var that = this
      axios.get(this.mapJson).then(function (response) {
        if (response.status === 200) {
          var data = response.data
          that.province = []
          that.city = []
          that.block = []
          // 省市区数据分类
          for (var item in data) {
            if (item.match(/0000$/)) { // 省
              that.province.push({ id: item, value: data[item], children: [] })
            } else if (item.match(/00$/)) { // 市
              that.city.push({ id: item, value: data[item], children: [] })
            } else { // 区
              that.block.push({ id: item, value: data[item] })
            }
          }
          // 分类市级
          for (var index in that.province) {
            for (var index1 in that.city) {
              if (that.province[index].id.slice(0, 2) === that.city[index1].id.slice(0, 2)) {
                that.province[index].children.push(that.city[index1])
              }
            }
          }
          // 分类区级
          for (var item1 in that.city) {
            for (var item2 in that.block) {
              if (that.block[item2].id.slice(0, 4) === that.city[item1].id.slice(0, 4)) {
                that.city[item1].children.push(that.block[item2])
              }
            }
          }
        } else {
          console.log(response.status)
        }
      }).catch(function (error) { console.log(typeof +error) })
    },
    // 选省
    choseProvince (e) {
      for (var index2 in this.province) {
        if (e === this.province[index2].value) {
          this.shi1 = this.province[index2].children
          this.shi = this.province[index2].children[0].value
          this.qu1 = this.province[index2].children[0].children
          this.qu = this.province[index2].children[0].children[0].value
          this.E = this.qu1[0].id
        }
      }
    },
    // 选市
    choseCity (e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].value) {
          this.qu1 = this.city[index3].children
          this.qu = this.city[index3].children[0].value
          this.E = this.qu1[0].id
          // console.log(this.E)
        }
      }
    },
    // 选区
    choseBlock (e) {
      this.E = e
      const h = this.$createElement
      this.$notify({
        title: '所属地区',
        position: 'bottom-right',
        message: h(
          'i',
          { style: 'color: teal' },
          '[' + this.sheng + ',' + this.shi + ',' + this.qu + ']'
        )
      })
    }
  }
}
</script>

<style scoped>
</style>
