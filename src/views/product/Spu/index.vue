<template>
  <div>
    <el-card>
      <Category @changeCategoryId='changeCategoryId' :isShowList='isShowList'></Category>
    </el-card>
    <el-card style="margin-top: 20px">
      <div v-show='!isShowSpuform && !isShowSkuform'>
        <el-button type="primary" icon="el-icon-plus" @click='showAddSpuform' :disabled='!category3Id'>添加SPU</el-button>
        <el-table :data="spuInfoList" style="width: 100%" border>
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width"></el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width"></el-table-column>
          <el-table-column label="操作" width="270">
            <template slot-scope="{ row,$index }">
              <HintButton @click="showAddSkuForm" type='success' size='mini' icon='el-icon-plus' :title="'添加SKU'"></HintButton>
              <HintButton @click="showUpdateSpuForm(row)" type='warning' size='mini' icon='el-icon-edit' :title="'修改SPU'"></HintButton>
              <HintButton type='info' size='mini' icon='el-icon-info' :title="'查看SPU的SKU列表'"></HintButton>
              <el-popconfirm :title="`确定删除属性< ${row.spuName}>吗？` " @onConfirm='deleteSpu(row,$index)'>
                <HintButton slot="reference" type='danger' size='mini' icon='el-icon-delete' :title="'删除'"></HintButton>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>

        <el-pagination background style="text-align:center" @size-change="handleSizeChange" @current-change="getSpuInfoList" :current-page="page" :page-sizes="[2, 5, 7]" :page-size="limit" :total="total" layout=" prev, pager, next, jumper, ->,sizes, total">
        </el-pagination>
      </div>

      <SpuForm ref="spu" @breakList='breakList' v-show="isShowSpuform" :isShowSpuform.sync="isShowSpuform"></SpuForm>
      <SkuForm ref='sku' v-show="isShowSkuform"></SkuForm>
    </el-card>
  </div>
</template>

<script>
import SpuForm from './SpuForm';
import SkuForm from './SkuForm';
export default {
  name: 'Spu',
  components: {
    SpuForm,
    SkuForm,
  },

  data() {
    return {
      isShowList: true,
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1,
      limit: 2,
      total: 0,
      // SPU列表
      spuInfoList: [],
      //控制添加或修改SPU和SKU的页面
      isShowSpuform: false,
      isShowSkuform: false,


    }
  },
  methods: {
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuInfoList();
    },
    // 接收category传递的Id参数
    changeCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category2Id = "";
        this.category3Id = "";
        this.spuInfoList = [];

        this.category1Id = categoryId
      } else if (level === 2) {
        this.category3Id = '';
        this.spuInfoList = [];

        this.category2Id = categoryId;

      } else {
        this.category3Id = categoryId;
        this.getSpuInfoList();
      }
    },
    // 获取SPU列表
    async getSpuInfoList(pager = 1) {
      this.page = pager;
      const { page, limit, category3Id } = this;
      const res = await this.$API.spu.getList(page, limit, category3Id);
      if (res.code === 200 || res.code === 20000) {
        this.spuInfoList = res.data.records;
        this.total = res.data.total;
      }
    },
    // 打开添加页面
    showAddSpuform() {
      this.isShowSpuform = true;
      this.$refs.spu.getAddSpuFormInitData(this.category3Id);
    },
    // 点击列表页修改spu按钮切换到SpuForm页面
    showUpdateSpuForm(row) {
      this.isShowSpuform = true;
      this.$refs.spu.getUpdateSpuFormInitData(row, this.category3Id);
    },

    // 点击列表页添加sku按钮切换到SkuForm页面
    showAddSkuForm(row) {
      this.isShowSkuForm = true;
      // row是当前点击的那个spu 它里面包含了category3Id,所以我们直接传1和2就行了
      this.$refs.sku.getAddSkuFormInitData(
        row,
        this.category1Id,
        this.category2Id
      );
    },
    // 子组件添加spu后返回父组件
    breakList(id) {
      // 如果传入的id存在，说明是修改页返回，不存在则是添加后返回
      id ? this.getSpuInfoList(this.page) : this.getSpuInfoList();
    },
    // 删除SPU
    async deleteSpu(row) {
      const res = await this.$API.spu.remove(row.id);
      if (res.code === 200 || res.code === 2000) {
        this.$message.success("删除成功");
        // 刷新列表
        this.getSpuInfoList(this.spuInfoList.length > 1 ? this.page : this.page - 1);
      } else {
        this.$message.error("删除失败");
      }
    }
  },
  watch: {
    isShowSpuform() {
      return this.isShowList = !this.isShowList;
    },
    isShowSkuform() {
      return this.isShowList = !this.isShowList;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
