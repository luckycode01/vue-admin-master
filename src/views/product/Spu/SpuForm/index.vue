<template>
  <el-form label-width="80px">
    <!--SPU名称 -->
    <el-form-item label="SPU名称">
      <el-input v-model="spuInfo.spuName" placeholder="请输入SPU名称"></el-input>
    </el-form-item>
    <!-- 品牌 -->
    <el-form-item label="品牌">
      <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
        <el-option :label="tm.tmName" :value="tm.id" v-for="tm in trademarkList" :key="tm.id"></el-option>
      </el-select>
    </el-form-item>
    <!--SPU描述-->
    <el-form-item label="SPU描述">
      <el-input v-model="spuInfo.description" placeholder="请输入SPU描述" type="textarea" rows="4"></el-input>
    </el-form-item>
    <!-- SPU图片 -->
    <el-form-item label="SPU图片">
      <el-upload action="/dev-api/admin/product/fileUpload" :file-list="spuImageList" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-success="handlePictureUploaded" :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-form-item>
    <!--销售属性  -->
    <el-form-item label="销售属性">
      <el-select v-model="selectSaleAttrIdName" :placeholder="`还有${unSelectSaleAttrList.length}项未选择`">
        <el-option :label="unSelectSaleAttr.name" :value="`${unSelectSaleAttr.id}:${unSelectSaleAttr.name}`" v-for="unSelectSaleAttr in unSelectSaleAttrList" :key='unSelectSaleAttr.id'></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus" @click="addSaleAttr" :disabled='!selectSaleAttrIdName'>添加销售属性</el-button>
      <!-- 属性列表 -->
      <el-table style="width: 100%" border :data="spuInfo.spuSaleAttrList">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="saleAttrName" label="属性名" width="140"></el-table-column>
        <el-table-column label="属性值名称列表" width="width">
          <template slot-scope="{row,$index}">
            <el-tag type='success' closable @close="row.spuSaleAttrValueList.splice(index,1)" v-for="spuSaleAttrValue in row.spuSaleAttrValueList" :key="spuSaleAttrValue.id" style="margin:0 0 10px 10px">{{spuSaleAttrValue.saleAttrValueName}}</el-tag>
            <el-input v-if="row.isEdit" v-model="row.saleAttrValueName" ref="saveTagInput" class="input-new-tag" size="small" @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)"></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="{row,$index}">
            <HintButton title="删除" type="danger" icon="el-icon-delete" size="mini" @click="spuInfo.spuSaleAttrList.splice($index,1)"></HintButton>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <!-- 保存或取消 -->
    <el-form-item>
      <el-button type="primary" @click="saveSpu">保存</el-button>
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

      trademarkList: [], //品牌列表
      spuImageList: [],  //请求获得的图片列表
      baseSaleAttrList: [], //所有属性列表

      selectSaleAttrIdName: '',  //属性id

      // 详细信息
      spuInfo: {
        category3Id: '',
        description: "",
        spuName: "",
        tmId: '',
        // id: 0, 添加时不需要id
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

      }
    };
  },

  methods: {
    // 上传图片成功的回调
    handlePictureUploaded(res, file, fileList) {
      this.spuImageList = fileList;
    },
    // 删除图片的回调
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async getAddSpuFormInitData(category3Id) {
      this.category3Id = category3Id;
      // 获取所有品牌
      const trademarkResult = await this.$API.trademark.getTrademarkLis();
      if (trademarkResult.code === 20000 || trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data;
      }
      // 获取所有的销售属性
      const AttrResult = await this.$API.spu.getSaleAttrList();
      if (AttrResult.code === 200 || AttrResult.code === 20000) {
        this.baseSaleAttrList = AttrResult.data;
      }
    },
    async getUpdateSpuFormInitData(spu, category3Id) {
      this.category3Id = category3Id;
      // 获取所有品牌
      // http://localhost:9529/dev-api/admin/product/baseTrademark/getTrademarkList
      const trademarkResult = await this.$API.trademark.getTrademarkLis();
      if (trademarkResult.code === 20000 || trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data;
      }
      // 获取所有销售属性
      // http://localhost:9529/dev-api/admin/product/baseSaleAttrList
      const AttrResult = await this.$API.spu.getSaleAttrList();
      if (AttrResult.code === 200 || AttrResult.code === 20000) {
        this.baseSaleAttrList = AttrResult.data;
      }
      //获取SPU图片列表
      // http://localhost:9529/dev-api/admin/product/spuImageList/1
      const spuImgResult = await this.$API.sku.getSpuImageList(spu.id);
      if (spuImgResult.code === 200 || spuImgResult.code === 20000) {
        let spuImageList = spuImgResult.data;

        spuImageList.forEach(item => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        })

        this.spuImageList = spuImageList
      }
      // 获取SPU详细信息
      // http://localhost:9529/dev-api/admin/product/getSpuById/1
      const spuInfoResult = await this.$API.spu.get(spu.id);
      if (spuInfoResult.code === 200 || spuInfoResult.code === 20000) {
        this.spuInfo = spuInfoResult.data
      }
    },
    // 点击添加销售属性
    addSaleAttr() {
      let [baseSaleAttrId, saleAttrName] = this.selectSaleAttrIdName.split(':');
      let obj = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] };

      this.spuInfo.spuSaleAttrList.push(obj);
      this.selectSaleAttrIdName = '';
    },
    // 点击显示Input框
    showInput(row) {
      // 点击添加属性值，添加一个isEdit属性
      this.$set(row, 'isEdit', true);
      this.$set(row, 'saleAttrValueName', '');

      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      })
    },
    //失去焦点或按键抬起，回车
    handleInputConfirm(row) {
      let { saleAttrValueName, baseSaleAttrId } = row;

      // 判断输入得属性值是否为空
      if (!saleAttrValueName.trim()) {
        // this.$message.error('属性值不能为空');
        row.saleAttrValueName = '';
        row.isEdit = false;
        return;
      };
      // 判断属性值是否重复
      let isRepeat = row.spuSaleAttrValueList.some(item => saleAttrValueName === item.saleAttrValueName);
      if (isRepeat) {
        this.$message.error('输入得属性值重复');
        row.isEdit = false;
        row.saleAttrValueName = ''
        return;
      }
      // 构建需要得参数对象
      let obj = { saleAttrValueName, baseSaleAttrId };
      row.spuSaleAttrValueList.push(obj);
      row.isEdit = false;
      row.saleAttrValueName = ''
    },
    // 点击save发送请求
    async saveSpu() {
      //获取参数
      let { category3Id, spuInfo, spuImageList } = this;
      // 整理参数
      spuInfo.category3Id = category3Id;
      // 图片列表
      spuInfo.spuImageList = spuImageList.map(item => {
        return { imgName: item.name, imgUrl: item.imgUrl || item.response.data, }
      })
      // 去除多余的属性
      spuInfo.spuSaleAttrList.forEach(item => {
        delete item.isEdit;
        delete item.saleAttrValueName;
      })
      // 发请求
      try {
        const result = await this.$API.spu.addUpdate(spuInfo);
        if (result.code === 20000 || result.code === 200) {
          this.$message.success('保存成功');
          // 返回到列表显示区
          this.$emit('update:isShowSpuForm', false);
          // 列表区重新请求数据
          this.$emit('saveSuccess', spuInfo.id);
          // 重置data得数据
          Object.assign(this._data, this.$options.data());

        } else {
          this.$message.error('保存失败')
        }
      } catch (error) {
        this.$message.error('请求发送失败');
      }

    }



  },
  computed: {
    unSelectSaleAttrList() {
      return this.baseSaleAttrList.filter(item => this.spuInfo.spuSaleAttrList.every(item1 => item.name !== item1.saleAttrName))
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
