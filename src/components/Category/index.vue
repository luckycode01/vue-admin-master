<template>
  <el-form
    ref=""
    :model="cateForm"
    label-width="80px"
    :inline="true"
    :disabled="!isShowList"
  >
    <el-form-item label="一级分类">
      <el-select
        v-model="cateForm.category1Id"
        placeholder="请选择"
        @change="handlerCatrgory1"
      >
        <el-option
          :label="category.name"
          :value="category.id"
          v-for="category in category1List"
          :key="category.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select
        v-model="cateForm.category2Id"
        placeholder="请选择"
        @change="handlerCatrgory2"
      >
        <el-option
          :label="category.name"
          :value="category.id"
          v-for="category in category2List"
          :key="category.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select
        v-model="cateForm.category3Id"
        placeholder="请选择"
        @change="handlerCatrgory3"
      >
        <el-option
          :label="category.name"
          :value="category.id"
          v-for="category in category3List"
          :key="category.id"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "Category",

  props: ["isShowList"],

  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      cateForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    async getCategory1List() {
      const res = await this.$API.category.getCategory1();
      if (res.code === 200 || res.code === 20000) {
        this.category1List = res.data;
      }
    },
    // 选择一级分类
    async handlerCatrgory1(category1Id) {
      // 清空选择情况
      this.cateForm.category2Id = "";
      this.cateForm.category3Id = "";
      this.category2List = [];
      this.category3List = [];

      const res = await this.$API.category.getCategory2(category1Id);
      if (res.code === 200 || res.code === 20000) {
        this.category2List = res.data;
      }

      //向父组件传递id值
      this.$emit("changeCategoryId", { categoryId: category1Id, level: 1 });
    },
    // 选择二级分类
    async handlerCatrgory2(category2Id) {
      this.cateForm.category3Id = "";
      this.category3List = [];

      const res = await this.$API.category.getCategory3(category2Id);
      if (res.code === 200 || res.code === 20000) {
        this.category3List = res.data;
      }

      //向父组件传递id值
      this.$emit("changeCategoryId", { categoryId: category2Id, level: 2 });
    },
    // 选择三级分类
    handlerCatrgory3(category3Id) {
      //向父组件传递id值
      this.$emit("changeCategoryId", { categoryId: category3Id, level: 3 });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
