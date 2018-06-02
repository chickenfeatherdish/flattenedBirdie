var succ = false;



var vm = new Vue({
  el: '#rank',
  data: {
    list: []
  },
  methods: {
    chanlrank: function () {
      document.getElementById('rank').style.display = 'none';
    },
    setlist: function (res) {
      if (res.length == 1) {
        this.list = res;
        return
      }
      var allArr = [];
      for (var i = 0; i < res.length; i++) {　　
        var flag = true;　　
        for (var j = 0; j < allArr.length; j++) {　　　　
          if (res[i].key == allArr[j].key) {　　　　　　
            flag = false;　　　　
          };　　
        };　　
        if (flag) {
          allArr.push(res[i]);　　
        };
      };
      res = allArr;

      this.list = res.sort(function (v1, v2) {
        return Number(v2.value) - Number(v1.value)
      });
      this.list.slice(0, 10);
    }
  }
})


function install() {
  if (typeof webExtensionWallet === "undefined") {
    confirm('请先在谷歌浏览器安装星云链钱包插件', '');
    window.open(
      "https://github.com/ChengOrangeJu/WebExtensionWallet"
    );
    return false;
  }
  return true;
}

function end() {
  if (points == 0) {
    alert('哧哧哧！一分都没有！')
    return
  }
  gethight().then(r => {
    let list = r.filter(function (t) {
      return t.key == name;
    }).sort(function (v1, v2) {
      return Number(v2.value) - Number(v1.value)
    })[0];
    if (!list) {
      var r = confirm("刷新自己最高分，我要上榜！")
      if (r == true) {
        save(points)
      }
      return
    }
    if (list.value && list.value > points) {
      return
    }

    var r = confirm("刷新自己最高分，我要上榜！")
    if (r == true) {
      save(points)
    }
  })

}

function paihangbang() {
  if (gameover.visible) {
    document.getElementById('rank').style.display = 'block';
    all();
  }

}