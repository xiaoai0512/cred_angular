<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="loginForm"
      :form="loginForm"
    >
      <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" message="账户或密码错误（admin/ant.design )" />
      <a-form-item>
        <!-- <a-input
          size="large"
          type="text"
          placeholder="请输入用户名"
          v-decorator="[
            'loginId',
            {rules: [{ required: true, message: '请输入用户名' }]}
          ]"
        > -->
        <!-- </a-input> -->
        <a-select
          size="large"
          v-decorator="[
            'tenantCode',
            { rules: [{ required: true, message: '请选择租户' }],initialValue:'91310117MA1J196M4B' },
          ]"
          placeholder="请选择"
        >
          <a-select-option value="91310117MA1J196M4B">
            IDER  CreditX
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="请输入用户名"
          v-decorator="[
            'userCode',
            {rules: [{ required: true, message: '请输入用户名' }]}
          ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input-password
          size="large"
          autocomplete="false"
          placeholder="请输入密码"
          v-decorator="[
            'password',
            {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
          ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input-password>
      </a-form-item>
      <!-- <a-form-item>
        <a-row :gutter="10">
          <a-col :span="16">
            <a-input
              size="large"
              type="text"
              placeholder="请输入验证码"
              v-decorator="[
                'code',
                {rules: [{ required: true, message: '请输入验证码' }]}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-col>
          <a-col :span="8">
            <div class="code-img" @click="getCodeImg">
              <img :src="codeImg + '?' + mathNum " alt="">
            </div>
          </a-col>
        </a-row>
      </a-form-item> -->
      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          class="login-button"
          @click="handleLogin"
        >确定</a-button>
      </a-form-item>
      <!-- <a-form-item style="text-align:center">
        <router-link
          :to="{ name: 'recover', params: { user: 'aaa'} }"
          class="forge-password"
        >忘记密码</router-link>
      </a-form-item> -->
    </a-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  components: {
  },
  data () {
    return {
      codeImg: 'http://10.6.110.18:8088/code',
      mathNum: Math.random(),
      loginForm: this.$form.createForm(this, { name: 'loginForm' }),
      isLoginError: false,
      state: {
        loginBtn: false
      }
    }
  },
  created () {
    this.getCodeImg()
  },
  methods: {
    getCodeImg () {
      this.mathNum = Math.random()
    },
    ...mapActions(['Login', 'GetCurrentUser']),
    handleLogin (e) {
      this.state.loginBtn = true
      this.loginForm.validateFields((errors, formValue) => {
        const val = formValue
        val.password = this.$md5(val.password)
        val.isEncryption = '1'
        if (!errors) {
          this.Login(val).then(() => this.loginSuccess())
            .finally(() => { this.state.loginBtn = false })
        }
      })
    },
    loginSuccess (res) {
      // 登录成功后查询当前用户
      // this.GetCurrentUser().then(() => {
      this.$router.push({ path: '/' })
      this.state.loginBtn = false
      // })
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
  .code-img{
      width: 100%;
      height: 100%;
      img{
        width: 100%;
        height: 100%;
        padding: 0 20% 0 0;
      }
    }
}
</style>
