// pages/poster/poster.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'',
    postUrl:'',
    ishidden:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // loading 加载
    // wx.showLoading({
    //   title: '海报生成中...',
    // })
    // setTimeout(() => {
    //   wx.hideLoading()
    // },2000)
    // console.log(options);
    // promise.all，并发请求
    // 首先进入当前页面要取到三张图片准备绘制

    // 背景图片
    let poster1 = new Promise((resolve,reject) => {
      wx.getImageInfo({
        src: '../../assets/images/background.png',
        success:(res) => {
          resolve(res);
        }
      })
    });

    // 植物的图片
    let poster2 = new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: options.share_img,
        success: (res) => {
          resolve(res);
          this.setData({
            imgUrl:res.path
          })
        }
      })
    });

    // 小程序码的图片
    let poster3 = new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: '../../assets/images/code.jpg',
        success: (res) => {
          resolve(res);
        }
      })
    });

    // 并发请求
    Promise.all([poster1,poster2,poster3])
    .then((res) => {
      console.log(res);
      // 取到三张图片的地址
      var bgimg = res[0].path,
          flowerimg = res[1].path,
          codeimg = res[2].path,
          // 画布的宽高
          height = 500,
          width = 300,
          // 取到植物的图片的原始宽高
          img_width = res[1].width,
          img_height = res[1].height;

      // 请求成功后开始绘制海报

      // 获取上下文的<canvas>组件canvas-id属性
      const ctx = wx.createCanvasContext('shareImg');

      // 对植物图片裁剪的值进行设置
      var cut_left,
          cut_top,
          cut_width,
          cut_height = img_width * (300/500);

      if(cut_height > img_height){
        cut_height = img_height;
        cut_width = cut_height*(500/300);
        cut_left = (img_width - cut_width)/2;
        cut_top = 0;
      }else{
        cut_left = 0;
        cut_top = (img_height - cut_height)/2;
        cut_width = img_width;
      }

      // 绘制背景图片
      ctx.drawImage('../../' + bgimg, 0, 0, width, height);
      // 绘制植物图片
      ctx.drawImage(this.data.imgUrl, cut_left, cut_top, cut_width, cut_height, 0, 0, width, 200);
      // 绘制小程序码,100,100
      ctx.drawImage('../../' + codeimg, (width-100)/2, 300, 100, 100);

      // 绘制文字
      // 文字居中
      ctx.setTextAlign('center');
      // 文字颜色
      ctx.setFillStyle('rgb(253,251,250)');
      // 文字大小
      ctx.setFontSize(16);
      ctx.fillText('小程序扫一扫',width/2,260);
      ctx.fillText('AI识花',width/2,450);
      ctx.fillText(options.share_name,width/2,190);

      // 绘制
      ctx.draw(false,setTimeout(() => {
        // console.log('222');
        this.showimg();
      },1500))

    })
    .catch((err) => {
      console.log(err);
    })
  },

  // 生成图片
  showimg(){
    // console.log('333');
    // wx.hideLoading()
    // this.setData({
    //   ishidden: false
    // })
    wx.canvasToTempFilePath({
      canvasId:'shareImg',
      success: (res)=>{
        // console.log('111');
        // wx.hideLoading();
        console.log(res);
        this.setData({
          postUrl: res.tempFilePath,
          // ishidden: false
        })
      },
      fail: (err)=>{
        console.log(err);
      }
    })
  },

  // 保存到本地相册
  saveImg(){
    wx.saveImageToPhotosAlbum({
      filePath: this.data.postUrl,
      success:(res) => {
        console.log('保存成功');
      },
      fail:(err) => {
        console.log(err);
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'AI识花小程序，你也来试试把',
      imageUrl: '../../assets/images/flower.jpg',
      path: 'pages/index/index'
    }
  }
})