<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- gutter属性表示col之间的间隔 -->
      <!-- 这里显示一个输入框和一个搜索按钮 -->
      <el-row :gutter="20">
        <!-- span属性表示col的宽度 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="searchGoodString"
            clearable
            @clear="handleSearchClear"
            @change="handleSearch"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleSearch"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 需要实现的方法4，点击添加商品即可新增对应的商品信息 -->
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="95px"
        ></el-table-column>
        <el-table-column label="创建时间" width="140px">
          <template slot-scope="scope">
            <!-- 这里的后台时间戳返回的是秒，而js中处理的是毫秒，所以这里需要乘1000 -->
            {{ (scope.row.add_time * 1000) | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 需要实现的方法2，点击编辑按钮编辑商品信息 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="queryGoodInfoById(scope.row.goods_id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeGoodById(scope.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑商品信息的对话框 -->
    <el-dialog
      title="编辑商品信息"
      :visible.sync="editGoodDialogVisible"
      width="50%"
    >
      <el-form
        :model="editGoodForm"
        :rules="editGoodFormRules"
        ref="editGoodFormRef"
        label-width="100px"
        @
      >
        <el-form-item label="商品名称：" prop="goods_name">
          <el-input v-model="editGoodForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格：" prop="goods_price">
          <el-input v-model="editGoodForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="库存：" prop="goods_number">
          <el-input v-model="editGoodForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量：" prop="goods_weight">
          <el-input v-model="editGoodForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGood">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 保存获取到的商品列表
      goodsList: [],
      // 商品总数
      total: 0,
      searchGoodString: '',
      editGoodDialogVisible: false,
      editGoodForm: {},
      // 编辑商品信息表单验证
      editGoodFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  // 下面代码用于在浏览器控制台使用v.searchGoodString打印调试信息
  // mounted() {
  //   window.v = this
  // },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！')
      }
      this.$message.success('获取商品列表成功！')
      console.log(res.data)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async removeGoodById(id) {
      const { data: res } = await this.$http.delete('goods/' + id)
      // console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('删除商品失败！')
      }
      this.$message.success('删除商品成功！')
      this.getGoodsList()
    },
    handleSearch() {
      const str = this.searchGoodString.trim()
      if (!str) {
        this.searchGoodString = ''
        this.queryInfo.query = ''
        this.getGoodsList()
        return
      }
      this.queryInfo.query = str
      this.getGoodsList()
      // this.$message.success('搜索商品成功！')
    },
    handleSearchClear() {
      this.queryInfo.query = ''
      this.getGoodsList()
    },
    goAddPage() {
      this.$router.push('/goods/add')
    },
    // 根据商品ID获取商品信息
    async queryGoodInfoById(id) {
      const { data: res } = await this.$http.get('goods/' + id)
      // console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('根据ID获取商品信息失败！')
        return
      }
      this.$message.success('根据ID获取商品信息成功！')
      this.editGoodForm = res.data
      this.editGoodDialogVisible = true
    },
    // 编辑商品信息
    async editGood() {
      const { data: res } = await this.$http.put(
        'goods/' + this.editGoodForm.goods_id,
        {
          goods_name: this.editGoodForm.goods_name,
          goods_price: this.editGoodForm.goods_price,
          goods_number: this.editGoodForm.goods_number,
          goods_weight: this.editGoodForm.goods_weight
        }
      )
      console.log(res)
      // 这里后端接口有bug，不写了
      this.$message.error('后端接口出问题了，无法编辑商品信息！')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
