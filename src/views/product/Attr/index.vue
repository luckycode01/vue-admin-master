<template>
  <div>
    <el-card>
      <Category @changeCategoryId="changeCategoryId" :isShowList="isShowList" ></Category>
    </el-card>
    <!-- -->
    <el-card style="margin-top: 20px">
      <div v-show="isShowList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="showAddAttr"
          :disabled="!category3Id"
          >添加属性</el-button
        >
        <el-table :data="attrInfoList" style="width: 100%" border>
          <el-table-column
            type="index"
            label="序号"
            width="80"
            height
          ></el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
          ></el-table-column>
          <el-table-column label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                style="margin-right: 10px"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row }">
              <HintButton
                type="warning"
                size="mini"
                icon="el-icon-edit"
                @click="showUpdateAttr(row)"
                :title="'编辑'"
              ></HintButton>
              <el-popconfirm
                @onConfirm="deleteAttr(row)"
                :title="`确定要删除${row.attrName}吗？`"
              >
                <HintButton
                  slot="reference"
                  size="mini"
                  :title="'删除'"
                  type="danger"
                  icon="el-icon-delete"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowList">
        <el-form :model="attrForm" label-width="80px" :inline="true">
          <el-form-item label="属性名">
            <el-input v-model="attrForm.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button
          :disabled="!attrForm.attrName"
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>
        <el-table
          :data="attrForm.attrValueList"
          border
          style="width: 100%; margin: 20px 0"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                :ref="$index"
                size="mini"
                v-if="row.isEdit"
                v-model="row.valueName"
                placeholder="请输入属性值"
                @blur="isShowSpan(row)"
                @keyup.enter.native="isShowSpan(row)"
              ></el-input>
              <span v-else @click="toEdit(row, $index)">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                @onConfirm="deleteAttrValue($index)"
                :title="`确定要删除${row.valueName}吗？`"
              >
                <HintButton
                  slot="reference"
                  size="mini"
                  :title="'删除'"
                  type="danger"
                  icon="el-icon-delete"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="saveAttr"
          :disabled="attrForm.attrValueList.length === 0"
          >保存</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 是否显示列表
      isShowList: true,
      // 属性列表
      attrInfoList: [],
      // 收集属性名称
      attrForm: {
        attrName: "",
        categoryId: "",
        categoryLevel: 3,
        // id: 0,
        attrValueList: [
          // {
          //   attrId: 0,
          //   id: 0,
          //   valueName: "string",
          // },
        ],
      },
    };
  },
  methods: {
    changeCategoryId({ categoryId, level }) {
      if (level === 1) {
        // 情况二级、三级分类id,及属性列表
        this.category2Id = "";
        this.category3Id = "";
        this.attrInfoList = [];

        this.category1Id = categoryId;
      } else if (level === 2) {
        this.category3Id = "";
        this.attrInfoList = [];

        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        this.getAttrInfoList();
      }
    },
    // 发请求获取平台属性列表
    async getAttrInfoList() {
      const res = await this.$API.attr.getList(
        this.category1Id,
        this.category2Id,
        this.category3Id
      );
      if (res.code === 200 || res.code === 20000) {
        this.attrInfoList = res.data;
      }
    },
    // 切换到添加属性页
    showAddAttr() {
      this.isShowList = false;
      this.attrForm = {
        attrName: "",
        categoryId: this.category3Id,
        categoryLevel: 3,
        attrValueList: [],
      };
    },
    // 编辑属性
    showUpdateAttr(row) {
      this.isShowList = false;
      this.attrForm = cloneDeep(row);

      this.attrForm.attrValueList.forEach((item) => {
        this.$nextTick(() => {
          this.$set(item, "isEdit", false);
        });
      });
    },
    // 点击添加属性值
    addAttrValue() {
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id,
        valueName: "",
        // 编辑与显示
        isEdit: true,
      });
      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus();
      });
    },
    // 失去焦点或回车
    isShowSpan(row) {
      const valueName = row.valueName;
      // 判断输入的是否为空
      if (!valueName.trim()) {
        this.$message.error("属性值不能为空");
        row.valueName = "";
        return;
      }
      // 如果不为空，判断是否重复，需要出去自己
      const isRepeat = this.attrForm.attrValueList.some((item) => {
        if (row !== item) {
          return valueName === item.valueName;
        }
      });
      if (isRepeat) {
        this.$message.error("输入的属性值重复，请重新输入");
        row.valueName = "";
        return;
      }

      row.isEdit = false;
    },
    // 点击span到编辑框
    toEdit(row, index) {
      row.isEdit = true;
      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 删除属性值  使用气泡确认框
    deleteAttrValue(index) {
      this.attrForm.attrValueList.splice(index, 1);
    },
    // 点击保存
    async saveAttr() {
      // 获取数据
      const { attrForm } = this;
      // 整理数据
      //判断属性值是否为空 并删除多余的属性
      attrForm.attrValueList = attrForm.attrValueList.filter((item) => {
        if (item.valueName) {
          delete item.isEdit;
          return true;
        }
      });
      //判断有没有属性值
      if (attrForm.attrValueList.length === 0)
        return this.$message.error("请添加属性值");
      try {
        const res = await this.$API.attr.addOrUpdate(attrForm);
        if (res.code === 200 || res.code === 20000) {
          // 提示
          this.$message.success("保存属性成功");
          // 返回列表页
          this.isShowList = true;
          // 重新获取列表
          this.getAttrInfoList();
          //
        }
      } catch (error) {
        this.$message.error("请求失败");
      }
      // 发请求
    },
    // 删除属性
    async deleteAttr(row) {
      const res = await this.$API.attr.delete(row.id);
      if (res.code === 200 || res.code === 20000) {
        this.$message.success("删除成功");
        this.getAttrInfoList();
      } else this.$message.error("删除失败");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
