"use strict";
// 6e177c30309d027051c3b5880b59d5f201765491708b2055722f909aa7fb4566
var config = {
    dappAddress: 'n228TsVswdoVU8dPWKtDzmD4hXzpUHwSvVP',
    // mode: 'https://testnet.nebulas.io',
    mode: 'https://Mainnet.nebulas.io',
}

var intervalQuery
let nebulas = require("nebulas");
let Account = nebulas.Account;
let neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest(config.mode));
// neb.setRequest(new nebulas.HttpRequest("https://Mainnet.nebulas.io"));
let from = Account.NewAccount().getAddressString();
let NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
let nebPay = new NebPay();
var serialNumber;
var name;
var callbackUrl = NebPay.config.testnetUrl; //

if (install()) {
    setName()
}

function setName() {
    name = localStorage.getItem('name') || '';
    if (name == null || name == 'null' || name == '') {
        name = prompt("请输入游戏昵称，不可超过4个字哦！", "");
        if (name == null) {
            setName();
        } else {
            if (name.length > 4) {
                setName();
                return
            }
            localStorage.setItem('name', name)
            all()
        }
    } else {
        all()
    }

}


function login() {
    let value = "0";
    let callFunction = "save";
    var arg1 = 'cleartime';
    var callArgs = JSON.stringify([arg1, points]);
    // let callArgs = "[" + JSON.stringify(obj) + "]"
    // var callArgs = "[\"" + JSON.stringify(str) + "\"]"
    serialNumber = nebPay.call(config.dappAddress, value, callFunction, callArgs, { //使用nebpay的call接口去调用合约,
        listener: cbPush, //设置listener, 处理交易返回信息
        callback: callbackUrl
    });
    intervalQuery = setInterval(function () {
        funcIntervalQuery();
    }, 10000);
}

function save(points) {
    // console.log('得分' + points)
    var value = "0";
    var callFunction = "save"
    //var callArgs = "[\"" + $("#search_value").val() + "\",\"" + $("#add_value").val() + "\"]"
    var callArgs = JSON.stringify([name, JSON.stringify(points)]);
    serialNumber = nebPay.call(config.dappAddress, value, callFunction, callArgs, { //使用nebpay的call接口去调用合约,
        listener: cbPush, //设置listener, 处理交易返回信息
        callback: callbackUrl
    });

    intervalQuery = setInterval(function () {
        funcIntervalQuery();
    }, 10000);
}

function init() {
    var value = "0";
    var nonce = "0"
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callArgs = JSON.stringify([name]);
    var callFunction = "get";
    var contract = {
        "function": callFunction,
        "args": callArgs
    }

    neb.api.call(from, config.dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (res) {
        var res = res.result;
        if (res) {
            res = JSON.parse(res)
        }
    }).catch(function (err) {
        //cbSearch(err)
        // console.log("error:" + err.message)
    })
}



function all() {

    var value = "0";
    var nonce = "0"
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callArgs = JSON.stringify(['0', '10']);
    var callFunction = "getAll";
    var contract = {
        "function": callFunction,
        "args": callArgs
    }

    neb.api.call(from, config.dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (res) {
        var res = res.result;
        if (res) {
            res = JSON.parse(res)
            vm.setlist(res);
        }
    }).catch(function (err) {
        //cbSearch(err)
        // console.log("error:" + err.message)
    })
}

function all() {

    var value = "0";
    var nonce = "0"
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callArgs = JSON.stringify(['0', '10']);
    var callFunction = "getAll";
    var contract = {
        "function": callFunction,
        "args": callArgs
    }

    neb.api.call(from, config.dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (res) {
        var res = res.result;
        if (res) {
            res = JSON.parse(res)
            vm.setlist(res);
        }
    }).catch(function (err) {
        //cbSearch(err)
        // console.log("error:" + err.message)
    })
}



function gethight() {

    var value = "0";
    var nonce = "0"
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callArgs = JSON.stringify(['0', '10']);
    var callFunction = "getAll";
    var contract = {
        "function": callFunction,
        "args": callArgs
    }

    return new Promise((reslove, reject) => {
        neb.api.call(from, config.dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (res) {
            var res = res.result;
            if (res) {
                res = JSON.parse(res)
                reslove(res)
            }
        }).catch(function (err) {
            reject(err)
        })
    })
}


function funcIntervalQuery() {
    var options = {
        callback: callbackUrl
    }
    nebPay.queryPayInfo(serialNumber, options) //search transaction result from server (result upload to server by app)
        .then(function (resp) {
            // console.log("tx result: " + resp) //resp is a JSON string
            var respObject = JSON.parse(resp)
            if (respObject.code === 0) {
                clearInterval(intervalQuery);
                alert('进入排行成功！')
            } else {
                clearInterval(intervalQuery);
                alert('数据正在存储中，如果您的分数够进前10，排行榜稍后会更新！')
            }
        })
        .catch(function (err) {
            // console.log(err);
        });
}


function cbPush(resp) {
    // console.log("response of push: " + JSON.stringify(resp))
    var respString = JSON.stringify(resp);
    if (respString.search("rejected by user") !== -1) {
        clearInterval(intervalQuery)
        alert(respString)
    } else if (respString.search("txhash") !== -1) {
        //alert("wait for tx result: " + resp.txhash)
    }
}