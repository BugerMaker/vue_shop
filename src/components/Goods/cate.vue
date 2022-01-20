<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showaddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="categoriesData"
        :columns="columns"
        border
        show-index
        index-text="#"
        :selection-type="false"
        :expand-type="false"
        class="teeeTable"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序模板 -->
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作模板 -->
        <template slot="option" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit"
            >编辑{{ (scope.row = 0) }}</el-button
          >
          <el-button type="danger" size="mini" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 30, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogclosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- 级联菜单 -->
          <el-cascader
            v-model="selectedValues"
            expandTrigger="hover"
            :options="parentcategoriesData"
            :props="{
              value: 'cat_id',
              label: 'cat_name',
              children: 'children'
            }"
            @change="handleChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveaddCategories"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoriesData: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 自定义模板
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'option'
        }
      ],
      addCateDialogVisible: false,
      // 添加分类的数据表单对象
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 校验规则
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入要添加的分类名称！',
            trigger: 'blur'
          }
        ]
      },
      // 级联选择器相关配置数据
      parentcategoriesData: [],
      selectedValues: []
    }
  },
  created() {
    this.getCategories()
  },
  methods: {
    async getCategories() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.categoriesData = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getCategories()
    },
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getCategories()
    },
    showaddCateDialog() {
      this.getParentCategories()
      this.addCateDialogVisible = true
    },
    // 获取二级父级分类列表
    async getParentCategories() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      this.parentcategoriesData = res.data
    },
    // 监听级联选择器值的变化
    handleChange() {
      console.log(this.selectedValues)
      // 判断级联选择器是否选中，通过长度来得到分类的级别和父级id
      if (this.selectedValues.length > 0) {
        this.addCateForm.cat_pid = this.selectedValues[this.selectedValues.length - 1]
        this.addCateForm.cat_level = this.selectedValues.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    saveaddCategories() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        this.getCategories()
        this.addCateDialogVisible = false
      })
    },
    // 关闭对话框后的重置
    addCateDialogclosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedValues = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  }
}
</script>

<style lang="less" scoped>
.teeeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
