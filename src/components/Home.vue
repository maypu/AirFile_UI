<template>
  <div>
    <Menu mode="horizontal" theme="primary" active-name="1">
      <MenuItem name="1" to='/'>
        <Icon type="ios-paper" />
        {{ productName }}
      </MenuItem>
      <div style="float: right">
        <Dropdown class="dropdown" placement="bottom-end">
          <Button type="primary">
            <Icon type="md-more" size="20" />
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem
              @click.native="isShowHistory = true"
              on-select="isShowHistory = true"
            >
              <Icon type="md-time" />上传历史</DropdownItem
            >
            <DropdownItem
              @click.native="isShowAbout = true"
              on-select="isShowAbout = true"
            >
              <Icon type="md-information-circle" />开源项目鸣谢</DropdownItem
            >
          </DropdownMenu>
        </Dropdown>
      </div>
    </Menu>
    <div class="contain" :class="{containDark: nightTime}" :style="{ height: containHeight }">
      <div class="logo-area" :style="{ marginTop: topHeight }">
        <img src="/static/images/logo.png" alt="logo.png" />
        <p class="title">{{ productName }}</p>
        <p class="desc">文件快速分享</p>
      </div>
      <div class="file-area">
        <div v-if="!showDownload && !showCopy" style="margin-top: 20px">
          <div v-if="file == null && uploadText == null">
            <div
              @mouseover="showMoreUpload = true"
              @mouseleave="showMoreUpload = false"
              style="display: inline-flex"
            >
              <Upload :before-upload="handleUpload" paste action="">
                <Button
                  icon="md-cloud-upload"
                  type="primary"
                  style="width: 100px"
                  >发送</Button
                >
              </Upload>
              <div class="more-upload" v-if="showMoreUpload">
                <div class="use-tip" :class="{useTipDark: nightTime}">
                  <p>- 支持拖拽文件到本页面任意位置进行上传</p>
                  <p>- 支持Ctrl+V粘贴文件进行上传</p>
                </div>
                <!-- <Button
                  type="primary"
                  ghost
                  @click="
                    uploadText = '';
                    showMoreUpload = false;
                  "
                  >文本</Button
                > -->
                <!-- <Upload :before-upload="handleUpload" webkitdirectory action="" style="display: inline-flex">
                <Button type="primary">文件夹</Button>
              </Upload> -->
              </div>
            </div>
            <div>
              <Button
                icon="md-cloud-download"
                type="primary"
                style="width: 100px; margin-top: 20px"
                @click="showDownloadHandle()"
                >接收</Button
              >
            </div>
          </div>
          <div v-else>
            <div class="progress-num text-primary">
              <span
                v-if="progressNum != 0"
                :class="{
                  'text-success': progressNum > 98,
                }"
                >{{
                  progressNum == 100 ? progressNum - 1 : progressNum
                }}
                %</span
              >
            </div>
            <!-- <Divider /> -->
            <Progress
              :percent="progressNum"
              :stroke-width="2"
              :hide-info="true"
              class="process"
              status="active"
            />
            <div v-if="file != null">
              <Row>
                <Col span="22">
                  待上传文件：{{ file.name }}
                  <span
                    :class="{
                      'text-success': !isOverMaxSize(),
                      'text-error': isOverMaxSize(),
                    }"
                    >&nbsp;
                    {{
                      (file.size / 1024000).toFixed(2) != 0
                        ? (file.size / 1024000).toFixed(2)
                        : 0.01
                    }}Mb</span
                  ></Col
                >
                <Col span="2">
                  <Icon
                    type="md-close"
                    class="delete-file"
                    @click="reduction"
                  />
                </Col>
              </Row>
            </div>
            <div v-if="uploadText != null">
              <Row>
                <Col span="22"> 待上传文本：</Col>
                <Col span="2">
                  <Icon
                    type="md-close"
                    class="delete-file"
                    @click="uploadText = null"
                  />
                </Col>
              </Row>
              <Input
                v-model="uploadText"
                type="textarea"
                :rows="5"
                placeholder="请输入待上传文本"
              />
            </div>
            <Form class="form" :label-width="100">
              <Row>
                <Col span="5" class="row">
                  <label for="">密码</label>
                </Col>
                <Col span="19" class="row-input">
                    <Input v-model="password" placeholder="可留空"></Input>
                </Col>
              </Row>
              <Row>
                <Col span="5" class="row">
                  <label for="">可下载次数</label>
                </Col>
                <Col span="7" class="row-input">
                    <InputNumber
                      :min="1"
                      :max="frequencyMax"
                      v-model="frequency"
                      @on-change="frequencyChange"
                      style="width: 100%"
                    ></InputNumber>
                </Col>
                <Col span="5" class="row">
                  <label for="">保留小时数</label>
                </Col>
                <Col span="7" class="row-input">
                    <Poptip
                      trigger="hover"
                      :content="limitTipContent"
                      :disabled="disableLimitTip"
                    >
                      <InputNumber
                        :min="1"
                        :max="limithoursMax"
                        v-model="limithours"
                        @on-change="limithoursChange"
                        style="width: 100%"
                      ></InputNumber>
                    </Poptip>
                  </Col>
              </Row>
            </Form>
            <Button type="primary" @click="upload" :loading="loadingStatus" style="margin-top:10px;">{{
              loadingStatus ? "正在上传" : "确认发送"
            }}</Button>
          </div>
        </div>
        <div v-if="showCopy || showDownload">
          <Row>
            <Col span="14"><div>文件码：</div></Col>
            <Col span="10">
              <Poptip
                style="text-align: left"
                v-if="showCopy && !isCopyed"
                confirm
                title="还未复制，确认关闭？"
                @on-ok="reduction"
              >
                <Icon type="md-close" class="delete-file" />
              </Poptip>
              <Icon
                v-else
                type="md-close"
                class="delete-file"
                @click="reduction"
              />
            </Col>
          </Row>
          <Input v-model="verifiCode" ref="verifiCode" class="verifiCode" />
          <br />
          <div v-if="showCopy">
            <Button icon="ios-copy" type="primary" @click="copyLink(verifiCode)"
              >复制下载地址</Button
            >
            <Button icon="ios-copy" type="primary" @click="copyText(verifiCode)"
              >复制文件码</Button
            >
            <div style="text-align: center">
              <Alert show-icon style="width: 300px; margin: 20px auto"
                >文件码可以用于文件下载，下载前请勿丢失！</Alert
              >
            </div>
          </div>
          <div v-if="showDownload">
            <Button
              type="primary"
              class="confirm-down-btn"
              @click="confirmDownload"
              icon="md-cloud-download"
              >确认下载</Button
            >
            <br />
            <Button
              class="cancel-reception-btn"
              icon="md-close"
              @click="reduction"
              >取消接收</Button
            >
          </div>
        </div>
      </div>
      <div class="footer">
        Powered By <a href="http://blog.teahot.top/" target="_blank">maypu</a> - 
        <a href="https://github.com/maypu/AirFile" target="_blank"><Icon type="logo-github"/>Github</a>
      </div>
    </div>
    <Modal
      title="请输入下载密码"
      v-model="showPwdModel"
      class-name="vertical-center-modal"
      @on-ok="verifyPwd"
    >
      <Input type="password" password v-model="password" />
    </Modal>
    <Modal v-model="isShowHistory" title="上传历史" footer-hide>
      <div class="show-about">
        <table>
          <thead></thead>
          <tbody>
            开发中……
          </tbody>
        </table>
      </div>
    </Modal>
    <Modal v-model="isShowAbout" title="开源项目鸣谢" footer-hide>
      <div class="show-about">
        <p>前端</p>
        <ul>
          <li><a href="https://vuejs.org/" target="_blank">Vue.js</a></li>
          <li>
            <a href="https://www.iviewui.com/" target="_blank">View UI</a>
          </li>
          <li>
            <a href="https://www.iconfont.cn/" target="_blank">Iconfont</a>
          </li>
        </ul>
        <p>后端</p>
        <ul>
          <li><a href="https://golang.org/" target="_blank">Golang</a></li>
          <li>
            <a href="https://github.com/gin-gonic/gin" target="_blank">Gin</a>
          </li>
          <li><a href="https://gorm.io/" target="_blank">Gorm</a></li>
          <li><a href="https://www.mysql.com/" target="_blank">Mysql</a></li>
        </ul>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "Home",
  data() {
    return {
      productName: "AirFile",
      containHeight:
        (window.innerHeight || document.documentElement.clientHeight) - 61 +
        "px",
      topHeight:
        ((window.innerHeight || document.documentElement.clientHeight) - 580) /
          2 +
        "px",
      uuid: "",
      verifiCode: "",
      password: "",
      frequency: 2, //可下载次数
      frequencyMax: 10, //最大可下载次数
      limithours: 24, //保留小时数
      limithoursMax: 168, //最大保留小时数
      file: null,
      uploadMaxSize: 102400, //最大上传文件大小(单位：kb)
      uploadText: null,
      progressNum: 0,
      loadingStatus: false,
      showMoreUpload: false,
      showCopy: false,
      showDownload: false,
      showPwdModel: false,
      disableLimitTip: true,
      limitTipContent: "",
      fileId: 0,
      isCopyed: false,
      isShowHistory: false,
      isShowAbout: false,
    };
  },
  watch: {
    limithours(newVal, oldVal) {
      this.disableLimitTip = newVal > 24 ? false : true;
      this.limitTipContent =
        (Math.round(newVal / 24) > 0 ? (newVal / 24).toFixed(2) : 0) + "天";
    },
  },
  computed: {
    nightTime() {
      if (this.utils.CompareTime(new Date(),"23:00:00") > 0 || this.utils.CompareTime(new Date(),"07:00:00") < 0) {
        return true;
      }
      return false;
    }
  },
  created() {
    //取文件码参数
    let path = this.$route.path;
    let fileCode = this.$route.params.fileCode;
    if (path.indexOf("/fileCode") == 0 && fileCode) {
      this.verifiCode = fileCode;
      this.showDownload = true;
    }

    if (document) {
      //监听粘贴事件
      document.addEventListener("paste", (e) => {
        e.stopPropagation();
        const items = e.clipboardData.items;
        if (items && items.length > 0) {
          let file = items[0].getAsFile();
          let fileDictionary = items[0].webkitGetAsEntry();
          //  判断剪贴板中是否是文件
          if (
            file &&
            file.size > 0 &&
            fileDictionary &&
            !fileDictionary.isDirectory
          ) {
            this.file = file; //  获取文件
          }
        }
      });
      //监听拖拽事件
      document.addEventListener(
        "drop",
        (e) => {
          //文件已经在拖动区，并松开鼠标时，触发 drop 事件
          e.stopPropagation();
          e.preventDefault();
          this.enterDrop(e);
        },
        false
      );
      document.addEventListener("dragleave", (e) => {
        //文件在拖动区来回拖拽时，不断触发dragleave 事件 //拖后放
        e.stopPropagation();
        e.preventDefault();
      });
      document.addEventListener("dragenter", function (e) {
        //文件第一次进入拖动区时，触发 dragenter 事件
        e.stopPropagation();
        e.preventDefault();
      });
      document.addEventListener("dragover", function (e) {
        //文件在拖动区来回拖拽时，不断触发 dragover 事件
        e.stopPropagation();
        e.preventDefault();
      });
    }
  },
  mounted() {
    //获取服务器配置
    this.loadConfig();
    //获取uuid
    let uuid = localStorage.getItem("uuid");
    this.axios.post("auth", { uuid: uuid }).then((res) => {
      if (res.Code == 200) {
        localStorage.setItem("uuid", res.Result);
        this.uuid = res.Result;
      }
    });
    //获取cookie中的数据
    let frequency = localStorage.getItem("frequency");
    let limithours = localStorage.getItem("limithours");
    if (frequency) {
      this.frequency = frequency;
    }
    if (limithours) {
      this.limithours = limithours;
    }
  },
  methods: {
    loadConfig() {
      //应用名称
      let key = new FormData();
      key.append("key", "common.name");
      this.axios.post("config", key).then((res) => {
        if (res && res.Code == 200) {
          this.productName = res.Result;
        } else {
          console.log(res);
        }
      });
      //最大上传文件大小
      let key2 = new FormData();
      key2.set("key", "upload.size");
      this.axios.post("config", key2).then((res) => {
        if (res && res.Code == 200) {
          let uploadMaxSize = parseFloat(res.Result);
          if (!isNaN(uploadMaxSize) && uploadMaxSize > 0) {
            this.uploadMaxSize = uploadMaxSize * 1024;
          }
        } else {
          console.log(res);
        }
      });
    },
    copyText(value) {
      if (!value) return false;
      this.isCopyed = true;
      this.$copyText(value).then((_) => {
        this.$Notice.success({
          title: "复制成功！",
          desc: value,
        });
      });
    },
    copyLink(value) {
      if (!value) return false;
      this.isCopyed = true;
      let fileUrl = window.location.href + "fileCode/" + value;
      this.$copyText(fileUrl).then((_) => {
        this.$Notice.success({
          title: "复制成功！",
          desc: fileUrl,
        });
      });
    },
    handleUpload(file) {
      this.file = file;
      return false;
    },
    upload() {
      if (this.isOverMaxSize()) {
        this.$Message.error(
          "文件最大上传大小为" + Math.round(this.uploadMaxSize / 1024) + "M！"
        );
        return false;
      }
      this.loadingStatus = true;
      const param = new FormData();
      param.append("file", this.file);
      param.append("uuid", this.uuid);
      param.append("password", this.password);
      param.append("frequency", this.frequency);
      param.append("limithours", this.limithours);
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          //上传进度百分比
          this.progressNum =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0;
        },
      };
      this.axios.post("upload", param, config).then((res) => {
        if (res) {
          if (res.Code == 200) {
            this.$Message.success("上传成功");
            this.reduction();
            this.showCopyHandle(res.Result);
            //设置复制
            this.isCopyed = false;
            //把下载次数和有效期存localStorage
            // localStorage.setItem("frequency", this.frequency);
            // localStorage.setItem("limithours", this.limithours);
          }
        } else {
          setTimeout(() => {
            this.loadingStatus = false;
          }, 1500);
        }
      });
    },
    reduction() {
      //判断当前路由
      let path = this.$route.path;
      let fileCode = this.$route.params.fileCode;
      if (path.indexOf("/fileCode") == 0 && fileCode) {
        this.$router.push("/");
      }

      this.file = null;
      this.showCopy = false;
      this.showDownload = false;
      this.loadingStatus = false;
      this.progressNum = 0;
    },
    showCopyHandle(verifiCode = "") {
      this.showCopy = true;
      this.showDownload = false;
      this.verifiCode = verifiCode;
      setTimeout(() => {
        this.$refs.verifiCode.focus({
          cursor: "end",
        });
      }, 0);
    },
    showDownloadHandle(verifiCode = "") {
      this.showCopy = false;
      this.showDownload = true;
      this.verifiCode = verifiCode;
      setTimeout(() => {
        this.$refs.verifiCode.focus({
          cursor: "end",
        });
      }, 0);
    },
    confirmDownload() {
      if (this.verifiCode == "") {
        this.$Message.error({
          content: "文件码不能为空！",
          duration: 4,
        });
        return false;
      }
      this.axios.post("download", { code: this.verifiCode }).then((res) => {
        if (res) {
          if (res.Code == 200) {
            if (res.Result) {
              let result = JSON.parse(res.Result);
              this.fileId = result.file;
              if (result.password) {
                //打开密码弹窗
                this.password = null;
                this.showPwdModel = true;
              } else {
                //直接下载
                this.download();
              }
              return false;
            }
          }
          this.$Message.error({
            content: res.Message,
            duration: 4,
          });
        }
      });
    },
    verifyPwd() {
      this.axios
        .post("verifyPwd", { fileId: this.fileId, password: this.password })
        .then((res) => {
          if (res) {
            if (res.Code == 200) {
              if (res.Result == "true") {
                //直接下载
                this.download();
              }
            }
          }
        });
    },
    download() {
      let iframe = document.createElement("iframe");
      iframe.id = "downloadFrame";
      iframe.style.display = "none";
      iframe.src =
        this.API_ROOT + "file/" + this.fileId + "?random=" + Math.random();
      document.body.appendChild(iframe);
      setTimeout((_) => {
        iframe.remove();
      }, 1000);
    },
    frequencyChange(value) {
      if (value == null) {
        setTimeout((_) => {
          this.frequency = 1;
        }, 100);
      }
    },
    limithoursChange(value) {
      if (value == null) {
        setTimeout((_) => {
          this.limithours = 1;
        }, 100);
      }
    },
    enterDrop(e) {
      e.stopPropagation();
      e.preventDefault(); //必填字段
      let fileData = e.dataTransfer.items;
      if (fileData && fileData.length > 0) {
        let file = fileData[0].getAsFile();
        let fileDictionary = fileData[0].webkitGetAsEntry();
        //判断拖拽的是不是文件
        if (
          file &&
          file.size > 0 &&
          fileDictionary &&
          !fileDictionary.isDirectory
        ) {
          this.file = file;
        }
      }
    },
    isOverMaxSize() {
      return (
        this.file &&
        this.file.size &&
        this.file.size / 1024 > this.uploadMaxSize
      );
    },
  },
};
</script>
<style scoped>
/* 深色模式scss */
/* @import url(../theme/dark.scss); */

