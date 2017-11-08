var fs = require('fs');
var path = require('path');

//検索範囲のフォルダ
var _dir = __dirname ;
_dir = _dir.replace(/\/apps/g, ""); 

//インクルードファイルの設置フォルダ
var incFolder = 'include'
var _incdir = _dir + '/' + incFolder ;

//変数定義
var fileList = [];

//下層フォルダ含めhtmlファイル検索
var searchFile = function(path, fileCallback){
 files = fs.readdirSync(path);
 files.forEach(function(file){
  var _f = path + "/" + file;
  //インクルードファイルの設置フォルダと/node_modules/フォルダは除外
  if( ~_f.indexOf('/'+ incFolder +'/') || ~_f.indexOf('/node_modules/')){
   
  }else if(fs.statSync(_f).isDirectory()){
   searchFile(_f, fileCallback);
  }else{
   if(~_f.indexOf('.html')){
    fileCallback(_f);
   }
  }
 });
}
searchFile(_dir,function(path){
  re = new RegExp(__dirname, "g");
  path = path.replace(re, "");
  fileList.push(path);
});


//htmlファイルの数
var fileListLength = fileList.length;

for(　var i = 0 ; i < fileListLength; i++){

  //i番目のhtmlファイル名をchangeFileに格納
  var changeFile = fileList[i];
  
  //i番目のhtmlファイルの中身をchangeFileDataに格納
  var changeFileData = fs.readFileSync(changeFile,'utf-8');
  
  //<title>タグの中身をtitleTextに格納
  var titleText = (/<title>((?:(?!<title>|\<\/title>)[^\s　])+)/g).exec(changeFileData);
  
  //<title>タグがなかった場合は処理をしない
  if(titleText != null){ 
  
   //<title>タグの中身og:titleのcontentに設定
   var ogpTitleText = '<meta property="og:title" content="'+titleText[1]+'">';
   
   //og:titleの置換前のテキストをreOgpTitleTextに格納
   reOgpTitleText = new RegExp('<meta property="og:title" content="[\\s\\S]*?">', "g");
   
   //descriptionの中身をdescriptionTextに格納
   var descriptionText = (/<meta name="description" content="((?:(?!<meta name="description" content="|\">)[^\s　])+)/g).exec(changeFileData);
 
   //descriptionの中身og:descriptionのcontentに設定
   var ogpDescriptText = '<meta property="og:description" content="'+descriptionText[1]+'">';
   
   //og:descriptionの置換前のテキストをreOgpDescriptTextに格納
   reOgpDescriptText = new RegExp('<meta property="og:description" content="[\\s\\S]*?">', "g");
   
   files = changeFile.replace(_dir,"");
   
   if( files.match("/index.html") ){
    files = files.replace("/index.html","/");
   }
   
   //filePath + files をog:urlのcontentに設定
   var ogpUrlText = '<meta property="og:url" content="http://www.nangoku.co.jp' + files + '">';
   
   //og:descriptionの置換前のテキストをreOgpDescriptTextに格納
   reOgpUrlText = new RegExp('<meta property="og:url" content="[\\s\\S]*?">', "g");
    
   //置換実行  
   changeFileData = changeFileData.replace(reOgpTitleText , ogpTitleText); 
   changeFileData = changeFileData.replace(reOgpDescriptText , ogpDescriptText); 
   changeFileData = changeFileData.replace(reOgpUrlText , ogpUrlText); 
   
   //置換したhtmlを書き込み
   fs.writeFileSync(changeFile, changeFileData);
  }
}

