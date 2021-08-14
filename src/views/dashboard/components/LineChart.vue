<template>
  <!-- 第一步：弄一个容器设定宽高 -->
  <div :style="{ width, height }"></div>
</template>

<script>
import resize from '@/views/dashboard/components/mixins/resize'
import Echarts from "echarts"; //引入echarts
require("echarts/theme/macarons"); //引入主题
export default {
  mixins:[resize],
  name: "",
  data() {
    return {
      chart: null,
    };
  },

  props: {
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "350px",
    },
    chartData: {
      type: Object,
      default: {},
    },
    yTittle: {
      type: String,
      default: "",
    },
  },
  // 因为一上来这个图就已经出现，所以我们在mouted里面去画图
  // 异步数据，我们要2次设置option，一会设置option最好封装函数
  mounted() {
    // 第一步：初始化echarts实例
    // this.$el代表组件的根元素
    this.chart = Echarts.init(this.$el, "macarons");
    // 第二步:设置option
    this.setOption(this.chartData);
  },
  methods: {
    setOption({ expectedData = [], actualData = [] }) {
      this.chart.setOption({
        //  图表的标题
        // title: {
        //   text: "ECharts 嘿嘿",
        // },

        // 直角坐标系内绘图网格,控制图占据容器的大小
        grid: {
          left: 40,
          right: 30,
          top: 30,
          bottom: 30,
          grid: true, //区域是否包含坐标轴的刻度标签
        },

        //  提示
        tooltip: {
          trigger:'axis', //开启线状图提示
          axisPointer:{
            type:"cross" //鼠标设置位十字准星
          }
        },
        // 图例 ，必须是和数据系列进行配套使用
        legend: {
          data: ["期望", "实际"],
        },
        //  x轴 可以是自己指定
        xAxis: {
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          boundaryGap: false, //坐标轴两边留白策略，
        },
        //  y轴，一般不写数据，y轴数据是根据系列数据自动生成
        yAxis: {
          name: this.yTittle,
        },
        //  数据系列必须和图例配合
        series: [
          {
            name: "期望",
            type: "line", //bar代表柱状图  line代表线状  pie代表饼状图
            data: expectedData,
            lineStyle: {
              width: 6,
              // color:'red' 颜色一般不用这个改,因为不能和上面图例颜色同步
            },
            itemStyle: {color:'red'},
            
            areaStyle:{
              color:"hotpink"  //设置阴影区域的颜色
            }
          },
          {
            name: "实际",
            type: "line",
            data: actualData,
            lineStyle: {
              width: 6,
              // color:'blue'
            },
            itemStyle: {color:'blue'},
          },
        ],
      });
    },
  },
  // watch异步数据过来没有,如果数据过来了要二次进行设置option
  watch: {
    chartData() {
      this.setOption(this.chartData);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
