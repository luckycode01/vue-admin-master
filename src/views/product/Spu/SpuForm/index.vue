<template>
  <el-form label-width="80px">
    <!-- 名称 -->
    <el-form-item label="SPU名称">
      <el-input placeholder='请输入SPU名称'></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select value='' placeholder="请选择">
        <el-option label="aaa" value=""></el-option>
        <el-option label="aaa" value=""></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input placeholder='请输入SPU描述' type="textarea" rows="4"></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload action="" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select value='' placeholder="有3项可选择">
        <el-option label="qq" value="">
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
      <el-table style="width: 100%" border>
        <el-table-column type="index" align="center" label="序号" width="80"> </el-table-column>
        <el-table-column prop="prop" label="属性名" width="150"> </el-table-column>
        <el-table-column prop="prop" label="属性值名称列表" width="width"> </el-table-column>
        <el-table-column label="操作" width="150"> </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button @click="$emit('update:isShowSpuForm',false)">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SpuForm',

  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    getAddSpuInfoData() {

    },
    getUpdateSpuInfoData() {

    }
  }
}
</script>

<style lang="scss" scoped>
</style>
