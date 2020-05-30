/**
 * 自定义 提示框( Toast )组件
 */
let Toast = {};
let showToast = false, // 存储toast显示状态
  showLoad = false, // 存储loading显示状态
  toastVM = null, // 存储toast vm
  loadNode = null; // 存储loading节点元素

Toast.install = function (Vue, options) {
  // 参数
  let opt = {
    defaultType: 'bottom',
    duration: '3000',
    wordWrap: false
  };
  for (let property in options) {
    opt[property] = options[property];
  }

  Vue.prototype.$toast = function (tips, type) {

    let curType = type ? type : opt.defaultType;
    let wordWrap = opt.wordWrap ? 'lx-word-wrap' : '';
    let style = opt.width ? 'style="width: ' + opt.width + '"' : '';
    let tmp = '<div v-show="show" :class="type" class="lx-toast ' + wordWrap + '" ' + style + ' v-html="tip"></div>';

    if (showToast) {
      // 如果toast还在，则不再执行
      return;
    }
    if (!toastVM) {
      let toastTpl = Vue.extend({
        data: function () {
          return {
            show: showToast,
            tip: tips,
            type: 'lx-toast-' + curType
          }
        },
        template: tmp
      });
      toastVM = new toastTpl()
      let tpl = toastVM.$mount().$el;
      document.getElementById("app").appendChild(tpl);
    }
    toastVM.type = 'lx-toast-' + curType;
    toastVM.tip = tips;
    toastVM.show = showToast = true;

    setTimeout(function () {
      toastVM.show = showToast = false;
    }, opt.duration)
  };

  ['bottom', 'center', 'top'].forEach(function (type) {
    Vue.prototype.$toast[type] = function (tips) {
      return Vue.prototype.$toast(tips, type)
    }
  });

  Vue.prototype.$loading = function (tips, type) {
    if (type == 'close') {
      loadNode.show = showLoad = false;
    } else {
      if (showLoad) {
        // 如果loading还在，则不再执行
        return true;
      }
      let loadTpl = Vue.extend({
        data: function () {
          return {
            show: showLoad
          }
        },
        template: '<div v-show="show" class="lx-load-mark"><div class="lx-load-box"><div class="lx-loading"><div class="loading_leaf"></div></div>' + (tips||'') + '</div></div>'
      });
      loadNode = new loadTpl();
      let tpl = loadNode.$mount().$el;

      document.getElementById("app").appendChild(tpl);
      loadNode.show = showLoad = true;
    }
  };
  ['open', 'close'].forEach(function (type) {
    Vue.prototype.$loading[type] = function (tips) {
      return Vue.prototype.$loading(tips, type)
    }
  });
  //modal
  Vue.prototype.$message = function (title, content = "", callback) {
    // toastVM.show = showToast = false;
    let tmp = '<div class="lx-message-bg" v-if="showMessage"><div class="lx-message"><div class="title" v-html="title"></div><div class="content" v-html="content"></div><div class="close" v-on:click="callback">我知道了</div></div></div>';

    let toastTpl = Vue.extend({
      data: function () {
        return {
          showMessage: true,
          title: title,
          content: content,
        }
      },
      template: tmp,
      methods: {
        callback: function () {
          this.showMessage = false;
          if (callback) {
            callback();
          }
        }
      }
    });
    let tpl = new toastTpl().$mount().$el;
    document.getElementById("app").appendChild(tpl);
  }
  //confirm
  Vue.prototype.$confirm = function (title, success, fail, successBtn = '确认', failBtn = '取消') {
    // toastVM.show = showToast = false;
    let tmp = '<div class="lx-confirm-bg" v-if="showMessage">' +
      '<div class="lx-confirm">' +
      '<div class="title" v-html="title"></div>' +
      '<div class="buttons">' +
      '<div class="item" v-on:click="callback(false)">' + failBtn + '</div>' +
      '<div class="item" v-on:click="callback(true)">' + successBtn + '</div>' +
      '</div>' +
      '</div>' +
      '</div>';

    let toastTpl = Vue.extend({
      data: function () {
        return {
          showMessage: true,
          title: title,
        }
      },
      template: tmp,
      methods: {
        callback: function (state) {
          this.showMessage = false;
          if (state) {
            success && success()
          } else {
            fail && fail();
          }
        }
      }
    });
    let tpl = new toastTpl().$mount().$el;
    document.getElementById("app").appendChild(tpl);
  }
}

// 向外暴露接口
module.exports = Toast;
