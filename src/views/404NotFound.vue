<template>
  <div>
    <v-row class="row-login">
      <div class="color"></div>
      <div class="color"></div>
      <div class="color"></div>
      <div class="box">
        <div class="square" style="--i: 0"></div>
        <div class="square" style="--i: 1"></div>
        <div class="square" style="--i: 2"></div>
        <div class="square" style="--i: 3"></div>
        <div class="square" style="--i: 4"></div>
        <v-card
          class="login-card mx-auto py-8 pt-4 mb-8"
          width="500"
          height="300"
        >
          <v-img
            alt="Emerson"
            class="image-center mb-6"
            contain
            :src="`${publicPath}aw-snap.png`"
            transition="scale-transition"
            width="120"
          />
          <v-divider width="220" class="mx-auto inset"></v-divider>

          <v-card-subtitle>
            <h2
              class="text-center primary--text font-weight-bold display-1 mb-4"
            >
              404 - Looks like you're lost?
            </h2>
            <v-col class="col text-center mt-0 pt-0">
              <v-btn flat class="px-8 py-6" color="primary" outlined
                ><router-link to="/register">Find your boss</router-link>
              </v-btn>
            </v-col>
          </v-card-subtitle>
        </v-card>
      </div>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import AuthService from "../services/AuthService";
import GraphService from "../services/GraphService";

export default {
  name: "NotFound",
  data: () => ({
    publicPath: process.env.BASE_URL,
    title: process.env.VUE_APP_TITLE,
    avatarText: "",

    user: null,
    userInfo: null,
    apiCallFailed: false,
    loginFailed: false,

    loading: false,
    loginpromise: [],
  }),
  created() {
    this.authService = new AuthService();
    this.graphService = new GraphService();
  },
  methods: {
    login() {
      this.loading = true;
      this.loginFailed = false;
      this.authService.login().then(
        (user) => {
          if (user) {
            this.user = user;
          } else {
            this.loginFailed = true;
          }
        },
        () => {
          this.loginFailed = true;
        }
      );
    },
  },
};
</script>

<style>
.v-navigation-drawer {
  display: none;
}
.v-main {
  padding: 0 !important;
}
.v-main {
  padding: 0 !important;
}
header.v-sheet {
  display: none;
}
html {
  overflow-y: auto;
}
a {
  text-decoration: none;
}
.container {
  padding: 0px;
}
.row-login {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0;
  background: linear-gradient(to bottom, #f1f4f9, #dff1ff);
}
.row-login .color {
  position: absolute;
  filter: blur(150px);
}
.row-login .color:nth-child(1) {
  top: -350px;
  width: 100%;
  height: 600px;
  background: #0079c1;
}
.row-login .color:nth-child(2) {
  bottom: 0px;
  left: 50px;
  width: 40%;
  height: 550px;
  background: #00afe9;
}
.row-login .color:nth-child(3) {
  bottom: 0px;
  right: 50px;
  width: 40%;
  height: 380px;
  background: #f79428;
}
.row-login .image-center {
  margin: 0 auto;
}
.box {
  position: relative;
}
.box .square {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(5px);
  box-shadow: 0 25px 45px rgba(255, 255, 255, 0.1);
  border: 1px solid;
  border-radius: 10px;
  border-color: rgba(255, 255, 255, 0.3) !important;
  border-right: 1px solid;
  border-right-color: rgba(255, 255, 255, 0.1) !important;
  border-bottom: 1px solid;
  border-bottom-color: rgba(255, 255, 255, 0.1) !important;
  animation: animate 6s linear infinite;
  animation-delay: calc(-1s * var(--i));
}

@keyframes animate {
  0%,
  100% {
    transform: translateY(-20px);
  }
  50% {
    transform: translateY(20px);
  }
}
.box .square:nth-child(1) {
  top: -60px;
  left: 460px;
  width: 120px;
  height: 140px;
}
.box .square:nth-child(2) {
  top: 140px;
  right: 520px;
  width: 120px;
  height: 140px;
  z-index: 2;
}
.box .square:nth-child(3) {
  bottom: 50px;
  left: 480px;
  width: 120px;
  height: 120px;
  z-index: 2;
}
.box .square:nth-child(4) {
  bottom: -10px;
  left: 130px;
  width: 60px;
  height: 60px;
}
.box .square:nth-child(5) {
  top: -80px;
  left: 50px;
  width: 60px;
  height: 60px;
}

@media only screen and (max-width: 1366px) {
  .box .square:nth-child(1) {
    top: -40px;
    left: 420px;
    width: 100px;
    height: 100px;
  }
  .box .square:nth-child(2) {
    top: 140px;
    right: 520px;
    width: 100px;
    height: 120px;
    z-index: 2;
  }
  .box .square:nth-child(3) {
    bottom: 80px;
    left: 480px;
    width: 120px;
    height: 120px;
    z-index: 2;
  }
  .box .square:nth-child(4) {
    bottom: -5px;
    left: 140px;
    width: 50px;
    height: 50px;
  }
  .box .square:nth-child(5) {
    top: -45px;
    left: 50px;
    width: 60px;
    height: 60px;
  }
}

.login-card {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-radius: 10px;
  backdrop-filter: blur(5px);
  box-shadow: 0 25px 45px rgba(255, 255, 255, 0.1);
  border: 1px solid;
  border-color: rgba(255, 255, 255, 0.3) !important;
  border-right: 1px solid;
  border-right-color: rgba(255, 255, 255, 0.1) !important;
  border-bottom: 1px solid;
  border-bottom-color: rgba(255, 255, 255, 0.1) !important;
}
.text-popout {
  z-index: 2;
}
.display-1 {
  font-size: 1.8rem !important;
}
</style>