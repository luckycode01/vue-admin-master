<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">{{spuInfo.spuName}}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" type="number" placeholder="价格(元)"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" type="number" placeholder="重量(千克)"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" placeholder="规格描述" type="textarea" rows="4"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form label-width="100px" :inline="true">
          <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id">
            <el-select v-model="attr.attrIdValueId" placeholder="">
              <el-option :label="attrValue.valueName" :value='`${attr.id}:${attrValue.id}`' v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form label-width="100px" :inline="true">
          <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
            <el-select v-model="saleAttr.saleAttrIdValueId" placeholder="">
              <el-option :label="saleAttrValue.saleAttrValueName" :value='`${saleAttr.id}:${saleAttrValue.id}`' v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table :data="spuImageList" border style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column label="图片" width="width">
            <template slot-scope="{ row}">
              <img :src="row.imgUrl" alt="" width='100px' height='100px'>
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row}">
              <el-button v-if="row.isDefault === '0'" @click="setDefaultImg(row,spuImageList)" type="primary" size="mini">设为默认</el-button>
              <el-tag v-else type="success">默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSku">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",

  data() {
    return {
      spuInfo: {}, //父传过来的SPU
      skuInfo: {},
      attrInfoList: [], //属性列表
      spuSaleAttrList: [], //销售属性列表
      spuImageList: [], //spu图片列表

      skuImageList: [], //收集图片列表
      // 添加SKU收集数据
      skuInfo: {
        // createTime: "2021-08-12T05:57:06.910Z",
        // id: 0,
        // isSale: 0,
        category3Id: '',
        spuId: '',
        tmId: '',

        skuDefaultImg: "",
        skuDesc: "",
        skuName: "",
        price: '',
        weight: '',
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: "string"
          // }
        ],
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0
          // }
        ],
      }
    };
  },
  methods: {
    async getAddSkuInfoData(spuInfo, category1Id, category2Id) {
      this.spuInfo = spuInfo;
      // 获取属性列表
      // http://localhost:9529/dev-api/admin/product/attrInfoList/2/13/61
      const promise1 = this.$API.attr.attrInfoList(
        category1Id,
        category2Id,
        spuInfo.category3Id
      );
      // 获取销售属性列表
      // http://localhost:9529/dev-api/admin/product/spuSaleAttrList/2594
      const promise2 = this.$API.sku.getSpuSaleAttrList(spuInfo.id);
      // 获取SPU图片列表
      // http://localhost:9529/dev-api/admin/product/spuImageList/2594
      const promise3 = this.$API.sku.getSpuImageList(spuInfo.id);
      const res = await Promise.all([promise1, promise2, promise3]);

      this.attrInfoList = res[0].data;
      this.spuSaleAttrList = res[1].data;
      const spuImageList = res[2].data;
      spuImageList.forEach(item => {
        item.isDefault = '0';
      })
      this.spuImageList = spuImageList
    },
    // 改变表格的选项时触发
    handleSelectionChange(value) {
      this.skuImageList = value;
    },
    setDefaultImg(row, spuImageList) {
      spuImageList.forEach(item => item.isDefault = '0');
      row.isDefault = '1';
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    async saveSku() {
      // 获取数据
      const { spuInfo, skuInfo, skuImageList, attrInfoList, spuSaleAttrList } = this
      // 整理数据
      skuInfo.category3Id = spuInfo.category3Id;
      skuInfo.spuId = spuInfo.id;
      skuInfo.tmId = spuInfo.tmId;
      // 图片处理
      skuInfo.skuImageList = skuImageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      });
      // 属性处理
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdValueId) {
          const [attrId, valueId] = item.attrIdValueId.split(':');
          prev.push({ attrId, valueId })
        }
        return prev;
      }, []);
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdValueId) {
          const [saleAttrId, saleAttrValueId] = item.saleAttrIdValueId.split(':');
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev;
      }, []);

      // 发请求
      try {
        const result = await this.$API.sku.addUpdate(skuInfo);
        if (result.code === 200 || result.code === 20000) {
          this.$message.success('保存成功');
          // 返回列表页
          this.$emit('update:isShowSkuForm', false);
          // 清空data
          this.resetData();
        }

      } catch (error) {
        this.$message.error('请求发送失败')
      }

    },
    cancel() {
      this.$emit('update:isShowSkuForm', false);
      this.resetData();
    },
    // 重置data 的数据
    resetData() {
      Object.assign(this._data, this.$options.data());
    }
  }
};
</script>

<style lang="scss" scoped></style>
