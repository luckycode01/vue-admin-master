
<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
    <el-table style="margin: 20px 0; width: 100%" border :data="trademarkList">
      <el-table-column label="序号" type="index" width="80"></el-table-column>
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="{row}">
          <img :src="row.logoUrl" alt="" width="80" height="60">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="showEditDialog(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTrademark(row)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination align="center" @size-change="handleSizeChange" @current-change="getTrademarkList" :current-page="page" :page-sizes="[3, 5, 7, 9]" :page-size="limit" layout="prev, pager, next, jumper,->,sizes,total" :total="total">
    </el-pagination>
    <!-- 添加或修改得对话框 -->
    <el-dialog :title="tmForm.id? '修改品牌':'添加品牌'" :visible.sync="dialogFormVisible" @close="closeDialog">
      <el-form :model="tmForm" :rules='rules' label-width="80px" style="width:80%" ref="tmFormRef">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" prop='logoUrl'>
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Trademark',
  data() {
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,
      // 对话框得显示与隐藏
      dialogFormVisible: false,
      // 添加或修改得表单收集
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      // 上传图片预览
      // imageUrl: ''
      //验证规则
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
          // { validator, trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请上传logo', trigger: 'blur' },
        ],
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
      if (result.code === 2000 || result.code === 200) {
        this.trademarkList = result.data.records;
        this.total = result.data.total;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getTrademarkList();
    },
    handleAvatarSuccess(res, file) {
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
    // 打开添加对话框
    showAddDialog() {
      this.tmForm = {
        logoUrl: "",
        tmName: "",
      };
      this.dialogFormVisible = true;
    },
    // 打开编辑对话框
    showEditDialog(row) {
      this.tmForm = { ...row }
      this.dialogFormVisible = true;

    },
    //关闭对话框时触发
    closeDialog() {
      this.$refs.tmFormRef.resetFields();
    },
    // 点击确定
    addOrUpdateTrademark() {
      this.$refs.tmFormRef.validate(async (valid) => {
        if (valid) {
          let trademark = this.tmForm;
          try {
            const result = await this.$API.trademark.addOrUpdate(trademark);
            if (result.code === 200 || result.code === 20000) {
              this.$message.success(trademark.id ? '修改品牌成功' : '添加品牌成功');
              // 关闭对话框
              this.dialogFormVisible = false;
              this.getTrademarkList(trademark.id ? this.page : 1);

            } else {
              this.$message.error(trademark.id ? '修改品牌失败' : '添加品牌失败')
            }
          } catch (error) {
            this.$message.error('请求发送失败');
          }
        } else {
          this.$message.error('品牌信息验证失败');
        }
      });
    },
    deleteTrademark(row) {
      this.$confirm(`是否删除品牌：${row.tmName}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const result = await this.$API.trademark.delete(row.id);
          if (result.code === 20000 || result.code === 200) {
            this.$message.success('删除成功');
            this.getTrademarkList(this.trademarkList.length <= 1 ? this.page - 1 : this.page)
          } else {
            this.$message.error('删除失败')
          }
        } catch (error) {
          this.$message.error('请求失败')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
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
