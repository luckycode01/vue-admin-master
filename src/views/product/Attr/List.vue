<template>
  <div>
    <el-card>
      <Category @changeCategory="changeCategory"></Category>
    </el-card>
    <el-card style="margin-top:20px;">
      <div v-show="isShowList">
        <el-button type="primary" icon="el-icon-plus" @click="showAddDiv" :disabled="!category3Id">添加属性</el-button>
        <el-table :data="attrList" border style="margin-top:20px;width:100%">
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="140"></el-table-column>
          <el-table-column label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag style="margin-right:10px" type="success" v-for="attrValue in row.attrValueList" :key="attrValue.id">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column width="140" label="操作">
            <template slot-scope="{ row }">
              <HintButton type="warning" size="mini" icon="el-icon-edit" @click="showUpdateDiv(row)" title="编辑">
              </HintButton>
              <HintButton type="danger" size="mini" icon="el-icon-delete" title="删除">
              </HintButton>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowList">
        <el-form ref="" :model="attrForm" label-width="80px" :inline="true">
          <el-form-item label="属性名">
            <el-input v-model="attrForm.attrName" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrForm.attrName">添加属性值</el-button>
        <el-button @click="isShowList = true">取消</el-button>
        <el-table :data="attrForm.attrValueList" style="width: 100%;margin:20px" border>
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column label="属性值名称" width="width">
            <template slot-scope="{ row, $index}">
              <el-input :ref="$index" v-if="row.isEdit" v-model="row.valueName" placeholder="请输入属性值" @blur='toSpan(row)' @keyup.enter.native="toSpan(row)" size="mini"></el-input>
              <span v-else @click='toEdit(row,$index)'>{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row }">
              <HintButton type="danger" size="mini" icon="el-icon-delete" title="删除">
              </HintButton>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" icon="el-icon-plus" @click="showAddDiv" :disabled="attrForm.attrValueList.length === 0">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //属性列表
      attrList: [],
      // 显示列表，和添加或修改属性
      isShowList: true,
      // 收集属性信息
      attrForm: {
        attrName: "", //属性名
        attrValueList: [],
        categoryId: 0, //属性Id 三级分类id
        categoryLevel: 3 //表示是几级分类，默认是三级
        // id: 0 //添加的时候没有id
      }
    };
  },
  methods: {
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        // 清空二级分类，三级分类的id
        this.category2Id = "";
        this.category3Id = "";
        // 清空属性列表
        this.attrList = [];
        // 选择一级分类，保存传过来的一级分类的id
        this.category1Id = categoryId;
      } else if (level === 2) {
        this.category3Id = "";
        this.attrList = [];
        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        this.getAttrList();
      }
    },
    async getAttrList() {
      const res = await this.$API.attr.attrInfoList(
        this.category1Id,
        this.category2Id,
        this.category3Id
      );
      if (res.code === 200 || res.code === 20000) {
        this.attrList = res.data;
      }
    },
    // 点击添加属性
    showAddDiv() {
      // 显示添加属性页
      this.isShowList = false;
      // 清空表单
      this.attrForm = {
        attrName: "", //属性名
        attrValueList: [],
        categoryId: 0, //属性Id 三级分类id
        categoryLevel: 3 //表示是几级分类，默认是三级
        // id: 0 //添加的时候没有id
      }
    },
    addAttrValue() {
      // 点击添加就添加一项，占位思想
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id, //当前属性的id，如果没有就是 undefined
        // id: 0, //添加没有id
        valueName: "",
        // 是否编辑
        isEdit: true,
      });
      // 自动获取焦点
      this.$nextTick(() => this.$refs[this.attrForm.attrValueList.length - 1].focus())

    },
    showUpdateDiv(row) {
      this.isShowList = false;
      this.attrForm = cloneDeep(row);
      this.attrForm.attrValueList.forEach(item => this.$set(item, 'isEdit', false));
    },
    // 失去焦点，或回车
    toSpan(row) {
      // 判断输入是否为空
      if (!row.valueName.trim()) return row.valueName = '';
      // 如果不为空，判断输入的属性值是否存在
      const repeat = this.attrForm.attrValueList.some(item => {
        if (item !== row) {
          return item.valueName === row.valueName;
        }
      })
      if (repeat) {
        this.$message.error('输入的属性值已存在');
        row.valueName = '';
        return;
      }
      row.isEdit = false;
    },
    // 点击编辑
    toEdit(row, index) {
      row.isEdit = true;
      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs[index].focus();
      })
    }
  }
};
</script>

<style lang="scss" scoped></style>
