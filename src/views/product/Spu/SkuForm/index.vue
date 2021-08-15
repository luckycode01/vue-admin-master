<template>
  <el-form label-width="100px" :model="skuInfo">
    <el-form-item label="SPU名称"> {{ spu.spuName }}</el-form-item>

    <el-form-item label="SKU名称">
      <el-input v-model="skuInfo.skuName" placeholder="SKU名称"></el-input>
    </el-form-item>

    <el-form-item label="价格(元)">
      <el-input
        v-model="skuInfo.price"
        placeholder="价格(元)"
        type="number"
      ></el-input>
    </el-form-item>

    <el-form-item label="重量(千克)">
      <el-input
        v-model="skuInfo.weight"
        placeholder="重量(千克)"
        type="number"
      ></el-input>
    </el-form-item>

    <el-form-item label="规格描述">
      <el-input
        v-model="skuInfo.skuDesc"
        placeholder="规格描述"
        type="textarea"
        rows="4"
      ></el-input>
    </el-form-item>

    <el-form-item label="平台属性">
      <el-form :inline="true" label-width="100px">
        <el-form-item
          :label="attr.attrName"
          v-for="(attr, index) in attrList"
          :key="attr.id"
        >
          <el-select v-model="attr.attrIdValueId" placeholder="请选择">
            <el-option
              :label="attrValue.valueName"
              :value="`${attr.id}:${attrValue.id}`"
              v-for="(attrValue, index) in attr.attrValueList"
              :key="attrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-form :inline="true" label-width="100px">
        <el-form-item
          :label="saleAttr.saleAttrName"
          v-for="(saleAttr, index) in spuSaleAttrList"
          :key="saleAttr.id"
        >
          <el-select v-model="saleAttr.saleAttrIdValueId" placeholder="请选择">
            <el-option
              :label="saleAttrValue.saleAttrValueName"
              :value="`${saleAttr.id}:${saleAttrValue.id}`"
              v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
              :key="saleAttrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="图片列表">
      <el-table
        border
        style="width: 100%"
        :data="spuImageList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55">
        </el-table-column>
        <el-table-column prop="prop" label="图片" width="width">
          <template slot-scope="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 80px" />
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template slot-scope="{ row, $index }">
            <el-button
              @click="changeDefault(row, spuImageList)"
              v-if="row.isDefault === '0'"
              type="primary"
              size="mini"
              >设为默认</el-button
            >
            <el-tag v-else type="success">默认</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spu: {}, //这里面包含父组件传递过来的,需要整理
      
      attrList: [], //包含我们收集的平台属性值相关的信息
      spuSaleAttrList: [], //包含我们收集的销售属性值相关的信息
      spuImageList: [], //这个列表是spu的图片列表,只是让页面显示用的,不能被覆盖
      skuImageList: [], //这个列表才是收集当前sku的图片列表
      // skuInfo就是后面我们收集的对象，里面要收集什么，需要参考接口文档
      skuInfo: {
        // createTime: "2021-08-11T06:40:13.986Z",
        // id: 0,
        // isSale: 0,
        // 收集的这些东西分为三大类：
        // 1、父组件给传递过来的spu当中可以获取到，我们不需要收集，后期直接整理进来就行
        category3Id: "",
        spuId: "",
        tmId: "",
        // 2、这4个是可以直接v-model收集的，
        price: "",
        weight: "",
        skuDesc: "",
        skuName: "",

        // 3、这4个是需要我们自己想办法写代码收集的

        skuDefaultImg: "", //默认图片

        // 下面这三个是先收集在spuInfo外面,最后保存才整理进来
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: "string",
          // },
        ],
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
      },
      // 下面这两个数据只是展示的时候测试用的，后期对不对不一定,不对，需要删除的
      // saleAttrValueId: "", //收集选中销售属性值的Id
      // attrValueId: "", //收集平台属性值的id
    };
  },
  methods: {
    // 请求获取页面初始化数据
    async getAddSkuFormInitData(spu, category1Id, category2Id) {
      this.spu = spu; //保存这个spu是为了上面第一项显示spu的名称要使用
      // 这里面是发请求获取初始化数据
      // Promise.all()
      // 功能：批量处理promise，并发处理promise
      // 参数：是一个promise对象的数组，数组里面全都是promise对象
      // 返回值：返回的是一个新的promise对象
      // 返回的promise对象成功和失败
      // 如果传递进去的多个promise对象有一个是失败的，那么返回的promise就是失败的，失败的原因就是
      // 第一个失败promise的原因
      // 如果传递进去的多个promise对象都是成功的，那么返回的promise就是成功的，成功的结果就是
      // 传递的多个promise成功的结果组成的数组

      // 获取平台属性列表
      // http://localhost:9529/dev-api/admin/product/attrInfoList/2/13/61
      let promise1 = this.$API.attr.getList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      // 获取spu的销售属性列表
      // http://localhost:9529/dev-api/admin/product/spuSaleAttrList/3
      let promise2 = this.$API.sku.getSpuSaleAttrList(spu.id);
      // 获取spu的图片列表
      // http://localhost:9529/dev-api/admin/product/spuImageList/3
      let promise3 = this.$API.sku.getSpuImageList(spu.id);
      const result = await Promise.all([promise1, promise2, promise3]);
      // result 是一个所有成功的结果组成的数组
      this.attrList = result[0].data;
      this.spuSaleAttrList = result[1].data;

      let spuImageList = result[2].data;
      spuImageList.forEach((item) => (item.isDefault = "0"));
      this.spuImageList = spuImageList;
    },

    // 选择spu图片列表的时候,收集sku的图片列表
    handleSelectionChange(val) {
      // console.log(val)
      // val就是我们选中的图片组成的数组,就是我们要收集的东西
      this.skuImageList = val;
    },
    // 排它设置默认图片
    changeDefault(row, spuImageList) {
      // 第一件事排它
      spuImageList.forEach((item) => (item.isDefault = "0"));
      row.isDefault = "1";
      // 第二件事设置完排它,赶紧收集默认的图片路径
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 清空data所有的数据
    resetData(){
      // console.log(this.$options.data)
      // this.$options.data是函数，调用完成拿到最初始的data返回的对象
      Object.assign(this._data,this.$options.data())
    },
    // 点击保存操作
    async save() {
      // 获取请求参数
      let { spu, attrList, spuSaleAttrList, skuImageList, skuInfo } = this;
      // 整理参数
      // 1、整理父组件传递过来的
      skuInfo.category3Id = spu.category3Id;
      skuInfo.spuId = spu.id;
      skuInfo.tmId = spu.tmId;
      // 2、整理图片列表
      // 目标图片
      // {
      //   imgName: "string",
      //   imgUrl: "string",
      //   isDefault: "string",
      //   spuImgId: 0,
      // },

      // 我们的
      // {
      //   id: 14;
      //   imgName: "6ef342197c8095b6.jpg";
      //   imgUrl: "http://47.93.148.192:8080/group1/M00/00/02/rBHu8l-rgfWAJllcAAEY0AkXL8M782.jpg";
      //   isDefault: "1";
      // }
      skuInfo.skuImageList = skuImageList.map(item => {
        return {
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id
        }
      })

      // 整理销售属性值列表和平台属性值列表
      // 我们得从外部的平台属性列表当中查找，看谁身上有当年我们收集的那个属性
      // 如果有这个属性，我们需要把这个属性值拿到转化为对象添加到skuInfo的平台属性值列表当中
      // 第一种麻烦写法
      // let arr = []
      // attrList.forEach(item => {
      //   if(item.attrIdValueId){
      //     // 如果这个属性身上有这个东西，代表当前我们收集了
          // let [attrId,valueId] = item.attrIdValueId.split(':')
          // let obj = {attrId,valueId}
      //     arr.push(obj)
      //   }
      // })
      // skuInfo.skuAttrValueList = arr

      // 第二种写法reduce
      // 整理平台属性值列表
      skuInfo.skuAttrValueList = attrList.reduce((prev,item) => {
        if(item.attrIdValueId){
          let [attrId,valueId] = item.attrIdValueId.split(':')
          let obj = {attrId,valueId}
          prev.push(obj)
        }
        return prev
      },[])
      // 整理销售属性值列表
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item) => {
        if(item.saleAttrIdValueId){
          let [saleAttrId,saleAttrValueId] = item.saleAttrIdValueId.split(':')
          let obj = {saleAttrId,saleAttrValueId}
          prev.push(obj)
        }
        return prev
      },[])
      // 发请求
      try {
        // 成功
        const result = await this.$API.sku.addUpdate(skuInfo)
        if(result.code === 200 || result.code === 20000){
          //1、提示
          this.$message.success('保存sku成功')
          //2、返回到spu列表页
          this.$emit('update:isShowSkuForm', false)
          //3、这次返回到spu列表页面不需要重新请求spu列表数据
          //4、返回列表页之后，清空当前data所有的数据
          this.resetData()
        }else{
          this.$message.error('保存sku失败')
        }
      } catch (error) {
        // 失败
        this.$message.error('请求保存sku失败')
      }
    },
    // 点击取消
    cancel(){
      this.$emit('update:isShowSkuForm',false)
      this.resetData()
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
