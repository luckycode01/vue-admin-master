<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
    <!-- 表格区 -->
    <el-table :data='trademarkList' style="width: 100%;" align="center" border>
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column label="品牌logo">
        <template slot-scope="{row}">
          <img :src="row.logoUrl" alt="" width="80" height="60">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="warning" icon='el-icon-edit' size="mini" @click="showEditDialog(row)">修改</el-button>
          <el-button type="danger" icon='el-icon-delete' size="mini" @click="deleteTrademark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- @size-change="handleSizeChange" @current-change="handleCurrentChange" -->
    <el-pagination background :pager-count='7' @size-change="handleSizeChange" @current-change="getTrademarkList" :current-page="page" :page-sizes="[3, 5, 7, 9]" :page-size="100" layout=" prev, pager, next, jumper,->, sizes ,total" :total="total">
    </el-pagination>
    <!-- 添加对话框 -->
    <el-dialog :title="tmForm.id? '修改品牌':'添加品牌'" :visible.sync="DialogFormVisible" @close="closeDialog">
      <el-form label-width="100px" style="width:80%" :model="tmForm" :rules="rules" ref="tmFormRef">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <!-- 上传图片 -->
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="DialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Trademark',

  data() {
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error('长度在 2 到10 个字符'));
      } else {
        callback();
      }
    }
    return {
      page: 1, //当前页
      limit: 3, //每页显示数量
      total: 0,  //总页数
      trademarkList: [], //品牌列表
      DialogFormVisible: false,   //添加或修改对话框
      // imageUrl: '', //update得动态数据
      // 搜集添加或修改品牌得表单数据
      tmForm: {
        logoUrl: '',
        tmName: ''
      },
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { validator: validateTmName, trigger: 'change' },
        ],
        logoUrl: [
          { required: true, message: '请上传品牌LOGO', trigger: 'blur' },
        ]
      }
    }
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    async getTrademarkList(page = 1) {
      this.page = page;
      const result = await this.$API.trademark.getPageList(this.page, this.limit);
      if (result.code == 2000 || result.code == 200) {
        this.trademarkList = result.data.records;
        this.total = result.data.total;
      }
    },
    // 修改每頁顯示的數量
    handleSizeChange(limit) {
      this.limit = limit;
      this.getTrademarkList();
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      // console.log(res, file);
      this.tmForm.logoUrl = res.data || file.response.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    showAddDialog() {
      this.tmForm = { logoUrl: '', tmName: '' };
      this.DialogFormVisible = true;
    },
    showEditDialog(row) {
      this.DialogFormVisible = true;
      this.tmForm = { ...row };
    },
    closeDialog() {
      this.$refs.tmFormRef.resetFields();
    },
    addOrUpdateTrademark() {
      this.$refs.tmFormRef.validate(async (valid) => {
        if (valid) {
          try {
            const trademark = this.tmForm;
            const result = await this.$API.trademark.addOrUpdate(trademark);
            if (result.code === 20000 || result.code === 200) {
              this.$message.success(trademark.id ? '修改品牌成功' : '添加品牌成功');
              this.DialogFormVisible = false;
              this.getTrademarkList(trademark.id ? this.page : 1)
            } else {
              this.$message.success(trademark.id ? '修改品牌失败' : '添加品牌失败');
            }
          } catch (error) {
            this.$message.error('请求失败');
          }
        } else {
          this.$message.error('输入品牌验证失败');
          return false;
        }
      });
    },
    deleteTrademark(row) {
      this.$confirm(`是否删除“${row.tmName}”品牌`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const result = await this.$API.trademark.deleteTrademark(row.id);
          if (result.code === 20000 || result.code === 200) {
            this.$message.success(`删除“${row.tmName}”成功`);
            this.getTrademarkList(this.trademarkList.length > 1 ? this.page : this.page - 1)
          } else {
            this.$message.error(`删除“${row.tmName}”失败`);
          }
        } catch (error) {
          this.$message.error(`请求失败`);
        }
      }).catch(() => {
        this.$message.error('已取消删除');
      });
    }
  }
}
</script>

<style lang="scss" scoped>
// .el-button {
//   margin-top: 10px;
// }
.el-table {
  margin: 20px 0;
}
// .el-pagination {
//   text-align: center;
// }
</style>
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
