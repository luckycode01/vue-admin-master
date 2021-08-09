<template>
  <div>
    <el-card>
      <Category @changeCategory="changeCategory" :isShowList='isShowList'></Category>
    </el-card>
    <!-- 列表区 -->
    <el-card style="margin-top:20px">
      <div v-show="isShowList">
        <el-button type="primary" icon="el-icon-plus" @click="showAddDiv" :disabled="!category3Id">添加属性</el-button>
        <!-- <el-button type="primary" icon="el-icon-plus" @click="showAddDiv">添加属性</el-button> -->
        <el-table :data="attrList" style="width:100%;margin-top:10px" border>
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{ row }">
              <el-tag style="margin-left:10px" type="success" v-for="attrValue in row.attrValueList" :key="attrValue.id">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{row}">
              <HintButton title="编辑" type="warning" icon="el-icon-edit" size="mini" @click="showUpdateDiv(row)"></HintButton>
              <el-popconfirm :title="`确定删除${row.attrValue}吗？`" @onConfirm='deleteAttrValue(row)'>
                <HintButton slot="reference" type='danger' size='mini' title="删除" icon='el-icon-delete'></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowList">
        <el-form :model="attrForm" :inline="true">
          <el-form-item label="属性名">
            <el-input v-model="attrForm.attrName" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrForm.attrName">添加属性值</el-button>
        <el-button type="" @click="isShowList = true">取消</el-button>
        <el-table :data="attrForm.attrValueList" style="width: 100%;margin:20px 0" border>
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{row,$index}">
              <el-input v-if="row.isEdit" :ref='$index' v-model="row.valueName" size="mini" placeholder="请输入属性值名称" @blur='toSpan(row)' @keyup.enter.native='toSpan(row)'></el-input>
              <span style="display:block;width: 100%;" v-else @click="toEdit(row,$index)">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm='attrForm.attrValueList.splice($index,1)'>
                <HintButton slot="reference" type='danger' size='mini' title="删除" icon='el-icon-delete'></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click='saveAttr' :disabled="attrForm.attrValueList.length === 0">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",

      // 属性列表
      attrList: [],
      //控制显示属性，还是添加属性
      isShowList: true,
      //
      attrForm: {
        attrName: "",
        attrValueList: [],
        categoryId: "", //收集的是三级分类的ID后面会收集
        categoryLevel: 3 //表示收集的id是几级
        // id: 0  //添加时ID不存在
      },
      visible: false,
    };
  },
  methods: {
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        // 如果level=1传过来得是1Id
        // 改变一级分类，此时应该清空二级，三级Id
        this.category2Id = "";
        this.category3Id = "";
        // 清空属性列表
        this.attrList = [];

        this.category1Id = categoryId;
      } else if (level === 2) {
        // 清空三级ID
        this.category3Id = "";
        this.attrList = [];

        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        // 选中三级分类时，应该发送请求获取属性信息列表
        this.getAttrList();
      }
    },
    // 获取属性列表
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.attrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 20000 || result.code === 200) {
        this.attrList = result.data;
      }
    },
    showAddDiv() {
      this.isShowList = false;
      this.attrForm = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id, //收集的是三级分类的ID后面会收集
        categoryLevel: 3 //表示收集的id是几级
        // id: 0  //添加时ID不存在
      }
    },
    // 点击添加属性值
    addAttrValue() {
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id, //属性Id，表示当前属性值的属性id
        // id: 0,  //添加时没有id
        valueName: "",
        // 是否编辑
        isEdit: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus();
      })
    },
    showUpdateDiv(row) {
      this.isShowList = false;
      // 深拷贝
      this.attrForm = cloneDeep(row);
      // 添加是否编辑的属性，使用$set达到响应式
      this.attrForm.attrValueList.forEach(item => this.$set(item, 'isEdit', false))
    },
    // 点击编辑
    toEdit(row, index) {
      row.isEdit = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      })
    },
    // 失去焦点或按下回车
    toSpan(row) {
      // 判断输入的是否为空
      const inputValueName = row.valueName;
      if (!inputValueName.trim()) {
        row.valueName = '';
        return;
      }
      // 判断是否有重复的属性值
      const repeat = this.attrForm.attrValueList.some((item) => {
        // 出去自身，看有没有和自己重复的
        if (item !== row)
          return item.valueName === row.valueName;
      })
      if (repeat) {
        this.$message.error('当前属性值重复');
        row.valueName = '';
        return;
      }
      row.isEdit = false;
    },
    async saveAttr() {
      // 获取参数
      const attr = this.attrForm;
      // 整理参数 属性值为空的删除，删除属性值的isEdit属性
      attr.attrValueList = attr.attrValueList.filter(item => {
        if (item.valueName) {
          delete item.isEdit;
          return true;
        }
      });
      if (attr.attrValueList.length === 0)
        return this.$message.error('请为属性添加属性值')
      // 发送请求
      try {
        const result = await this.$API.attr.saveAttrInfo(attr);
        if (result.code === 20000 || result.code === 200) {
          this.$message.success('保存属性成功');
          this.getAttrList();
          this.isShowList = true;
        } else {
          this.$message.error('保存属性失败');
        }
      } catch (error) {
        this.$message.error('请求发送失败')
      }
    },
    async deleteAttrValue(row) {
      try {
        const res = await this.$API.attr.deleteAttr(row.id);
        if (res.code === 200 || res.code === 20000) {
          this.$message.success('删除属性成功');
          this.getAttrList();
        } else {
          this.$message.error('删除属性失败')
        }
      } catch (error) {
        this.$message.error('删除属性请求发送失败')
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
