<template>
  <div>
    <el-button type="primary" v-if="$buttonPower('btn.Mtest1.add')">添加</el-button>
    <el-button type="warning" v-if="$buttonPower('btn.Mtest1.update')">修改</el-button>
    <el-button type="danger" v-if="$buttonPower('btn.Mtest1.remove')">删除</el-button>
  </div>
</template>

<script>
export default {
  name: '',
}
</script>

<style lang="scss" scoped>
</style>
