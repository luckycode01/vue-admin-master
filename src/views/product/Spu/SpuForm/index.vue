<template>
  <el-form label-width="80px" v-model="spuInfo">
    <!-- 名称 -->
    <el-form-item label="SPU名称">
      <el-input v-model="spuInfo.spuName" placeholder="请输入SPU名称"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select v-model="spuInfo.tmId" placeholder="请选择">
        <el-option :label="tm.tmName" :value="tm.id" v-for="tm in trademarkList" :key="tm.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input v-model="spuInfo.description" placeholder="请输入SPU描述" type="textarea" rows="4"></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload action="/dev-api/admin/product/fileUpload" :file-list="spuImageList" list-type="picture-card" :on-success="handlePictureSuccess" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select v-model="saleAttrIdName" :placeholder='unSelectSaleAttrList.length>0 ? `有${unSelectSaleAttrList.length}项可选择`:`没有了！！！`'>
        <el-option :label="saleAttr.name" :value="`${saleAttr.id}:${saleAttr.name}`" v-for="saleAttr in unSelectSaleAttrList" :key="saleAttr.id"> </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus" @click="addSaleAttr" :disabled='!saleAttrIdName'>添加销售属性</el-button>
      <el-table :data="spuInfo.spuSaleAttrList" style="width: 100%" border>
        <el-table-column type="index" align="center" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="saleAttrName" label="属性名" width="150">
        </el-table-column>
        <el-table-column label="属性值名称列表" width="width">
          <template slot-scope="{ row}">
            <!-- @close="handleClose(tag)" -->
            <el-tag @close="row.spuSaleAttrValueList.splice(index,1)" :key="AttrValue.id" v-for="(AttrValue,index) in row.spuSaleAttrValueList" closable :disable-transitions="false">
              {{AttrValue.saleAttrValueName}}
            </el-tag>
            <el-input ref="attrValueInput" class="input-new-tag" v-if="row.isEdit" v-model="row.saleAttrValueName" size="small" @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">添加</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="{$index}">
            <HintButton size="mini" title="删除属性" type='danger' icon="el-icon-delete" @click="spuInfo.spuSaleAttrList.splice($index,1)"></HintButton>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveSpu">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SpuForm",

  data() {
    return {
      category3Id: '',
      spuInfo: {
        category3Id: '',
        description: "",
        spuName: "",
        tmId: '',
        // id: 0,
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0
          // }
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0
          //     }
          //   ]
          // }
        ],
      },
      // 收集销售属性id和名称
      saleAttrIdName: '',

      trademarkList: [],  //获取所有品牌
      spuImageList: [],  //获取得spu图片
      baseSaleAttrList: [], //获取所有得销售属性

      dialogVisible: false, //预览对话框
      dialogImageUrl: '', //预览图
    };
  },
  methods: {
    // 删除图片
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
    },
    // 添加图片成功
    handlePictureSuccess(res, file, fileList) {
      this.spuImageList = fileList;
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 添加spu
    async getAddSpuInfoData(category3Id) {
      this.category3Id = category3Id;
      // 获取品牌列表
      // http://localhost:9528/dev-api/admin/product/baseTrademark/getTrademarkList
      const trademarkRes = await this.$API.trademark.getList();
      if (trademarkRes.code === 200 || trademarkRes.code === 20000)
        this.trademarkList = trademarkRes.data;

      // 获取所有得销售属性
      // http://localhost:9528/dev-api/admin/product/baseSaleAttrList
      const baseSaleAttrRes = await this.$API.spu.getSaleAttrList();
      if (baseSaleAttrRes.code === 200 || baseSaleAttrRes.code === 20000)
        this.baseSaleAttrList = baseSaleAttrRes.data;
    },
    // 修改spu
    async getUpdateSpuInfoData(spu, category3Id) {
      this.category3Id = category3Id;
      // 获取spu详细信息
      // http://localhost:9528/dev-api/admin/product/getSpuById/1
      const spuInfoRes = await this.$API.spu.get(spu.id);
      if (spuInfoRes.code === 200 || spuInfoRes.code === 20000)
        this.spuInfo = spuInfoRes.data;

      // 获取spu图片
      // http://localhost:9528/dev-api/admin/product/spuImageList/1
      const imageListRes = await this.$API.sku.getSpuImageList(spu.id);
      if (imageListRes.code === 200 || imageListRes.code === 20000) {
        let imageList = imageListRes.data;
        imageList.forEach(item => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        })
        this.spuImageList = imageList
      }
      // 获取品牌列表
      // http://localhost:9528/dev-api/admin/product/baseTrademark/getTrademarkList
      const trademarkRes = await this.$API.trademark.getList();
      if (trademarkRes.code === 200 || trademarkRes.code === 20000)
        this.trademarkList = trademarkRes.data;

      // 获取所有得销售属性
      // http://localhost:9528/dev-api/admin/product/baseSaleAttrList
      const baseSaleAttrRes = await this.$API.spu.getSaleAttrList();
      if (baseSaleAttrRes.code === 200 || baseSaleAttrRes.code === 20000)
        this.baseSaleAttrList = baseSaleAttrRes.data;
    },
    // 添加销售属性
    addSaleAttr() {
      let [baseSaleAttrId, saleAttrName] = this.saleAttrIdName.split(':');
      this.spuInfo.spuSaleAttrList.push({ baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] });
      this.saleAttrIdName = '';

    },
    // 添加销售属性值
    showInput(row) {
      this.$set(row, 'isEdit', true);
      this.$set(row, 'saleAttrValueName', '');
      this.$nextTick(() => {
        this.$refs.attrValueInput.focus();
      })

    },
    // 按下抬起回车键，或失去焦点
    handleInputConfirm(row) {
      if (!row.saleAttrValueName.trim()) {
        row.isEdit = false;
        row.saleAttrValueName = "";
        return;
      };
      // 判断当前输入的是否与属性值重复
      const isRepead = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === row.saleAttrValueName)
      if (isRepead) {
        this.$message.error('输入的属性值重复，请重新添加');
        row.isEdit = false;
        row.saleAttrValueName = '';
        return;
      }

      row.spuSaleAttrValueList.push({
        baseSaleAttrId: row.baseSaleAttrId,
        saleAttrValueName: row.saleAttrValueName
      });
      row.saleAttrValueName = '';
      row.isEdit = false;
    },
    async saveSpu() {
      // 获取数据
      let { spuInfo, category3Id, spuImageList } = this;
      // 整理数据
      spuInfo.category3Id = category3Id;
      // 整理图片
      spuInfo.spuImageList = spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data,
        }
      });
      // 清除多余的属性
      spuInfo.spuSaleAttrList.forEach(item => {
        delete item.isEdit;
        delete item.saleAttrValueName;
      });
      // 发请求
      try {
        const result = await this.$API.spu.addUpdate(spuInfo);
        if (result.code === 200 || result.code === 20000) {
          this.$message.success('保存成功');
          // 返回列表页
          this.$emit('update:isShowSpuForm', false);
          // 通知父组件刷新列表
          this.$emit('saveSuccess', spuInfo.id);
          // 清空data
          this.resetData();

        } else {
          this.$message.error('保存失败')
        }
      } catch (err) {
        this.$message.error('请求发送失败');
      }
    },
    // 取消
    cancel() {
      this.$emit('update:isShowSpuForm', false);
      this.resetData();
    },
    // 重置data的数据
    resetData() {
      Object.assign(this._data, this.$options.data());
    }
  },
  computed: {
    unSelectSaleAttrList() {
      return this.baseSaleAttrList.filter(item => this.spuInfo.spuSaleAttrList.every(item1 => item1.saleAttrName !== item.name))
    }
  }
};
</script>

<style lang="scss" scoped></style>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
