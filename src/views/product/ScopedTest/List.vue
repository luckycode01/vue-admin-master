<template>
  <div>
    <h2>我爱你赵丽颖</h2>
    <Child1></Child1>
  </div>
</template>

<script>
import Child1 from '@/views/product/ScopedTest/Child1'
export default {
  name: '',
  components:{
    Child1
  }
}
</script>


<style scoped>
/* scoped填上以后，当前组件及子组件的根元素都是这个样式能作用到的元素
会给这些个能作用到的元素全部添加同一个随机的data-v开头的数据，这些数据
就成为这些元素身上的一个特殊的属性 */
/* scoped当中的样式，会从上面添加了data-v的标识所有的元素当中
找看看谁和我样式的选择器匹配，匹配上就生效 */
  div >>> h2{
    background-color: hotpink;
  } 
</style>


