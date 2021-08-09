<template>
  <el-form label-width="80px">
    <!--SPU名称 -->
    <el-form-item label="SPU名称">
      <el-input placeholder="请输入SPU名称"></el-input>
    </el-form-item>
    <!-- 品牌 -->
    <el-form-item label="品牌">
      <el-select v-model="trademark" placeholder="请选择品牌">
        <el-option label="区域一" value=""></el-option>
      </el-select>
    </el-form-item>
    <!--SPU描述-->
    <el-form-item label="SPU描述">
      <el-input placeholder="请输入SPU描述" type="textarea" rows="4"></el-input>
    </el-form-item>
    <!-- SPU图片 -->
    <el-form-item label="SPU图片">
      <el-upload action="" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
    </el-form-item>
    <!--销售属性  -->
    <el-form-item label="销售属性">
      <el-select value="" placeholder="还有3项未选择">
        <el-option label="区域一" value=""></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
      <!-- 属性列表 -->
      <el-table style="width: 100%" border>
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="prop" label="属性名" width="140"></el-table-column>
        <el-table-column prop="prop" label="属性值名称列表" width="width"></el-table-column>
        <el-table-column label="操作" width="140">
          <template>
            <HintButton title="删除" type="danger" icon="el-icon-delete" size="mini"></HintButton>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <!-- 保存或取消 -->
    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button @click="$emit('update:isShowSpuForm', false)">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      trademark: [],
      attrList: [],

      SpuInfo: {
        category3Id: 0,
        description: "string",
        id: 0,
        spuImageList: [
          {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            spuId: 0
          }
        ],
        spuName: "string",
        spuSaleAttrList: [
          {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: "string",
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: "string",
                saleAttrName: "string",
                saleAttrValueName: "string",
                spuId: 0
              }
            ]
          }
        ],
        tmId: 0
      }
    };
  },

  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async getAddSpuFormInitData() {
      // const result = await this.$API.spu.getTrademarkLis();
      // if (result.code === 20000 || result.code === 200) {
      //   this.trademark = result.data;
      // }
      // const result1 = await this.$API.spu.getSaleAttrList();
      // if (result1.code === 200 || result1.code === 20000) {
      //   this.attrList = result1.data;
      // }
    },
    getUpdateSpuFormInitData() { }
  }
};
</script>

<style lang="scss" scoped></style>
