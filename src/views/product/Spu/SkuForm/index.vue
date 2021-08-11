<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">{{ spuInfo.spuName }}</el-form-item>
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
      <el-input v-model="skuInfo.skuDesc" type="textarea" placeholder="规格描述" rows="4"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form label-width="100px" :inline='true'>
        <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id">
          <el-select v-model="attr.attrIdValueId" placeholder="请选择">
            <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="attrValue in attr.attrValueList" :key="attrValue.id"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form label-width="100px" :inline="true">
        <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key='saleAttr.id'>
          <el-select v-model="saleAttr.saleAttrIdValueId" placeholder="请选择">
            <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table @selection-change="handleSelectionChange" :data='spuImageList' style="width: 100%" border>
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="图片" width="width">
          <template slot-scope="{row}">
            <img :src="row.imgUrl" alt="" width="100px" height="100px" />
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template slot-scope="{row}">
            <el-button @click='changeDefault(row,spuImageList)' v-if="row.isDefault === '0'" type="primary" size="mini">设为默认</el-button>
            <el-tag v-else type="success">默认</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click='saveSku'>保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      // attrValueId: '', //选择框收集测试数据
      // saleAttrValueId: '',

      spuInfo: {}, //父组件传递的spu
      attrInfoList: [], //平台属性列表
      spuSaleAttrList: [], //销售属性列表
      spuImageList: [], //spu图片列表
      skuImageList: [], //收集选择的图片

      skuInfo: {
        // createTime: "2021-08-11T15:33:26.021Z",
        // id: 0,
        // isSale: 0,
        spuId: 0,
        tmId: 0,
        category3Id: '',

        skuName: "",
        price: '',
        weight: "",
        skuDesc: "",

        skuDefaultImg: "", //默认图片
        // 属性值列表
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
        // 收集的图片列表
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
        // 销售属性列表
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
    async getAddSkuFormInitData(spu, category1Id, category2Id) {
      this.spuInfo = spu;
      // 发送请求
      // 获取属性列表
      // http://localhost:9529/dev-api/admin/product/attrInfoList/2/13/61
      const promise1 = this.$API.attr.attrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      // http://localhost:9529/dev-api/admin/product/spuSaleAttrList/3
      const promise2 = this.$API.sku.getSpuSaleAttrList(spu.id);
      // http://localhost:9529/dev-api/admin/product/spuImageList/3
      const promise3 = this.$API.sku.getSpuImageList(spu.id);
      const res = await Promise.all([promise1, promise2, promise3]);

      this.attrInfoList = res[0].data;
      this.spuSaleAttrList = res[1].data;
      const spuImageList = res[2].data;
      spuImageList.forEach(item => item.isDefault = '0');
      this.spuImageList = spuImageList;
    },
    // 当选择项发生改变时
    handleSelectionChange(val) {
      this.skuImageList = val;
    },
    // 设置默认值
    changeDefault(row, spuImageList) {
      spuImageList.forEach(item => item.isDefault = '0');
      row.isDefault = '1';
      // 收集默认的图片
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    async saveSku() {
      // 获取参数
      const { spuInfo, skuInfo, attrInfoList, spuSaleAttrList, skuImageList } = this
      // 整理参数
      // 父组件传过来的参数
      skuInfo.spuId = spuInfo.id;
      skuInfo.tmId = spuInfo.tmId;
      skuInfo.category3Id = spuInfo.category3Id;

      // 图片处理
      skuInfo.skuImageList = skuImageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        }
      });
      // 平台属性和销售属性整理
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdValueId) {
          const [attrId, valueId] = item.attrIdValueId.split(':');
          prev.push({ attrId, valueId });
        }
        return prev;
      }, [])
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdValueId) {
          const [saleAttrId, saleAttrValueId] = item.saleAttrIdValueId.split(':');
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      try {
        const res = await this.$API.sku.addUpdate(skuInfo);
        if (res.code === 200 || res.code === 20000) {
          this.$message.success('保存成功');
          this.$emit('update:isShowSkuForm', false);
          this.resData();
        }
        else {
          this.$message.error('保存失败');
        }

      } catch (error) {
        this.$message.error('请求失败')
      }
    },
    resData() {
      Object.assign(this._data, this.$options.data());
    },
    // 取消
    cancel() {
      this.$emit('update:isShowSkuForm', false);
      this.resData();
    }
  }
};
</script>

<style lang="scss" scoped></style>
