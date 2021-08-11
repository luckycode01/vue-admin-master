<template>
  <div>
    <el-card>
      <Category @changeCategory="changeCategory" :isShowList='isShowList'></Category>
    </el-card>
    <el-card style="margin-top:20px;">
      <!-- sku列表显示 -->
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button type="primary" icon="el-icon-plus" @click="showAddSpuForm" :disabled='!category3Id'>添加SPU</el-button>
        <el-table :data="spuList" style="width: 100%;margin-bottom:20px;" border>
          <el-table-column label="序号" align="center" width="80" type="index"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width"></el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width"></el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{row}">
              <HintButton @click="showAddSkuForm(row)" title="添加SKU" type="success" icon="el-icon-plus" size="mini"></HintButton>
              <HintButton @click="showUpdateSpuForm(row)" title="修改SPU" type="warning" icon="el-icon-edit" size="mini"></HintButton>
              <HintButton title="查看SPU的SKU列表" type="info" icon="el-icon-info" size="mini"></HintButton>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <HintButton slot="reference" title="删除SPU" type="danger" icon="el-icon-delete" size="mini"></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination @size-change="handleSizeChange" @current-change="getSpuList" style="text-align:center;" background :current-page="page" :pager-count="7" :page-sizes="[2, 3, 5, 7]" :page-size="limit" layout=" prev, pager, next, jumper,->,sizes,total" :total="total">
        </el-pagination>
      </div>
      <!-- 添加或SPU -->
      <SpuForm v-show="isShowSpuForm" @saveSuccess='saveSuccess' :isShowSpuForm.sync='isShowSpuForm' ref="spu"></SpuForm>
      <!-- 添加SKU -->
      <SkuForm v-show="isShowSkuForm" :isShowSkuForm.sync='isShowSkuForm' ref="sku"></SkuForm>
    </el-card>
  </div>
</template>

<script>
import SpuForm from '@/views/product/Spu/SpuForm';
import SkuForm from '@/views/product/Spu/SkuForm';
export default {
  name: 'Spu',
  components: {
    SpuForm,
    SkuForm,
  },
  data() {
    return {
      isShowList: true,  //控制三级联动是否可用;
      category1Id: '',
      category2Id: '',
      category3Id: '',
      spuList: [],

      page: 1, //当前页
      limit: 2, //每页显示的数量
      total: 0, //总数

      isShowSpuForm: false, //显示添加，或修改spu
      isShowSkuForm: false, //显示添加sku
    }
  },
  methods: {
    changeCategory({ categoryId, level }) {
      if (level == 1) {
        this.category2Id = '';
        this.category3Id = '';
        this.spuList = [];
        this.category1Id = categoryId;
      } else if (level == 2) {
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
      const { page, category3Id, limit } = this;
      const result = await this.$API.spu.getList(page, limit, category3Id);
      if (result.code === 20000 || result.code === 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },
    // 改变每页显示的数量
    handleSizeChange(size) {
      this.limit = size;
      this.getSpuList();
    },
    // 点击 切换到更新spu
    showUpdateSpuForm(row) {
      this.isShowSpuForm = true;
      this.$refs.spu.getUpdateSpuFormInitData(row, this.category3Id);
    },
    // 点击切换到添加spu
    showAddSpuForm() {
      this.isShowSpuForm = true;
      this.$refs.spu.getAddSpuFormInitData(this.category3Id);
    },
    // 点击切换到添加sku
    showAddSkuForm(row) {
      this.isShowSkuForm = true;
      this.$refs.sku.getAddSkuFormInitData(row,this.category1Id,this.category2Id);
    },
    saveSuccess(id) {
      // 如果id不是undefin说明是更新，获取列表数据在当前页
      if (id) {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    // 删除SPU
    async deleteSpu(row) {
      try {
        const res = await this.$API.spu.remove(row.id);
        if (res.code === 200 || res.code === 20000) {
          this.$message.success('删除成功');
          this.getSpuList(this.spuList.length > 1 ? this.page : this.page - 1);
        }
      } catch (error) {
        this.$message.error('请求失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
