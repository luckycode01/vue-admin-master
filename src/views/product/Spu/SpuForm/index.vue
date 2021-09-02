<template>
  <div>
    <el-form :model="spuInfo" label-width="100px">
      <el-form-item label="SPU名称">
        <el-input v-model="spuInfo.spuName" placeholder="请输入SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
          <el-option :label="tm.tmName" :value="tm.id" v-for="tm in trademarkList" :key="tm.is"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spuInfo.description" type="textarea" rows="4" placeholder="请输入SPU描述"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload :file-list="spuImageList" action="/dev-api/admin/product/fileUpload" list-type="picture-card" :on-success="handlePictureSuccess" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="saleAttrIdName" :placeholder="unSelectSaleAttrList.length>0?`还有${unSelectSaleAttrList.length}项未选择`:'没有了！！！'">
          <el-option :label="saleAttr.name" :value="`${saleAttr.id}:${saleAttr.name}`" v-for="saleAttr in unSelectSaleAttrList" :key='saleAttr.id'></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled='!saleAttrIdName' @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spuInfo.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150"></el-table-column>
          <el-table-column label="属性值列表" width="width">
            <template slot-scope="{row}">
              <el-tag style="margin-right:10px" type="success" v-for="(attrValue,index) in row.spuSaleAttrValueList" :key="attrValue.id" closable @close="row.spuSaleAttrValueList.splice(index,1)">{{attrValue.saleAttrValueName}}</el-tag>
              <el-input class="input-new-tag" v-if="row.isEdit" v-model="row.saleAttrValueName" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+添加</el-button>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="150">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确定删除属性< ${row.saleAttrName}>吗？` " @onConfirm='spuInfo.spuSaleAttrList.splice($index,1)'>
                <HintButton slot="reference" type='danger' size="mini" title="删除" icon='el-icon-delete'></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSpu" :disabled="spuInfo.spuSaleAttrList.length === 0">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,

      category3Id: '',
      trademarkList: [],  //所有品牌列表
      baseSaleAttrList: [], //所有销售属性列表
      spuImageList: [], //SPU图片列表

      //收集销售属性id
      saleAttrIdName: '',

      spuInfo: {
        tmId: '',
        category3Id: '',
        spuName: "",
        description: "",
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
      }
    };
  },

  methods: {
    handlePictureSuccess(res, file, fileList) {
      this.spuImageList = fileList;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    // 请求获取添加spu的初始化动态数据
    async getAddSpuFormInitData(category3Id) {
      this.category3Id = category3Id
      // 获取所有的品牌列表
      // http://localhost:9529/dev-api/admin/product/baseTrademark/getTrademarkList
      const trademarkResult = await this.$API.trademark.getList();
      if (trademarkResult.code === 200 || trademarkResult.code === 20000) {
        this.trademarkList = trademarkResult.data;
      }
      // 获取所有的销售属性
      // http://localhost:9529/dev-api/admin/product/baseSaleAttrList
      const attrResult = await this.$API.spu.getSaleAttrList();
      if (attrResult.code === 200 || attrResult.code === 20000) {
        this.baseSaleAttrList = attrResult.data;
      }
    },

    // 请求获取修改spu的初始化动态数据
    async getUpdateSpuFormInitData(spu, category3Id) {
      this.category3Id = category3Id
      // 根据spu的id获取spu的详情
      // http://localhost:9529/dev-api/admin/product/getSpuById/3
      const result = await this.$API.spu.get(spu.id);
      if (result.code === 200 || result.code === 20000) {
        this.spuInfo = result.data;
      }
      // 根据spu的id获取spu的图片列表
      // http://localhost:9529/dev-api/admin/product/spuImageList/3
      const imgResult = await this.$API.sku.getSpuImageList(spu.id);
      if (imgResult.code === 200 || imgResult.code === 20000) {
        let spuImageList = imgResult.data;
        // 给每个图片对象添加name和url,以便upload可以展示
        // 对象属性  无则添加  有则更改
        spuImageList.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });

        // 最后再赋值修改响应式属性，也可以保证我图片里面所有的东西都是响应式
        // 如果一个响应式属性被修改为一个非响应式的数据，那么这个非响应式数据在修改的瞬间也会变为响应式
        // 因为我们每个响应式属性，都有set方法，set方法内部修改的时候，是可以把数据也进行监视变为响应式
        this.spuImageList = spuImageList;
      }
      // 获取所有的品牌列表
      // http://localhost:9529/dev-api/admin/product/baseTrademark/getTrademarkList
      const trademarkResult = await this.$API.trademark.getList();
      if (trademarkResult.code === 200 || trademarkResult.code === 20000) {
        this.trademarkList = trademarkResult.data;
      }
      // 获取所有的销售属性
      // http://localhost:9529/dev-api/admin/product/baseSaleAttrList
      const attrResult = await this.$API.spu.getSaleAttrList();
      if (attrResult.code === 200 || attrResult.code === 20000) {
        this.baseSaleAttrList = attrResult.data;
      }
    },

    // 添加销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.saleAttrIdName.split(':');
      this.spuInfo.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      })
      this.saleAttrIdName = ''
    },
    //添加属性值
    showInput(row) {
      this.$set(row, 'isEdit', true);
      this.$set(row, 'saleAttrValueName', '')
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      })
    },
    //失去焦点，或回车
    handleInputConfirm(row) {
      // 将输入的内容添加到对应数组中
      const { baseSaleAttrId, saleAttrValueName } = row;
      // 判断输入的是否为空
      if (!row.saleAttrValueName) {
        this.$message.error('请输入属性值');
        row.isEdit = false;
        row.saleAttrValueName = '';
        return;
      }
      // 判断是否重复
      const isRepeat = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === saleAttrValueName.trim());
      if (isRepeat) {
        this.$message.error('当前输入的属性值重复，请重新输入');
        row.isEdit = false;
        row.saleAttrValueName = '';
        return;
      }
      row.spuSaleAttrValueList.push({
        baseSaleAttrId,
        saleAttrValueName,
      })
      row.saleAttrValueName = ''
      row.isEdit = false;
    },
    // 重置data数据
    resetData() {
      Object.assign(this._data, this.$options.data());
    },
    cancel() {
      this.$emit('update:isShowSpuform', false);
      this.resetData();
    },
    // 点击保存按钮
    async saveSpu() {
      const { spuInfo, spuImageList, category3Id } = this;
      // 整理参数
      spuInfo.category3Id = category3Id;
      // 图片整理
      spuInfo.spuImageList = spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data,
        }
      })
      // 去除多余属性
      spuInfo.spuSaleAttrList.forEach(item => {
        delete item.isEdit;
        delete item.saleAttrValueName;
      })
      // 发情求
      try {
        const res = await this.$API.spu.addUpdate(spuInfo);
        if (res.code === 200 || res.code === 20000) {
          this.$message.success('添加SPU成功');
          // 返回列表页
          this.$emit('update:isShowSpuform', false);
          // 通知父组件刷新列表
          this.$emit('breakList', spuInfo.id);
          // 重置data的数据
          this.resetData();

        } else {
          this.$message.error('添加spu失败')
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
