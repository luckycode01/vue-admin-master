<template>
  <!-- <a href="javascript:;" :title="title">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a> -->
  <el-tooltip class="item" effect="dark" :content="title" placement="top">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </el-tooltip>
</template>

<script>
export default {
  name: "HideButton",
  props: ["title"],
};
</script>

<style lang="scss" scoped>
.el-tooltip {
  margin-right: 10px;
}
</style>
