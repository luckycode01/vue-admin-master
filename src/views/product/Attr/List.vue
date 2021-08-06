<template>
  <div>
    <el-card>
      <Category @changeCategory='changeCategory'></Category>
    </el-card>
    <!-- 列表区 -->
    <el-card style="margin-top:20px"></el-card>
  </div>
</template>

<script>
export default {
  name: 'Attr',
  methods: {
    changeCategory() {

    }
  }
}
</script>

<style lang="scss" scoped>
</style>

