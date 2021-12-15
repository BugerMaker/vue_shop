<template>
    <el-container class="home-container">
      <el-header>
        <div>
          <img src="../assets/heima.png" alt="">
          <span>电商管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button></el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            :default-active="activePath"
            class="el-menu-vertical-demo"
            background-color="#333744"
            text-color="#fff"
            :unique-opened="true"
            :router="true"
            active-text-color="#409EFF">
            <!-- 一级菜单 -->
            <el-submenu :index="item.id.toString()" v-for="item in menulist" :key="item.id">
              <template slot="title">
                <i :class=" iconfont[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index=" '/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavbar('/' + subItem.path)">
                <i class="el-icon-menu"></i>{{ subItem.authName }}</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconfont: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    saveNavbar(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d4e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  left: 0;
  > div {
    display: flex;
    align-items: center;
    span {
      color: #fff;
      font-size: 20px;
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}
</style>
