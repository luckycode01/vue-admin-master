<template>
  <ve-histogram :data="chartData" :settings="chartSettings" ref="chart"></ve-histogram>
</template>

<script>
  import resize from './mixins/resize'
  export default {
    mixins: [resize],

    data () {
      this.chartSettings = {
        axisSite: { right: ['下单率'] },  //有两个y轴
        yAxisType: ['KMB', 'percent'], //有两个轴,左侧是KMB 右侧代表比率
        yAxisName: ['数值', '比率'],
        xAxisName: '日期'
      }
      return {
        chartData: {
          columns: ['日期', '访问用户', '下单用户', '下单率'],
          rows: [
            { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
            { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
            { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
            { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
            { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
            { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
          ]
        }
      }
    }
  }
</script>