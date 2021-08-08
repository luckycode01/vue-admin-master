<template>
  <el-form :inline="true" v-model="cateForm">
    <el-form-item label="一级分类">
      <el-select v-model="cateForm.category1Id" placeholder="请选择" @change="handlerCatrgory1">
        <el-option :label="cate1.name" :value="cate1.id" v-for="cate1 in category1List" :key="cate1.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select v-model="cateForm.category2Id" placeholder="请选择" @change="handlerCatrgory2">
        <el-option :label="cate2.name" :value="cate2.id" v-for="cate2 in category2List" :key="cate2.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select v-model="cateForm.category3Id" placeholder="请选择" @change="handlerCatrgory3">
        <el-option :label="cate3.name" :value="cate3.id" v-for="cate3 in category3List" :key="cate3.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      cateForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  mounted() {
    this.getCategory1List()
  },
  methods: {
    async getCategory1List() {
      const result = await this.$API.category.getCategory1();
      if (result.code === 200 || result.code === 20000) {
        this.category1List = result.data
      }
    },
    // 改变一级分类
    async handlerCatrgory1() {
      // 清空二级分类，和三级分类
      this.category2List = [];
      this.category3List = [];
      this.cateForm.category2Id = '';
      this.cateForm.category3Id = '';

      // 通知父组件，向父组件传递数据
      this.$emit('changeCategory', { categoryId: this.cateForm.category1Id, level: 1 });

      // 当选中一级分类时，拿着一级分类得id去请求二级分类
      const result = await this.$API.category.getCategory2(this.cateForm.category1Id);
      if (result.code === 20000 || result.code === 200) {
        this.category2List = result.data;
      }
    },
    // 改变二级分类
    async handlerCatrgory2() {
      this.category3List = [];
      this.cateForm.category3Id = '';
      // 通知父组件，向父组件传递数据
      this.$emit('changeCategory', { categoryId: this.cateForm.category2Id, level: 2 });
      // 当选中一级分类时，拿着一级分类得id去请求二级分类
      const result = await this.$API.category.getCategory3(this.cateForm.category2Id);
      if (result.code === 20000 || result.code === 200) {
        this.category3List = result.data;
      }
    },
    // 改变三级分类
    handlerCatrgory3() {
      this.$emit('changeCategory', { categoryId: this.cateForm.category3Id, level: 3 });
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
