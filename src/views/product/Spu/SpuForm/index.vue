<template>
  <el-form label-width="100px" :model="spuInfo">
    <el-form-item label="SPU名称">
      <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
    </el-form-item>

    <el-form-item label="品牌">
      <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
        <el-option
          :label="tm.tmName"
          :value="tm.id"
          v-for="(tm, index) in trademarkList"
          :key="tm.id"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述">
      <el-input
        v-model="spuInfo.description"
        placeholder="SPU描述"
        type="textarea"
        rows="4"
      ></el-input>
    </el-form-item>

    <el-form-item label="SPU图片">
      <!-- :file-list="spuImageList"就是在展示图片列表
      每个图片对象当中必须有name和url -->
      <el-upload
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :file-list="spuImageList"

        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handlePictureSuccess"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-select
        v-model="saleAttrIdName"
        :placeholder="
          unSelectSaleAttrList.length > 0
            ? `还有${unSelectSaleAttrList.length}未选择`
            : '没有啦！！！'
        "
      >
        <el-option
          :label="unSelectSaleAttr.name"
          :value="`${unSelectSaleAttr.id}:${unSelectSaleAttr.name}`"
          v-for="(unSelectSaleAttr, index) in unSelectSaleAttrList"
          :key="unSelectSaleAttr.id"
        ></el-option>
      </el-select>

      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!saleAttrIdName"
        @click="addSaleAttr"
        >添加销售属性</el-button
      >
      <!-- 展示的是spuInfo自己的销售属性列表 -->
      <el-table border style="width: 100%" :data="spuInfo.spuSaleAttrList">
        <el-table-column type="index" align="center" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="saleAttrName" label="属性名" width="150">
        </el-table-column>
        <el-table-column prop="prop" label="属性值名称列表" width="width">
          <template slot-scope="{ row, $index }">
            <!-- closable控制tag组件是否带有×
            :disable-transitions="false"tag关闭的时候是否有过度 -->
            <!--  -->
            <el-tag
              v-for="(saleAttrValue, index) in row.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              closable
              :disable-transitions="false"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ saleAttrValue.saleAttrValueName }}
            </el-tag>

            <!-- v-model="row.saleAttrValueName"
            代表用户输入数据先把数据存在row身上，row一开始是没有saleAttrValueName这个属性
            v-model决定了用户一旦输入，row身上就会多saleAttrValueName，并且是响应式
            假设用户不输入，那么row身上是不会存在saleAttrValueName这个属性，用户拿到这个数据
            就是undefined -->
            <el-input
              v-if="row.isEdit"
              v-model="row.saleAttrValueName"
              class="input-new-tag"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
            >
            </el-input>
            <!--  -->
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(row)"
              >添加</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="150">
          <template slot-scope="{ row, $index }">
            <HintButton
              type="danger"
              icon="el-icon-delete"
              size="mini"
              title="删除"
              @click="spuInfo.spuSaleAttrList.splice($index,1)"
            ></HintButton>
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
  name: "SpuForm",
  // props:['isShowSpuForm'],
  data() {
    return {
      category3Id:'',
      dialogImageUrl: "",
      dialogVisible: false,

      saleAttrIdName: "", //选择未选中的销售属性收集的数据

      // 添加的时候，是需要自己去定义这个对象
      // 修改的时候，其实用的不是这个对象是你自己请求回来赋值的对象
      // 无论我们在做添加还是做修改，我们都要两者考虑
      // 这里其实是把添加和修改一起考虑的
      // 下面这个初始化对象是为添加准备的，修改用的不是这个对象
      spuInfo: {
        category3Id: "",
        // v-model直接收集
        description: "",
        spuName: "",
        tmId: "",
        // id: 0,添加的时候不需要id
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          // spuSaleAttrValueList: [
          //   {
          //     baseSaleAttrId: 0,
          //     id: 0,
          //     isChecked: "string",
          //     saleAttrName: "string",
          //     saleAttrValueName: "string",
          //     spuId: 0,
          //   },
          // ],
          // },
        ],
      },
      spuImageList: [], //spu的图片列表，收集图片也先收集到这个里面，后面发请求是需要整理的
      trademarkList: [], //所有的品牌列表
      baseSaleAttrList: [], //所有的销售属性列表
    };
  },
  methods: {
    // 上传图片成功的回调，这里面用户也要收集新的图片列表
    handlePictureSuccess(res, file, fileList) {
      this.spuImageList = fileList;
    },

    // 删除图片的时候的回调函数，点击图片删除的操作，里面需要收集新的图片列表
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.spuImageList = fileList;
    },
    // 预览大图的时候，点击图片放大镜的操作
    // 这个函数我们不需要动，人家已经做好了
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
    async getUpdateSpuFormInitData(spu,category3Id) {
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
    // 用户点击添加销售属性
    addSaleAttr() {
      // 1、把刚才收集到的选择的销售属性id和name给拿到，解构
      let [baseSaleAttrId, saleAttrName] = this.saleAttrIdName.split(":");
      // 2、把id name变为要添加的对象，添加到指定的数组里面
      let obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spuInfo.spuSaleAttrList.push(obj);
      //3、清空原来选择的数据
      this.saleAttrIdName = "";
    },

    // 点击销售属性值的添加按钮
    showInput(row) {
      // row.isEdit = true
      this.$set(row, "isEdit", true);
      // 为了防止用户点击然后不输入，导致row身上是没有saleAttrValueName，它就是undefined
      this.$set(row, "saleAttrValueName", '');

      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    // 当input失去焦点或者回车的时候
    handleInputConfirm(row) {
      // 1、把刚才收集的销售属性值名称拿到
      let { baseSaleAttrId, saleAttrValueName } = row;

      // 判断用户输入的东西不能是空的
      if (saleAttrValueName.trim() === "") {
        // 这里不能写提示信息。，因为回车事件包含了blur，当我们
        // 回车之后，回车事件会立马执行这个函数一遍，紧接着blur又会执行一遍
        // this.$message.error('属性值名称不能为空')
        row.saleAttrValueName = "";
        row.isEdit = false;
        return;
      }
      // 判断用户输入的东西是不是和以前的有重复,不需要除去自身
      // 之前平台属性我们判断要除去自身是因为我们用的占位，首先先加进去的对象，后面才给的值
      // 而这里是先给的值，后面才加进去的
      let isRepeat = row.spuSaleAttrValueList.some(
        (item) => item.saleAttrValueName === saleAttrValueName.trim()
      );
      if (isRepeat) {
        this.$message.error("属性值名称不能重复");
        row.saleAttrValueName = "";
        row.isEdit = false;
        return;
      }
      // 2、把收集到的数据拿到之后构造成我们的属性值对象
      let obj = { baseSaleAttrId, saleAttrValueName };
      // 3、把构造好的属性值对象添加到当前这个属性的属性值列表当中
      row.spuSaleAttrValueList.push(obj);

      // 4、把input里面内容清除
      row.saleAttrValueName = "";
      // 5、让input变为button
      row.isEdit = false;
    },
    // 点击保存按钮的操作
    async save(){
      // 获取参数数据
      let {category3Id,spuInfo,spuImageList} = this
      // 整理参数
      // 整理category3Id
      spuInfo.category3Id = category3Id
      // 整理图片列表
      // 图片列表有新添加的图片也有老的图片
      // 整理的图片目标
      //   imgName: "string",
      //   imgUrl: "string",
      spuInfo.spuImageList = spuImageList.map(item => {
        return {
          imgName:item.name,
          imgUrl:item.imgUrl||item.response.data
        }
      })
      //整理销售属性去除身上多余的属性
      spuInfo.spuSaleAttrList.forEach(item => {
        delete item.isEdit
        delete item.saleAttrValueName
      })
      // 发请求
      try {
         // 成功干啥
        const result = await this.$API.spu.addUpdate(spuInfo)
        if(result.code === 200 || result.code === 20000){
          // 1、提示
          this.$message.success('保存spu成功')
          // 2、返回到列表页 (触发.sync的事件)
          // 之前我们所有的东西都是在父组件，我们只需要直接修改父组件的数据就行比如品牌 平台属性
          // 现在我们不再是所有的东西都在父组件，而是有父子组件通信
          this.$emit('update:isShowSpuForm', false)
          // 3、还得再次通知父组件，保存成功回来了
          this.$emit('backSuccess',spuInfo.id)
          // 4、我们要切记清空当前组件data当中所有的数据
          // 因为data里面的数据不清空，下次用户再点击进来，我们之前的数据还是存在的
          // 这个组件并不会销毁，所以数据依然存在
          this.resetData()
        }else{
          this.$message.success('保存spu失败')
        }
      } catch (error) {
        // 失败干啥
        this.$message.error('请求保存spu失败')
      }
    },
    // 清空data所有的数据
    resetData(){
      // console.log(this.$options.data)
      // this.$options.data是函数，调用完成拿到最初始的data返回的对象
      Object.assign(this._data,this.$options.data())

      // 复杂写法
      // this.category3Id =''
      // this.dialogImageUrl = ""
      // this.dialogVisible =  false
      // this.saleAttrIdName = ""
      // this.spuInfo = {
      //   category3Id: "",
      //   description: "",
      //   spuName: "",
      //   tmId: "",
      //   spuImageList: [],
      //   spuSaleAttrList: [],
      // }
      // this.spuImageList = []//spu的图片列表，收集图片也先收集到这个里面，后面发请求是需要整理的
      // this.trademarkList = [] //所有的品牌列表
      // this.baseSaleAttrList =[] //所有的销售属性列表
    },
    // 点击取消操作
    cancel(){
      // 1、返回到列表页
      this.$emit('update:isShowSpuForm', false)
      // 2、清空当前data数据
      this.resetData()
    }

  },
  computed: {
    // 通过所有的销售属性列表（请求回来的）和spu自己的销售属性列表（spuInfo包含的）
    // 计算出来未选择的销售属性列表
    // 数组方法：
    // 从所有的销售属性列表当中过滤和spu自己的销售属性列表所有的属性名称都不一样的
    // filter + every
    unSelectSaleAttrList() {
      // return this.baseSaleAttrList.filter(item => {
      //   return this.spuInfo.spuSaleAttrList.every(item1 => {
      //     return item1.saleAttrName !== item.name
      //   })
      // })
      return this.baseSaleAttrList.filter((item) =>
        this.spuInfo.spuSaleAttrList.every(
          (item1) => item1.saleAttrName !== item.name
        )
      );
    },
  },
};
</script>

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
