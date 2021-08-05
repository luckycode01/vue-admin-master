<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>

    <el-table :data='trademarkList' style="width: 100%;" align="center" border>
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column label="品牌logo">
        <template slot-scope="{row}">
          <img :src="row.logoUrl" alt="" width="80" height="60">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="warning" icon='el-icon-edit' size="mini">修改</el-button>
          <el-button type="danger" icon='el-icon-delete' size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- @size-change="handleSizeChange" @current-change="handleCurrentChange" -->
    <el-pagination background :pager-count='7' @size-change="handleSizeChange" @current-change="getTrademarkList" :current-page="page" :page-sizes="[3, 5, 7, 9]" :page-size="100" layout=" prev, pager, next, jumper,->, sizes ,total" :total="total">
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
      total: 0,
      trademarkList: [],

    }
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    async getTrademarkList(page = 1) {
      this.page = page;
      const result = await this.$API.trademark.getPageList(this.page, this.limit);
      if (result.code == 2000 || result.code == 200) {
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
.el-button {
  margin-top: 10px;
}
.el-table {
  margin: 20px 0;
}
.el-pagination {
  text-align: center;
}
</style>
