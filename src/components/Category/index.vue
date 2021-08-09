<template>
  <el-form :disabled='!isShowList' ref="" :model="cateForm" :inline=" true" label-width="80px" class="demo-form-inline">
    <el-form-item label="一级分类">
      <el-select v-model="cateForm.category1Id" placeholder="请选择" @change="handlerCatrgory1">
        <el-option :value="cate1.id" :label="cate1.name" v-for="cate1 in category1List" :key="cate1.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select v-model="cateForm.category2Id" placeholder="请选择" @change="handlerCatrgory2">
        <el-option :value="cate2.id" :label="cate2.name" v-for="cate2 in category2List" :key="cate2.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select v-model="cateForm.category3Id" placeholder="请选择" @change="handlerCatrgory3">
        <el-option :value="cate3.id" :label="cate3.name" v-for="cate3 in category3List" :key="cate3.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'category',
  props: ['isShowList'],
  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      // 收集id表单
      cateForm: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      }
    }
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    async getCategory1List() {
      const result = await this.$API.category.getCategory1();
      if (result.code === 20000 || result.code === 200) {
        this.category1List = result.data;
      }
    },
    // 选择一级分类
    async handlerCatrgory1() {
      // 清空二三级列表，及id
      this.cateForm.category2Id = '';
      this.cateForm.category3Id = '';
      this.category2List = [];
      this.category3List = [];

      // 选择了一级分类，发送请求获取二级分类
      const res = await this.$API.category.getCategory2(this.cateForm.category1Id);
      if (res.code === 200 || res.code === 20000) {
        this.category2List = res.data;
      }
      // 向父组件传递id
      this.$emit('changeCategory', { categoryId: this.cateForm.category1Id, level: 1 });
    },
    // 选择二级分类
    async handlerCatrgory2() {
      this.cateForm.category3Id = '';
      this.category3List = [];
      // 选择了二级分类，发送请求获取三级分类
      const res = await this.$API.category.getCategory3(this.cateForm.category2Id);
      if (res.code === 200 || res.code === 20000) {
        this.category3List = res.data;
      }
      // // 向父组件传递id
      this.$emit('changeCategory', { categoryId: this.cateForm.category2Id, level: 2 });
    },
    // 选择三级分类
    handlerCatrgory3() {
      // 向父组件传递id
      this.$emit('changeCategory', { categoryId: this.cateForm.category3Id, level: 3 });
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
