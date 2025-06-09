const SMOOTHING=false;

//仮想画面
let vcan =document.createElement("canvas");
let vcon =vcan.getContext("2d");

//キャンバス画面
let can =document.getElementById("can");
let con =can.getContext("2d");

const GAME_FPS=1000/60;
const SCREEN_SIZE_W=256;  //画面サイズ縦
const SCREEN_SIZE_H=224;  //画面サイズ横

vcan.width = SCREEN_SIZE_W;
vcan.height = SCREEN_SIZE_H;
vcon.font="10px 'DotGothic16'";

can.width = SCREEN_SIZE_W*3;
can.height = SCREEN_SIZE_H*3;

con.mozimageSmoothingEnabled = SMOOTHING;
con.webkitimageSmoothingEnabled=SMOOTHING;
con.msimageSmoothingEnabled =SMOOTHING;
con.imageSmoothingEnabled =SMOOTHING;
con.font="30px 'DotGothic16'";

//一つのブロックが縦、横に何個並ぶのか
const MAP_SIZE_W = SCREEN_SIZE_W/16;
const MAP_SIZE_H = SCREEN_SIZE_H/16;

//マップデータのブロック数
const FIELD_SIZE_W=128;
const FIELD_SIZE_H=60;//80

//
let gameOver=false;
let gameStart=false;
let gameReset=false;

//アニメーション変数
let animationId;

//フレームレート維持
let frameCount =0;
let startTime;

let cancelflag=false;

const TO_RADIANS=Math.PI/180;

//キャラ画像
let chImg =new  Image();
chImg.src="chara.sprite.png"
//マップ画像
let mapImg =new  Image();
mapImg.src="possesed.sprite.png"
//背景画像
let backImg =new  Image();
backImg.src="background.png"


//キーボード(連想配列)
let keyb={};
let key=[];

//オブジェクトグループ
let playerattack=[];
let monster=[];
let monsterattack=[];
let massage=[];
let item=[];
let anime=[];
let action=[];

//プレイヤーを作る
let player=new Player(5<<4,17<<4);
//フィールドを作る
let field=new Field();
//映像クラスを作る
let film=new Film();
//背景を作る
let background=new BackGround();
//インベントリを作る
let inventory=new Inventory();
//音声を作る
let audio=new Audio();

//ローカルストレージインスタンスを作る
let itemdatalist=[];  //所持アイテムの情報
let itemlocationlist=[]; //取得済みアイテム位置情報
//let collectionlist=[]  //コレクションアイテムの情報
let talkphaselist=[0];   //会話フェーズの情報(今後キャラを増やすとき用に配列)
let actionlocationlist=[]; //アクションマス(フラグが立った)の位置情報
let user_data={  //初期値の設定
    player_x:player.x,
    player_y:player.y,
    player_hp:player.mhp,
    player_prehp:player.prehp,
    player_type:player.type,
    item_datalist:itemdatalist,
    item_locationlist:itemlocationlist,
    item_collectionlist:inventory.collectlist,
    action_talkphase:talkphaselist,
    action_locationlist:actionlocationlist,
};
let storage=new LocalStorage(user_data);
storage.data=user_data;


function updateObj(obj)
{

    for(let i=obj.length-1;i>=0;i--)
    {

        obj[i].update();
        if(obj[i].kill)obj.splice(i,1);
    }
}

//更新処理
function update()
{
    //if(!gameStart)return;
    background.update();
    field.update();

    updateObj(anime);
    updateObj(playerattack);
    updateObj(monsterattack);
    updateObj(monster);
    updateObj(massage);
    updateObj(item);
    updateObj(action);

    player.update();
    inventory.update();
    film.update();

}

//スプライトの描画
function drawsprite(snum,x,y)
{
    sx=sprite[snum].x;
    sy=sprite[snum].y;
    sw=sprite[snum].w;
    sh=sprite[snum].h;
    let px  = x-(sw>>1);
    let py  = y-(sh>>1);
    
    vcon.drawImage(chImg,sx,sy,sw,sh,
            px,py,sw,sh);
    //vcon.fillStyle="white";//デバッグとして中心座標表示
    //vcon.fillRect(x,y,2,2);
}

function drawObj(obj)
{
        for(let i=0;i<obj.length;i++)
            obj[i].draw();
}

