<template>
  <el-card>
    <el-table :data="skuInfoList" style="width: 100%" border stripe>
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"></el-table-column>
      <el-table-column label="默认图片" align="center" width="150">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg" alt="" width="80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" align="center" width="width"></el-table-column>
      <el-table-column prop="price" label="价格" align="center" width="width"></el-table-column>
      <el-table-column prop="prop" label="操作" align="center" width="240">
        <template slot-scope="{row}">
          <HintButton @click="onSale(row)" v-if="row.isSale ===0" size="mini" type='info' icon="el-icon-top"></HintButton>
          <HintButton @click="cancelSale(row)" v-else size="mini" type='success' icon="el-icon-bottom"></HintButton>
          <HintButton @click='showEditSku' size="mini" type='warning' icon="el-icon-edit"></HintButton>
          <HintButton @click="showDrawer(row)" size="mini" type='info' icon="el-icon-info"></HintButton>
          <el-popconfirm :title="`确定删除 ${row.skuName} 吗`" @onConfirm='deleteSku(row)'>
            <HintButton slot="reference" size="mini" type='danger' icon="el-icon-delete"></HintButton>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="text-align:center" @size-change="handleSizeChange" @current-change="getSkuInfoList" :current-page="page" :page-sizes="[7, 9, 13, 15]" :page-size="limit" :total="total" layout=" prev, pager, next, jumper ,->, sizes,total">
    </el-pagination>

    <el-drawer size="50%" :visible.sync="isShowDrawer" :direction="direction" :before-close="handleClose">
      <span>我来啦!</span>
    </el-drawer>

  </el-card>
</template>

<script>
export default {
  name: 'Sku',

  data() {
    return {
      page: 1,
      limit: 7,
      total: 0,

      skuInfoList: [],

      //控制抽屉
      isShowDrawer: false,
      direction: 'rtl', //从又向左弹出
    }
  },

  mounted() {
    this.getSkuInfoList()
  },

  methods: {
    // 获取列表
    async getSkuInfoList(page = 1) {
      this.page = page;
      const result = await this.$API.sku.getList(this.page, this.limit);
      if (result.code === 20000 || result.code === 200) {
        // this.$message.success("获取sku列表成功");
        this.skuInfoList = result.data.records;
        this.total = result.data.total
      }
    },
    // 改变每页显示的数量
    handleSizeChange(val) {
      this.limit = val;
      this.getSkuInfoList();
    },
    // 编辑按钮
    showEditSku() {
      this.$message.info("该功能还在开发中");
    },
    // 上架
    async onSale(row) {
      const res = await this.$API.sku.onSale(row.id);
      if (res.code === 200 || res.code === 20000) {
        this.$message.success('上架成功');
        this.getSkuInfoList(this.page);
      }
      else
        this.$message.error("上架失败")
    },
    // 下架
    async cancelSale(row) {
      const res = await this.$API.sku.cancelSale(row.id);
      if (res.code === 200 || res.code === 20000) {
        this.$message.success('下架成功');
        this.getSkuInfoList(this.page)
      } else
        this.$message.error("下架失败")
    },
    async deleteSku(row) {
      const res = await this.$API.sku.remove(row.id);
      if (res.code === 200 || res.code === 20000) {
        this.$message.success(`删除 ${row.skuName} 成功`);
        this.getSkuInfoList(this.skuInfoList.length > 1 ? this.page : this.page - 1);
      } else {
        this.$message.error(`删除 ${row.skuName} 失败`);
      }
    },
    async showDrawer(row) {
      this.isShowDrawer = true;

    },
    // 关闭之前
    handleClose(done) {
      done();
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
