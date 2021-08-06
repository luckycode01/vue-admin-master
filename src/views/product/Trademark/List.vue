
<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <el-table style="margin: 20px 0; width: 100%" border :data="trademarkList">
      <el-table-column label="序号" type="index" width="80"></el-table-column>
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="{row}">
          <img :src="row.logoUrl" alt="" width="80" height="60">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="warning" icon="el-icon-edit" size="mini">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination align="center" @size-change="handleSizeChange" @current-change="getTrademarkList" :current-page="page" :page-sizes="[3, 5, 7, 9]" :page-size="limit" layout="prev, pager, next, jumper,->,sizes,total" :total="total">
    </el-pagination>
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
      total: 0
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
