<template>
    <div class="login-container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 表单区域 -->
            <div>
                <el-form ref="LoginRef" :model="LoginForm" :rules="LoginRules" label-width="0px" class="login_form">
                    <!-- 账号组件 -->
                    <el-form-item prop="username">
                        <el-input v-model="LoginForm.username" prefix-icon="el-icon-user-solid"></el-input>
                    </el-form-item>
                    <!-- 密码组件 -->
                    <el-form-item prop="password">
                        <el-input v-model="LoginForm.password" prefix-icon="el-icon-s-goods" type="password"></el-input>
                    </el-form-item>
                    <!-- 按钮区域 -->
                    <el-form-item class="btns">
                          <el-button type="primary" @click="Login">登录</el-button>
                          <el-button type="info" @click="ResetLogin">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      LoginForm: {
        username: 'admin',
        password: '123456'
      },
      LoginRules: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度应在 3 到 10 个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度应在 6 到 15 个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ResetLogin () {
      this.$refs.LoginRef.resetFields()
    },
    Login () {
      this.$refs.LoginRef.validate(valid => {
        if (!valid) return
        const result = this.$http.post('login', this.LoginForm)
        console.log(result)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
 background-color: #2b4b6b;
 height: 100%;
}

.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }

    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }

    .btns {
        display: flex;
        justify-content: flex-end;
    }
}
</style>
