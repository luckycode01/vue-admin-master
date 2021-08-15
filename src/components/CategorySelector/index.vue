<template>
  <!-- 三级联动 -->
  <!-- isShowList为true代表是在列表页，三级能操作 disabled要为false
    isShowList为false代表是在添加或者修改页，三级不能操作 disabled要为true
   -->
  <el-form :inline="true" :model="cForm" :disabled="!isShowList">
    <el-form-item label="一级分类">
      <!-- select和option必须要有value属性，不写就报警告 -->
      <!-- select收集的就是选中的option的value值
      select当中option的value的值是什么，要看后期select 要收集的是什么东西 
     -->
      <el-select v-model="cForm.category1Id" placeholder="请选择" @change="handlerCatrgory1">
        <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in category1List" :key="c1.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="二级分类">
      <!-- select和option必须要有value属性，不写就报警告 -->
      <!-- select收集的就是选中的option的value值
      select当中option的value的值是什么，要看后期select 要收集的是什么东西 
     -->
      <el-select v-model="cForm.category2Id" placeholder="请选择" @change="handlerCatrgory2">
        <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in category2List" :key="c2.id"></el-option>
      </el-select>
    </el-form-item>
    
    <el-form-item label="三级分类">
      <!-- select和option必须要有value属性，不写就报警告 -->
      <!-- select收集的就是选中的option的value值
      select当中option的value的值是什么，要看后期select 要收集的是什么东西 
     -->
      <el-select v-model="cForm.category3Id" placeholder="请选择" @change="handlerCatrgory3">
        <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in category3List" :key="c3.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: "CategorySelector",
  props:['isShowList'],
  data(){
    return {
      category1List:[],
      category2List:[],
      category3List:[],
      cForm:{
        category1Id:'',
        category2Id:'',
        category3Id:''
      }
    }
  },
  mounted(){
    // 请求获取1级分类数据，因为1级分类数据一上来就要有
    this.getCategory1List()
  },
  methods:{
    // 请求获取1级分类列表
    async getCategory1List(){
      const result = await this.$API.category.getCategory1()
      if(result.code === 200 || result.code === 20000){
        this.category1List = result.data
      }
    },
    // 选中1级分类的时候，默认参数是选中的1级分类id
    async handlerCatrgory1(category1Id){
      // 选中1级应该把23级东西清除
      this.category2List = []
      this.category3List = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''


      // 选中1级那么此时得和父组件通信，让父组件去干活
      this.$emit('changeCategory',{categoryId:category1Id,level:1})


      // 选中1级分类，我们需要去请求获取2级分类列表
      const result = await this.$API.category.getCategory2(category1Id)
      if(result.code === 200 || result.code === 20000){
        this.category2List = result.data
      }
    },
    // 选中2级分类的时候，默认参数是选中的2级分类id
    async handlerCatrgory2(category2Id){
      // 选中2级应该把3级东西清除
      this.category3List = []
      this.cForm.category3Id = ''

      // 选中2级那么此时得和父组件通信，让父组件去干活

      this.$emit('changeCategory',{categoryId:category2Id,level:2})

      // 选中2级分类，我们需要去请求获取3级分类列表
      const result = await this.$API.category.getCategory3(category2Id)
      if(result.code === 200 || result.code === 20000){
        this.category3List = result.data
      }
    },

    // 选中三级分类
    handlerCatrgory3(category3Id){
      // 选中3级那么此时得和父组件通信，让父组件去干活
      this.$emit('changeCategory',{categoryId:category3Id,level:3})
    }
  }
};
</script>

<style scoped>
</style>
