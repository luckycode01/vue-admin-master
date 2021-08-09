<template>
  <div>
    <el-card>
      <Category @changeCategory="changeCategory" :isShowList="isShowList"></Category>
    </el-card>
    <el-card style="margin-top:20px; ">
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button type="primary" icon="el-icon-plus" @click="showAddSpuForm">添加 SPU</el-button>
        <el-table :data="spuList" style="width: 100%" border>
          <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName" width="width"></el-table-column>
          <el-table-column label="SPU描述" prop="description" width="width"></el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row }">
              <HintButton title='添加SKU' type='success' icon='el-icon-plus' size='mini' @click="showAddSkuForm(row)"></HintButton>
              <HintButton title='修改SPU' type='warning' icon='el-icon-edit' size='mini' @click='showUpdateSkuForm(row)'></HintButton>
              <HintButton title='查看SPU的SKU列表' type='info' icon='el-icon-info' size='mini'></HintButton>
              <HintButton title='删除' type='danger' icon='el-icon-delete' size='mini'></HintButton>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="getSpuList" background :current-page="page" :page-sizes="[2, 5, 7, 9]" :page-size="limit" :total="total" :pager-count="7" style="text-align:center;margin-top:10px" layout=" prev, pager, next, jumper,->, sizes,total">
        </el-pagination>
      </div>
      <SpuForm ref="spu" v-show="isShowSpuForm" :isShowSpuForm.sync='isShowSpuForm'></SpuForm>
      <SkuForm v-show="isShowSkuForm"></SkuForm>

    </el-card>
  </div>
</template>

<script>
import SpuForm from './SpuForm';
import SkuForm from './SkuForm';

export default {
  name: "Spu",
  components: {
    SpuForm,
    SkuForm,
  },
  data() {
    return {
      // 分类id
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // spu列表
      spuList: [],
      // 是否请用分类选择
      isShowList: true,

      page: 1,  //当前页数
      limit: 2,
      total: 0,

      // 是否显示SPUForm或SKUForm
      isShowSpuForm: false,
      isShowSkuForm: false,
    };
  },
  methods: {
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        this.category2Id = '';
        this.category3Id = '';
        this.spuList = [];

        this.category1Id = categoryId
      } else if (level === 2) {
        this.category3Id = '';
        this.spuList = [];

        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    async getSpuList(pager = 1) {
      this.page = pager;
      const { page, limit, category3Id } = this
      const result = await this.$API.spu.getList(page, limit, category3Id);
      if (result.code === 200 || result.code === 20000) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },

    // 改变每页显示数量
    handleSizeChange(size) {
      this.limit = size;
      this.getSpuList();
    },
    // 添加spu
    showAddSpuForm() {
      this.isShowSpuForm = true;
      this.$refs.spu.getAddSpuInfoData();
    },
    // 修改SPU
    showUpdateSkuForm() {
      this.isShowSpuForm = true;
      this.$refs.spu.getUpdateSkuInfoData();
    },
    // 添加SKU
    showAddSkuForm() {
      this.isShowSkuForm = true;
    },
  }
};
</script>

<style lang="scss" scoped></style>