.contain {
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
  /* max-width: 1200px; */
  overflow: -Scroll;
  overflow-x: hidden;
  overflow-y: hidden;
}

.containDark {
  background-color: #22303f;
  color: #ffffff;
}

.logo-area {
  text-align: center;
  /* margin-top: 20%; */
}
.logo-area .title {
  font-size: 3em;
}
.file-area {
  text-align: center;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}
.row {
  align-self: center;
  text-align: right;
  padding-right: 5px;
}
.row-input {
  margin: 8px auto;
}
.more-upload {
  position: absolute;
  margin-left: 100px;
  padding-left: 5px;
}
.use-tip {
  text-align: left;
  background-color: #f1f2f6;
  padding: 10px;
}
.useTipDark {
  background-color: #151d29;
}
.delete-file {
  cursor: pointer;
}
.progress-num {
  width: 100%;
  height: 20px;
  text-align: right;
}
.process {
  margin-bottom: 20px;
}
.form {
  margin-top: 10px;
}
.cancel-reception-btn {
  margin-top: 20px;
}
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}
.verifiCode {
  margin: 10px auto;
  width: 300px;
}
.verifiCode :nth-last-child(1) {
  color: #19be6b;
  font-size: 3em;
  height: auto;
  letter-spacing: 2px;
  text-align: center;
}
.show-about {
  margin: auto 15px;
}
.show-about ul {
  margin-left: 40px;
}
.text-primary {
  color: #2d8cf0;
}
.text-success {
  color: #02b340;
}
.text-error {
  color: #f5222d;
}
.dropdown /deep/ .ivu-select-dropdown {
  margin-right: 20px;
}
.footer {
  text-align: center;
  position: absolute;
  bottom: 5px;
  width: 98%;
}
</style>