
var helper = helper || {};

helper.URL = {
  devURL: 'http://192.168.101.121:3100/v2',
  productURL: 'http://www.public.tw//prog/ding/CK_APP_API/v2' //目的地路徑
};

helper.templateString = {
  loading: function (msg) {
    return '<div><ion-spinner style=\"stroke: #fff; fill: #fff;\" icon=\"lines\"></ion-spinner><div>'+msg+'</div></div>' ;
  }
};
