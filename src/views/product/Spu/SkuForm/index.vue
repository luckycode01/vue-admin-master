<template>
  <el-form label-width="80px">
    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button @click="$emit('update:isShowSkuForm',false)">取消</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  name: 'SkuForm',
}
</script>

<style lang="scss" scoped>
</style>
