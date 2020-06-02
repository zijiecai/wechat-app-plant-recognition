// 云函数入口文件
const cloud = require('wx-server-sdk')
var AipImageClassifyClient = require("baidu-aip-sdk").imageClassify;

cloud.init()

// 设置APPID/AK/SK
var APP_ID = "19685595";
var API_KEY = "qED8Ga6OHiYSZYOrXyaUNHoZ";
var SECRET_KEY = "GZ6iLhfVgDMqR9Uz1zncLrGmBcTsmwZa";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipImageClassifyClient(APP_ID, API_KEY, SECRET_KEY);

// 如果有可选参数
var options = {};
options["baike_num"] = "5";

// 云函数入口函数
exports.main = async (event, context) => {
  let flower = await AIflower();
  // console.log(flower);
  return{
    flower
  }

  // 定义AIflower函数
  // event.img图片必须是base64编码的
  function AIflower(){
    return new Promise((resolve,reject) => {
      // 带参数调用植物识别
      client.plantDetect(event.img, options)
      .then((res) => {
        resolve(res);
      //  resolve(JSON.stringify(res));
      })
      .catch((err) => {
        // 如果发生网络错误
        reject(err);
      });
    })
  }
}