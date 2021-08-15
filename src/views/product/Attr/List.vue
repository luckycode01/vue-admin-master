<template>
  <div>
    <el-card>
      <CategorySelector @changeCategory="changeCategory" :isShowList="isShowList"></CategorySelector>
    </el-card>

    <el-card style="margin-top: 20px">
      <!-- 这个是列表页 -->
      <div v-show="isShowList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="showAddDiv"
          :disabled="!category3Id"
          >添加属性</el-button
        >
        <el-table :data="attrList" border style="width: 100%">
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column
            prop="attrValueList"
            label="属性值列表"
            width="width"
          >
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改"
                @click="showUpdateDiv(row)"
              ></HintButton>

              <el-popconfirm
                :title="`你确定删除${row.attrName}吗？`"
                @onConfirm="deleteAttr(row)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                ></HintButton>
              </el-popconfirm>
              
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 这个代表的是添加和修改的页面 -->
      <div v-show="!isShowList">
        <el-form :inline="true" :model="attrForm">
          <el-form-item label="属性名">
            <el-input
              v-model="attrForm.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrForm.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>
        <el-table
          border
          :data="attrForm.attrValueList"
          style="width: 100%; margin: 20px 0"
        >
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 根据每个属性值的模式数据标识isEdit显示不同的东西 -->
              <el-input
                :ref="$index"
                v-if="row.isEdit"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
                size="mini"
              ></el-input>
              <span
                style="display: block; width: 100%"
                v-else
                @click="toEdit(row, $index)"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 点击确定需要从属性值列表当中把当前的这一项删除 -->
              <el-popconfirm
                :title="`你确定删除${row.valueName}吗？`"
                @onConfirm="attrForm.attrValueList.splice($index,1)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          :disabled="attrForm.attrValueList.length === 0"
          @click="save"
          >保存</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowList: true,

      attrForm: {
        attrName: "",
        attrValueList: [
          // 收集属性值，其实就是要创建如下的对象，添加到attrForm.attrValueList这个数组里面
          // 问题：添加这个属性值对象的时候，属性值名称怎么来（我们得让用户去自己输入得来，不能写死）
          // 如何解决： 占位的思想，本质我们就是想让页面先出现一个输入框，然后输入属性值名称之后再收集到对象
          // 第一步：当用户点击添加平台属性值，我们让表格当中先出现一行，占位的，数据无所谓
          // 其实就是给attrValueList里面添加一条数据，数据里面的值随意，然后表格就会出现一行
          // 在这一行当中，我们给一个input，让用户输入这次添加的属性值名称
          // 第二步：在输入框当中我们只需要把输入框v-model绑定到用户刚刚添加进行的属性值对象的属性值名称身上就可以
          // {
          // attrId: 0,
          // id: 0,
          // valueName: "string",
          // },
        ],
        // categoryId: this.category3Id, 不能这么写，data当中不能使用data当中的数据
        // 因为data是一个无序的对象，谁先有还不一定
        categoryId: "", //收集的是3级的分类id，在这是没法确定的额，后面找机会收集
        categoryLevel: 3, //代表收的id是几级
        // id: 0, 添加的时候id不存在
      },
    };
  },
  methods: {
    changeCategory({ categoryId, level }) {
      // 选中三级分类，子向父传递数据通信，父组件当中干活
      // 子向父通信的时候会传递过来选中的分类id,父组件需要保存这个id
      if (level === 1) {
        // 如果用户选中1级，传递父组件，那么父组件也应该清空它里面的23级以及父组件当中的属性列表
        this.category2Id = "";
        this.category3Id = "";
        this.attrList = [];

        this.category1Id = categoryId;
      } else if (level === 2) {
        // 如果用户选中2级，传递父组件，那么父组件也应该清空它里面的3级以及父组件当中的属性列表
        this.category3Id = "";
        this.attrList = [];
        this.category2Id = categoryId;
      } else {
        // 如果用户选中3级,传递给父组件，那么此时我们只需要发请求获取属性列表数据
        this.category3Id = categoryId;
        // 发请求获取父组件当中的属性列表
        this.getAttrList();
      }
    },
    // 这个函数就是在发请求拿属性列表数据
    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200 || result.code === 20000) {
        this.attrList = result.data;
      }
    },
    showAddDiv() {
      this.isShowList = false;

      // 解决添加属性取消后再次点击添加，数据依然存在的问题
      this.attrForm = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id, //在这是可以拿到data的初始化数据category3Id的
        categoryLevel: 3, //代表收的id是几级
      };
    },

    // 每个属性值都有自己特定的模式
    // 每个新添加的属性值，一上来应该是显示input  编辑模式
    // 每个老的属性值，一上来应该是显示span   查看模式

    addAttrValue() {
      // 添加属性值和添加属性没关系
      // 添加属性的时候可以添加属性值，修改属性的时候，也可以添加属性值
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id,
        //这个代表的是当前这个属性值对象所属的属性的id,添加属性的时候就是undefined
        // 修改属性的时候，这个值就是有的
        // id: 0,  这个是新添加属性值，属性值的id是不可能存在
        valueName: "",
        // 每个新添加的属性值，一上来应该是显示input  编辑模式
        isEdit: true, //属性值内部添加标识数据，这个数据决定这个属性值目前是显示input还是span
        // 上面的写法确实新的属性值里面的isEdit是响应式的
      });

      // 让新添加的属性值input自动获取焦点
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus();
      });
    },

    // 在vue当中，响应式的数据处理，对于数组和对象是不一样的
    // 数组只要用到了重写的7个方法，那么内部所有的东西一定是响应式
    // 对象的响应式数据是靠数据劫持（数据监视）
    // 对于我们初始化的data数据，一上来data里面就有的所有对象的属性（无论是外层还是内层的属性），
    // 都添加get和set方法达到响应式的目的，只要修改这些属性，set方法当中就会修改页面
    // 但是对于我们的对象来说只是一开始data里面的所有属性都添加了响应式，而后期自己给我们的响应式对象添加的属性
    // 通过点语法，添加的属性不是响应式，因为此时数据劫持和数据监视早都已经完成了

    // 点击列表页的修改按钮
    showUpdateDiv(row) {
      this.isShowList = false;
      // this.attrForm = {...row} //浅拷贝
      this.attrForm = cloneDeep(row); //深拷贝

      // 每个老的属性值，一上来应该是显示span   查看模式
      // this.attrForm.attrValueList.forEach(item => item.isEdit = false)这样不是响应式
      this.attrForm.attrValueList.forEach((item) =>
        this.$set(item, "isEdit", false)
      ); //这样添加isedit就是响应式
      // 如果我们写了这样的写法，那么老的属性值里面的isEdit不是响应式的
      // 因为isEdit是后期自己添加的，而且用的是点语法，它不可能是响应式
      // 后期如果你修改了这个isEdit，页面是不会跟着改变的
    },

    // 点击span切换为input  从查看模式切换为编辑模式
    toEdit(row, index) {
      // isEdit之前添加的时候已经是响应式的了，后面修改就不需要再次使用$set
      row.isEdit = true;
      // 自动获取焦点
      // this.$refs[index] 获取对应下标的input
      // row.isEdit = true;赋值会很快， vif是要创建我们的input，我们代码太快了，input还没有创建好
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // input失去焦点或者回车切换为span 从编辑模式切换为查看模式
    toLook(row) {
      // 我们得先判断用户输入的数据合法性
      // 1、如果用户输入的都是空白
      // 2、用户输入的属性值名称和之前的有重复
      // (从属性值列表的当中找找看看有没有人和我一样（除去自身）)
      let attrValueName = row.valueName;
      if (attrValueName.trim() === "") {
        // this.$message.info('属性值名称必须有东西')
        row.valueName = "";
        // attrValueName = ''  清除它没用，因为基本值是值赋值，两个值相等但是没关系
        return;
      }

      let isRepeat = this.attrForm.attrValueList.some((item) => {
        if (item !== row) {
          // 除去自身，看看有人和我输入的一样不，如果有一个是一样的，返回true
          return item.valueName === attrValueName;
        }
      });
      if (isRepeat) {
        this.$message.info("属性值名称不能重复");
        row.valueName = "";
        return;
      }

      row.isEdit = false;
    },
    // 点击保存按钮，请求保存操作（添加或者修改属性的操作）
    async save(){
      // 1、获取请求参数
      let attr = this.attrForm
      // 2、整理参数
      //    当有多个操作操作的是同一个数组，并且都有遍历操作，那么此时就想能不能合并在一起处理
            // 1、属性值名称如果为空串，从属性值列表当中去除
            // 2、属性值当中去除isEdit属性
      attr.attrValueList = attr.attrValueList.filter(item => {
        if(item.valueName !== ''){
          delete item.isEdit
          return true
        }
      })
            // 3、属性值列表如果没有属性值，不发请求
      if(attr.attrValueList.length === 0){
        this.$message.info('属性值必须至少有一个')
        return 
      }
      // 3、发请求
      try {
        // 4、成功干啥
        const result = await this.$API.attr.addOrUpdate(attr)
        if(result.code === 200 || result.code === 20000){
          // 提示
          this.$message.success('保存属性成功')
          // 回到列表页
          this.isShowList = true
          // 重新获取列表页数据
          this.getAttrList()
        }else{
          this.$message.error('保存属性失败')
        }
      } catch (error) {
         // 5、失败干啥
        this.$message.error('请求失败')
      }
    },
    // 点击列表页的删除属性按钮
    async deleteAttr(row){
      try {
        const result = await this.$API.attr.delete(row.id)
        if(result.code === 200 || result.code === 20000){
          this.$message.success('删除属性成功')
          this.getAttrList()
        }else{
          this.$message.error('删除属性失败')
        }
      } catch (error) {
        this.$message.error('请求删除属性失败')
      }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
