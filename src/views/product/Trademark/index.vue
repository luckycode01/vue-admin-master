<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">添加</el-button>
    <el-table :data="pageList" style="width: 100%;margin-top:20px" border>
      <el-table-column type="index" align="center" label="序号" width="100px"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" width="60px" height="60px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="warning" size="mini" icon="el-icon-edit" @click="showUpdateDialog(row)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteTrademark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="text-align:center" :pager-count="7" @size-change="handleSizeChange" @current-change="getPageList" :current-page="page" :page-sizes="[2, 3, 5, 7]" :page-size="limit" :total="total" layout="prev, pager, next, ->,jumper, sizes,total">
    </el-pagination>

    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" @close="closeDialog" :visible.sync="dialogVisible" width="width">
      <el-form :model="tmForm" ref="tmFormRef" label-width="100px" :rules="rules">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    var tmNameValidate = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error('请输入2-10个字符的名称'))
      } else {
        callback()
      }
    }
    return {
      page: 1, //当前页
      limit: 2, //每页显示的数量
      total: 0,

      pageList: [],
      // 控制对话框
      dialogVisible: false,
      // imageUrl: "", //上传图片显示

      // 添加表单
      tmForm: {
        // id: 0,
        logoUrl: "",
        tmName: ""
      },
      // 验证规则
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: 'blur' },
          { validator: tmNameValidate, trigger: 'change' },
        ],
        logoUrl: [
          { required: true, message: "请上传图片", trigger: 'blur' },
        ]
      }
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    // 获取分页列表
    async getPageList(page = 1) {
      try {
        this.page = page;
        const res = await this.$API.trademark.getPageList(
          this.page,
          this.limit
        );
        if (res.code === 200 || res.code === 20000) {
          this.pageList = res.data.records;
          this.total = res.data.total;
          // this.$message.success('获取列表成功');
        } else {
          this.$message.error("获取列表失败");
        }
      } catch (error) {
        this.$message.error("请求获取列表失败");
      }
    },
    // 改变每页显示数量
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    //文件上传成功
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.tmForm.logoUrl = res.data;
    },
    // 文件上传成功
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
    // 打开对话框
    closeDialog() {
      this.$refs.tmFormRef.resetFields();
    },
    //打开编辑对话框
    showUpdateDialog(row) {
      this.dialogVisible = true;
      this.tmForm = { ...row };
    },
    // 点击确定
    addOrUpdate() {
      this.$refs.tmFormRef.validate(async (valid) => {
        if (valid) {
          try {
            const res = await this.$API.trademark.addOrUpdate(this.tmForm);
            if (res.code === 20000 || res.code === 200) {
              this.$message.success(this.tmForm.id ? '修改品牌成功' : '添加品牌成功');
              // 重新获取列表，如果是添加回到第一页，修改停留再当前页
              this.getPageList(this.tmForm.id ? this.page : 1);
              this.dialogVisible = false;
            } else {
              this.$message.error(this.tmForm.id ? '修改品牌失败' : '添加品牌失败');
            }
          } catch (error) {
            this.$message.error("请求失败")
          }
        } else {
          this.$message.error('输入的信息有误，请重新输入');
        }
      })
    },
    // 删除
    deleteTrademark(row) {
      this.$confirm(`是否删除${row.tmName}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$API.trademark.delete(row.id);
        if (res.code === 200 || res.code === 20000) {
          this.$message({ type: 'success', message: '删除成功!' });
          this.getPageList(this.pageList.length > 1 ? this.page : this.page - 1);
        } else {
          this.$message.error('删除品牌失败');
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }

  }
};
</script>

<style lang="scss" scoped></style>
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