//描画処理
function draw()
{
    if(!gameStart)return;
    //描画をクリア
    vcon.clearRect(0,0,SCREEN_SIZE_W,SCREEN_SIZE_H);
    vcon.beginPath();
    con.clearRect(0,0,SCREEN_SIZE_W*3,SCREEN_SIZE_H*3);
    con.beginPath();

    //画面をkuro色でクリア
    vcon.fillStyle="black";
    vcon.fillRect(0,0,SCREEN_SIZE_W,SCREEN_SIZE_H);

    //マップを表示
    background.draw();
    drawObj(anime);
    field.draw();
    drawObj(action);

    drawObj(monsterattack);
    drawObj(monster);
    drawObj(playerattack);
    player.draw();
    drawObj(item);
    drawObj(massage);
    inventory.draw();
    film.draw();
  
    //デバック情報を表示
    vcon.font=" 12px 'DotGothic16'";
    vcon.fillStyle="#FFF";
    //vcon.fillText("FRAME:"+frameCount,10,20);
    vcon.fillText("HP:"+player.hp,5,20);
    //vcon.fillText("x:"+(player.x>>8),10,40);
    //vcon.fillText("y:"+(player.y>>8),10,50);
    /*vcon.fillText("cancelflag:"+cancelflag,10,60);
    vcon.fillText("actionlocationlist:"+actionlocationlist,10,70);
    vcon.fillText("locationlist:"+itemlocationlist,10,80);
    vcon.fillText("back:"+floardata[field.floar].back,10,90);
    if(item.length)vcon.fillText("item.length:"+item.length,10,100);
    if(action.length)vcon.fillText("action.length:"+action.length,10,110);
    if(monster.length)vcon.fillText("monster.remove:"+monster[0].remove,10,120);
    vcon.fillText("player.type:"+player.type,10,130);*/
    //vcon.fillText("film.talk:"+film.talk,10,140);
    //プレイヤーのHPを表示する
    if( player.hp>0)
    {
        let sz=(SCREEN_SIZE_W-200)*player.hp/player.mhp;
        let sz2=(SCREEN_SIZE_W-200);
    
        vcon.fillStyle ="rgba(0,255,0,0.5)";
        vcon.fillRect(55,10,sz,10);
        vcon.strokeStyle ="rgba(0,0,255,0.9)";
        vcon.strokeRect(55,10,sz2,10);
    }
    
    //仮想画面から実画面へ拡大転送
    con.drawImage(vcan,0,0,SCREEN_SIZE_W,SCREEN_SIZE_H,
        0,0,SCREEN_SIZE_W*3,SCREEN_SIZE_H*3);
}



//ループ開始
function gameInit()
{
    startTime=performance.now();
    mainloop();
}

//メインループ
function mainloop()
{

    let nowTime=performance.now();
    let nowFrame =(nowTime-startTime)/GAME_FPS

    if(nowFrame>frameCount)
    {
        let c=0;
        while(nowFrame>frameCount)
        {
            frameCount++;
            //更新処理
            update();
            if(c++>=4)break;
        }
        //描画処理
        draw();
    }
    if( gameOver ||film.end/*&& keyb.RBUTTON*/){
        if((film.cou++>(60*44)&&gameOver)||(film.cou>(60*263)&&film.end)||keyb.RBUTTON){
            film.cou=0;
            //cancelAnimationFrame(animationId);
            //animationId=undefined;
            audio.bgmStop(audio.bnum);
            film.gamehome();
            gameStart=false;
            gameOver=false;
            film.end=false;
        }
        //else animationId=requestAnimationFrame(mainloop);
    }
     /*animationId=*/requestAnimationFrame(mainloop);
}

document.fonts.ready.then(function(){ //ホーム画面表示
    film.gamehome();
})

//キーボードが押された時に呼ばれる
document.onkeydown =function(e)
{
    if(e.keyCode==37)keyb.Left =true;
    if(e.keyCode==39)keyb.Right =true;
    if(e.keyCode==65)keyb.BBUTTON =true; //a
    if(e.keyCode==32)keyb.ABUTTON =true; //space
    if(e.keyCode==68)keyb.CBUTTON =true; //d
    if(e.keyCode==87)keyb.DBUTTON =true; //w
    if(e.keyCode==82)keyb.RBUTTON =true;
    if(e.keyCode==16)keyb.SBUTTON =true;//shift

    //ゲーム開始
    if( !gameStart && keyb.ABUTTON)film.gamestart();
    if(keyb.SBUTTON&&(gameStart==false)){//データリセット
        storage.delete(); 
        user_data={  //初期値の再設定
            player_x:5<<8,
            player_y:17<<8,
            player_hp:player.mhp,
            player_prehp:undefined,
            player_type:0,
            item_datalist:[],
            item_locationlist:[],
            item_collectionlist:[],
            action_talkphase:[0],
            action_locationlist:[],
        };
        storage.data=user_data;
        let list=itemlocationlist;
        for(let i=0;i<list.length;i++){//消去したアイテムマスを復元させる
            fieldData[list[i][1]*FIELD_SIZE_W+list[i][0]]=list[i][2];
        }
        list=actionlocationlist;
        for(let i=0;i<list.length;i++){//消去したアイテムマスを復元させる
            fieldData[list[i][1]*FIELD_SIZE_W+list[i][0]]=list[i][2];
        }
        con.font=" 30px 'DotGothic16'";
        con.fillStyle="#FFF";
        con.fillText("データ消去",10,90);
    }

}

//キーボードが離された時に呼ばれる
document.onkeyup =function(e)
{
    if(e.keyCode==37)keyb.Left =false;
    if(e.keyCode==39)keyb.Right =false;
    if(e.keyCode==65)keyb.BBUTTON =false;
    if(e.keyCode==32)keyb.ABUTTON =false;
    if(e.keyCode==68)keyb.CBUTTON =false;
    if(e.keyCode==87)keyb.DBUTTON =false;
    if(e.keyCode==82)keyb.RBUTTON =false;
    if(e.keyCode==16)keyb.SBUTTON =true;
}

//当たり判定
function checkHit(x1,y1,r1,  x2,y2,r2)
{

    let a=(x2-x1)>>4;
    let b=(y2-y1)>>4;
    let r=r1+r2;

    return r*r>=a*a + b*b;
}

//ダメージ関数
function playerDamage(atk){
         if((player.hp-=atk)<=0)
            {
                if(player.type==0)gameOver=true;
                else{
                    player.type=0;
                    player.mhp=100;
                    player.hp=player.prehp;
                    player.muteki=60;
                    player.guard=false;
                }
            }
            else
            {
                player.muteki=60;
                audio.enum=2;
                audio.seFunc(audio.enum);
            }
}
