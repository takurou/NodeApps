var fs = require('fs');
var path = require('path');

//検索範囲のフォルダ
var _dir = __dirname ;
_dir = _dir.replace(/\/apps/g, ""); 


//変数定義
var fileList = [];

//置換したいテキスト配列　replaceTextList{ 置換前のテキスト：置換語のテキスト }
var replaceTextList = {
  "aa" : "bb",
  "test" : "honban"
};


//下層フォルダ含めhtmlファイル検索
var searchFile = function(path, fileCallback){
  files = fs.readdirSync(path);
  files.forEach(function(file){
    var _f = path + "/" + file;
    //インクルードファイルの設置フォルダと/node_modules/フォルダは除外
    if( ~_f.indexOf('/node_modules/')){
      
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

for(　var j = 0 ; j < fileListLength; j++){
  for( replaceText in replaceTextList ){
    
    //置換後のテキストをreplaceAfterTextに格納
    var replaceAfterText = replaceTextList[replaceText];
    
    //置換前のテキスト
    replaceText = new RegExp(replaceText, "g");
    
    //j番目のhtmlファイル名をchangeFileに格納
    var changeFile = fileList[j];
  
    //j番目のhtmlファイルの中身をchangeFileDataに格納
    var changeFileData = fs.readFileSync(changeFile,'utf-8');
    
    //changePathKariをchangePathに変更
    changeFileData = changeFileData.replace(replaceText,replaceAfterText);
  
    fs.writeFileSync(changeFile, changeFileData);
  }
}

