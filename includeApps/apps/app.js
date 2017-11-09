const fs = require('fs');
const path = require('path');

//検索範囲のディレクトリ
let _dir = __dirname ;
_dir = _dir.replace(/\/apps/g, ""); 

//インクルードファイルの設置ディレクトリ
const incFolder = 'include'
const _incdir = _dir + '/' + incFolder ;

//変数定義
let incFile ="";
let incfileList = [];
let fileList = [];
let changePath = "";

//インクルードファイルの設置ディレクトリにあるファイル検索
incfiles = fs.readdirSync(_incdir);
incfiles.filter(function(incfile){
 return fs.statSync(_incdir + "/" + incfile).isFile() && /.*\.html$/.test(incfile); 
}).forEach(function (incfile) {
 incfileList.push(incfile);
});

//下層フォルダ含めhtmlファイル検索
let searchFile = function(path, fileCallback){
 files = fs.readdirSync(path);
 files.forEach(function(file){
  let _f = path + "/" + file;
  //インクルードファイルの設置ディレクトリと/node_modules/ディレクトリは除外 その他除外したいディレクトリがある場合は条件追加
  if( ~_f.indexOf('/'+ incFolder +'/') || ~_f.indexOf('/node_modules/')){
    
  }else if(fs.statSync(_f).isDirectory()){
   searchFile(_f, fileCallback);
  }else{
   if(~_f.indexOf('.html')){//htmlファイルしか修正しないように絞り込み 
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


//インクルードファイルの設置ディレクトリにあるファイル数
const incfileListLength = incfileList.length;

//htmlファイルの数
const fileListLength = fileList.length;

for(　let i = 0 ; i < incfileListLength; i++){

//インクルードファイルの設置ディレクトリにあるi番目のファイル名をincFileに格納
incFile = incfileList[i];

  for(　let j = 0 ; j < fileListLength; j++){

    //インクルードファイルの設置フォルダにあるi番目のファイルの中身をincDataに格納、incDataのリセット
    let incData = fs.readFileSync(_incdir + "/" + incFile,'utf-8');

    //j番目のhtmlファイル名をchangeFileに格納
    let changeFile = fileList[j];

    //j番目のhtmlファイルの中身をchangeFileDataに格納
    let changeFileData = fs.readFileSync(changeFile,'utf-8');
    
    //incDataの「../」を「changePathKari」に変換
    incData = incData.replace(/\.\.\//g, 'changePathKari'); 
    
    //j番目のhtmlファイルのパスをfilePathに格納
    let filePath = path.dirname(changeFile);
    
    //検索範囲ディレクトリをrootとしたときのj番目のhtmlファイルのファイルパスに変換
    filePath = filePath.replace(_dir,"");
    
    //検索範囲ディレクトリをrootとしたとき、j番目のhtmlファイルがどれくらいの下の階層にいるか判定
    let hierarchySize = (filePath.match(/\//g)||[]).length;
    
    //changePathリセット
    changePath = "";
    
    //changePath生成
    if( hierarchySize == 0 ){
      changePath = "./";
    }else{
      for( let k = 0 ; k < hierarchySize ; k++ ){
        changePath = changePath + "../";
      }
    }
    
    //changePathKariをchangePathに変更
    incData = incData.replace(/changePathKari/g,changePath);

    //書き換えの箇所の始まり「<!-- incFile -->」
    let startStr = '<!-- '+ incFile +' -->';
    
    //書き換えの箇所の終わり「<!-- end incFile -->」
    let endStr = '<!-- end '+ incFile +' -->';
    
    //書き換えhtmlの作成
    let replaceData = startStr + '\n' + incData + '\n' + endStr;
    let conditions = '\s\S';
    re = new RegExp(startStr +'[\\s\\S]*?' + endStr, "g");

    //j番目のhtmlファイルの「<!-- incFile -->」〜「<!-- end incFile -->」をincDataに中身に書き換え
    changeFileData = changeFileData.replace(re, replaceData); 
    fs.writeFileSync(changeFile, changeFileData);

  }
}
