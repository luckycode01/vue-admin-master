<template>
  <div>
    <el-button type="primary" v-if="$btnPowerManage('btn.Mtest1.add') ">add</el-button>
    <el-button type="warning" v-if="$btnPowerManage('btn.Mtest1.update') ">update</el-button>
    <el-button type="danger" v-if="$btnPowerManage('btn.Mtest1.remove') ">delete</el-button>
  </div>
</template>

<script>
export default {
  name: '',
}
</script>

<style lang="scss" scoped>
</style>
