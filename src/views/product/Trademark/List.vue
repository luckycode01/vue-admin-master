<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog"
      >添加</el-button
    >

    <!-- element-ui表格用的很多 
    eltable 回车会出现表格自动带一个列
    看我们需要几个列，拷贝几个列-->

    <!-- el-table标签里面属性是表格属性，一般用的比较多的
    设定表格是否有边框   添加border 
    设定让表格显示的数据  data可以设定表格要展示的数据，数据格式必须是数组-->

    <!-- el-table-column标签里面属性是列的属性
    prop属性代表是显示的数据对象的哪个属性 
    labels设定这一列的表头名称用的
    width设定这一列的宽度
    type 设定这列的类型  type=index 代表是序号列，序号会自动填上
    align="center/left/right" 控制这一列数据显示居左还是居右还是居中
    -->

    <!-- table展示动态数据依赖的就是data属性，这个数据必须是数组
    当我们data有数据的时候，那么会默认把data的数据分别给每个列都传递一份 
    每个列组件内部是在展示我们的列表，说白了就是vfor，至于说展示的是这个列表当中对象的哪个属性
    我们需要自己通过prop指定
    内部只是展示我们的数据，而如果这个数据是需要额外的结构，那么内部说了不算，又外部（父组件）说了算
    -->
    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column align="center" type="index" label="序号" width="80">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <!-- row代表的就是当前遍历的这一项，如果你不知道row是谁，就看data是哪个数组 -->
        <!-- data里面的某一项就是这个row -->
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 80px; height: 60px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="showUpdateDialog(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- element-ui里面的分页器
    用法和我们当年定义的自己的分页器类似
    4个数据  一个事件
    :pager-count="7" 代表连续数，在这里说的是总按钮的数，比我们原来多2
    :page-sizes="[3, 5, 10] 可以改变每页的数量，第一个值必须和page-size一样
     -->
    <!--  @current-change="handleCurrentChange" 改变页面对应的事件-->
    <!--  @size-change="handleSizeChange" 改变每页显示数量的时候的事件 -->
    <el-pagination
      style="text-align: center"
      @current-change="getTrademarkList"
      @size-change="handleSizeChange"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :pager-count="7"
      :page-sizes="[3, 5, 10]"
      layout="prev, pager, next, jumper,->,sizes,total"
    >
    </el-pagination>

    <!-- 添加和修改使用的dialog -->
    <!-- form和table是以后我们用的最频繁的两个组件，一个用来收集数据，一个用来展示数据
    只要以后我们用到form，那么就得定义一个对象:model="tmForm" 指定收集数据对象（后面做表单验证）-->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="tmForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 上传文件是需要一个上传接口 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <!-- 下面的这个img是在做上传成功后，图片的预览 -->
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg文件，且不超过2M
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    var validateTmName = (rule, value, callback) => {
      if(value.length < 2 || value.length > 10){
        callback(new Error('品牌名称必须是2-10位')) //验证失败
      }else{
        callback() //验证通过
      }
    };
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,

      dialogFormVisible: false, //控制dialog的显示和隐藏

      // imageUrl: "", //upload里面自带的一个动态数据，后期不用可以删除
      tmForm: {
        // 指定的要收集数据收集的位置，这里面有什么属性，从接口文档去看
        logoUrl: "",
        tmName: "",
      },
      // 表单验证的规则
      // 表单验证的规则是一个对象
      // 对象里面是每个字段的验证规则，每个字段的验证规则是一个数组
      // 验证规则数组当中可以放多条验证规则，每条验证规则又是一个对象
      // 触发时机一共三种
      // blur失去焦点触发验证规则   change数据改变的时候触发    整体验证时触发
      rules: {
        tmName: [
          // 内置规则
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // {
          //   min: 2,
          //   max: 10,
          //   message: "长度在 2 到 10 个字符",
          //   trigger: "change",
          // },
          // 自定义规则验证品牌名称的长度
          { validator: validateTmName, trigger: "change" },
        ],

        logoUrl: [{ required: true, message: "请选择品牌LOGO" }],
      },
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    // 请求获取品牌列表数据
    async getTrademarkList(page = 1) {
      this.page = page;
      const result = await this.$API.trademark.getPageList(
        this.page,
        this.limit
      );
      if (result.code === 20000 || result.code === 200) {
        // console.log(result.data)
        this.trademarkList = result.data.records;
        this.total = result.data.total;
      }
    },
    // 修改每页的显式数量
    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList();
    },

    // upload上传成功，上传成功的时候会调这个函数，在这个函数里面我们要赶紧收集图片路径
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      // console.log(this.imageUrl)
      //blob:http://localhost:9528/d17bbda6-11bb-4cae-94a7-2d12ae5242a0
      // 上面这样的方式是不对的，因为获取的是本地的图片路径，我们不需要本地的图片路径
      // 而是需要拿到上传成功后，后台返回给我们的真实的服务器网络路径
      // console.log(res,file)
      // 收集真实的服务器图片路径
      this.tmForm.logoUrl = res.data || file.response.data;
    },
    // 代表上传前，对上传的文件进行格式和大小的限制,不需要我们操作，看懂即可
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 点击列表页添加按钮，显示添加的dialog
    showAddDialog() {
      this.dialogFormVisible = true;
      // 点击添加的时候弹出dialog，还要去清空dialog内部的数据
      // 否则这个用户添加完成点取消再次点击添加，以前的数据还在
      this.tmForm = {
        logoUrl: "",
        tmName: "",
      };
    },
    // 点击修改按钮，显示修改的dialog（其实和添加是同一个）
    // 添加的时候我们tmForm对象和修改的时候不是同一个对象
    // 添加的时候我们用的是上面data当中自己定义的对象里面有logoUrl和tmName
    // 修改的时候我们用的是列表页当中已经获取到的品牌对象，里面有id  logoUrl  tmName
    showUpdateDialog(row) {
      this.dialogFormVisible = true;
      // this.tmForm = row  //row里面本来就有id  logoUrl  tmName
      // 如果这样写，那么tmForm和列表页当中显示的就是同一个对象
      // 我们在tmForm当中修改了数据，外部列表页也会跟着同时修改
      // 此时我们需要让他们不是同一个对象，但是内部东西是一样的
      this.tmForm = { ...row };

      // 要想明白深浅拷贝，必须先明白拷贝
      // 拷贝：数据必须出现一个新的内存，才叫拷贝
      // var a = 10;
      // var b = a
      // 不存在拷贝，也就是说基本值是不存在拷贝的

      // 我们所说的拷贝是面向对象数据类型的
      // var arr = []
      // var arr1 = arr
      // 这样是不会出现拷贝的

      // 既然拷贝是面向对象数据的，那么深浅拷贝也就是面向对象数据说的
      // 什么是浅拷贝
      // 一个对象里面又有对象，当我们拷贝这个对象的时候，内部对象地址还是原来的 就是浅拷贝
      // 什么是深拷贝
      // 一个对象里面又有对象，当我们拷贝这个对象的时候，内部对象地址是新的，就是深拷贝
      // ##无论是深拷贝还是浅拷贝，说的都是对象数据内部的对象，对于我外部对象本身，是一定要有新地址，
      // 就是一定要拷贝的
      // 如果以后碰到对象内部没有对象数据，直接浅拷贝就完了
      // 如果以后碰到对象内部有对象数据，那么要看情况，深浅都可以
      // 浅拷贝做法
      // var obj = {
      //   a:100,
      //   b:200
      // }
      // 上面这个对象内部没有对象数据，那么我们只需要浅拷贝
      // 最简单的浅拷贝就是...
      // var obj1 = {
      //   ...obj
      // }
      // 深拷贝做法
      // var obj = {
      //   a:100,
      //   b:[1,2,3]
      // }
      // 深拷贝的话 拷贝出来的对象里面数组和原来的对象里面数组不是同一个，地址不一样
      // 浅拷贝的话 拷贝出来的对象里面数组和原来的对象里面数组是同一个，地址是一样的
      // 深拷贝，在我们目前没有一个现成的完美的解决方案，最接近的要属
      // JSON.stringify和 JSON.parse,但是也不完美
      // 今后我们要去深拷贝，得借助咱们的工具包  lodash里面封装的深拷贝
    },
    // 点击dialog的确定按钮，发请求添加或者修改
    addOrUpdateTrademark() {
      // 对表单进行整体验证
      this.$refs.tmForm.validate(async (valid) => {
        if (valid) {
          // 1、获取请求参数
          let trademark = this.tmForm;
          // 2、整理参数,如果参数是正确的就不需要整理了，如果参数有问题才需要整理
          // 3、发请求
          try {
            // 4、请求成功干啥
            const result = await this.$API.trademark.addOrUpdate(trademark);
            if (result.code === 200 || result.code === 20000) {
              // 提示
              this.$message.success(
                trademark.id ? "修改品牌成功" : "添加品牌成功"
              );
              // 关闭dialog，回到列表页
              this.dialogFormVisible = false;
              // 回到列表页面，重新请求获取列表页的数据
              // 请求列表页数据的时候，添加和修改请求的数据页码不同
              // 添加我们直接拿第一页就行，而修改我们要获取的是修改数据当前所在页
              this.getTrademarkList(trademark.id ? this.page : 1);
            } else {
              this.$message.error(
                trademark.id ? "修改品牌失败" : "添加品牌失败"
              );
            }
          } catch (error) {
            // 5、请求失败干啥
            this.$message.error("请求失败");
          }
        } else {
          this.$message.error("表单验证不合法");
          return false;
        }
      });
    },
    // 点击列表页删除按钮，请求删除品牌
    deleteTrademark(row) {
      // 点击删除先弹出messageBox提示
      this.$confirm(`你确定要删除${row.tmName}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 用户点击确定的时候，要发请求
          try {
            const result = await this.$API.trademark.delete(row.id);
            if (result.code === 200 || result.code === 20000) {
              // 提示
              this.$message.success("删除品牌成功");
              // 重新获取列表数据
              // 删除哪一页的数据重新还是在哪一页，除非是最后一页，而且只有一条，删除之后回到前一页
              this.getTrademarkList(
                this.trademarkList.length > 1 ? this.page : this.page - 1
              );
            } else {
              this.$message.error("删除品牌失败");
            }
          } catch (error) {
            this.$message.error("请求失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
