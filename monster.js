
class Monster
{
    constructor(bl,x,y)
    {
        this.ox=x;
        this.oy=y;
        this.bl=bl;
        this.x=x<<8;
        this.y=y<<8;
        this.snum=23;
        this.vx=bl==57?-5:0;
        this.vy=bl==55?2:0;
        this.tnum =monsterReturnFunc(bl).tnum;
        this.r    =monsterReturnFunc(bl).r;
        this.w=0;
        this.h=0;
        this.mhp   =monsterReturnFunc(bl).hp;
        this.hp   =this.mhp;
        this.atk=monsterReturnFunc(bl).atk;
        this.backbl=monsterReturnFunc(bl).backbl;
        if(this.backbl==26&&(fieldData[(this.oy+1)*FIELD_SIZE_W+this.ox]==28))this.backbl=28;
        this.kill=false;
        this.muteki=0;
        this.link=this.tnum==6?1:0;//0でヒョーイ
        this.acou=0;
        this.flag1=0;
        this.flag2=0;
        this.swimflag=false;
        this.tamaflag=0;
        this.chc=false;
        this.angle=0;
        this.reload=0;
        this.dirc=0;
        this.remove=false;  //描画をやめてクラスは残す
        fieldData[y*FIELD_SIZE_W+x]=this.backbl;
    }

            //床の判定
            checkFloor()
            {
                if(this.vy<=0)return;
        
                let lx=((this.x+this.vx)>>4);
                let ly=((this.y+this.vy)>>4);
        
                if(field.isBlock(lx+(this.w>>1),ly+(this.h>>1))==1||
                   field.isBlock(lx,ly+(this.h>>1))==1||
                   field.isBlock(lx-(this.w>>1),ly+(this.h>>1))==1)
                {
                    if(this.anim==ANIME_JUMP)this.anim=ANIME_WALK;
                    if(this.vy>GRAVITY&&this.tnum==6)bossFunc1(this); //ゴーレム落石
                    this.jump=0;
                    this.vy=0;
                    
                    //足が食い込んだブロックの座標(左上)に身長を引く
                    this.y=((((ly+(this.h>>1))>>4)<<4)-(this.h>>1))<<4;
                }

            }

    //天井の判定
    checkCeil()
    {
        if(this.vy>=0)return;

        let lx=((this.x+this.vx)>>4);
        let ly=((this.y+this.vy)>>4);

        let bl;
        //戻り値が０でfalse、それ以外はブロックリストの値として参照
        if(bl=field.isBlock(lx,ly-(this.h>>1))==1)
        {
            this.vy=0;
            this.chc=true;
            /*if(this.tnum==2){//コウモリ
                this.angle=180
                this.vx=0;
                this.snum=40;
            }*/
        }
         else this.chc=false;
    }

        //横の壁の判定
        checkWall()
        {

            let lx=((this.x+this.vx)>>4);
            let ly=((this.y+this.vy)>>4);
            let w=this.w;
            let h=this.h;
    
            //右側のチェック
            if(field.isBlock(lx+(w>>1),ly-(h>>1)+(h/3))==1||
               field.isBlock(lx+(w>>1),ly)==1||
               field.isBlock(lx+(w>>1),ly+(h>>1)-(h/3))==1)
            {
                if(this.tnum!==1)this.vx=0;
                this.x-=5;
                if(this.tnum==1)this.flag2=1;
                this.angle=270;
            }
            else //左側のチェック
            if(field.isBlock(lx-(w>>1),ly-(h>>1)+(h/3)/*+6*/)==1||
               field.isBlock(lx-(w>>1),ly)==1||
               field.isBlock(lx-(w>>1),ly+(h>>1)-(h/3)/*-6*/)==1)
            {
                if(this.tnum!==1)this.vx=0;
                this.x+=5;
                if(this.tnum==1)this.flag2=1;
                if(this.tnum==4){
                    this.flag1=false;
                    this.flag2=1;
                }

                this.angle=90;
            }
            else
            {
                if(this.tnum==1)this.flag2=0;
            }
        }
    
    //ブロックの種類の判定
    checkBlock()
    {
        let lx=((this.x+this.vx)>>4);
        let ly=((this.y+this.vy)>>4);
        if(field.isBlock(lx,ly)[0]==2)this.swimflag=true;
        else this.swimflag=false;
    }

    update()
    {
        if(this.kill){
            if(this.tnum!==6||this.remove==false)fieldData[this.oy*FIELD_SIZE_W+this.ox]=this.bl;
            if(this.tnum==6){//ゴーレムbgmを消去
                audio.bgmStop(4);
                audio.bgmStart(floardata[field.floar].back);
                audio.bnum=field.back;
            }
        }
        if(this.remove)return;
        if(this.kill)return;
        if(cancelflag)return;

    
        if(this.muteki)this.muteki--;
        this.acou++;
        if(this.reload>0)this.reload--;
        //重力
        if(this.vy<64&&this.tnum!==3)this.vy+=GRAVITY;

        monsterFunc[this.tnum](this);

        this.checkBlock();
        //横の壁のチェック
        this.checkWall();
        //床のチェック
        this.checkFloor();
        //天井のチェック
        this.checkCeil();

      

        
        
        //当たり判定
        if(!gameOver && !player.muteki &&!player.guard&& checkHit(this.x, this.y, this.r,
                    player.x, player.y, player.r) )
        {
            playerDamage(this.atk);
        }

        if(!cancelflag){
            this.x+=this.vx;
            this.y+=this.vy;
        }
    }

    draw()
    {
        if(this.remove)return;
        if(this.muteki && (this.acou&10)>5)return;
        let px=(this.x>>4)-field.scx;
        let py=(this.y>>4)-field.scy;

        if(this.tnum==1)monsterDraw01(this);
        else if(this.tnum==2)monsterDraw02(this);
        else drawsprite(this.snum,px,py);
    }
}
//
//
//

//スライム
function monsterMove00(obj)
{
    if(obj.x>player.x){
        obj.vx=-5;
        obj.snum=25;
    }
    if(obj.x<player.x){
        obj.vx=5;
        obj.snum=24;
    }

    obj.w=sprite[obj.snum].w;
    obj.h=sprite[obj.snum].h;
}

//トカゲ
function monsterMove01(obj)
{
    //if(obj.flag1>0)obj.flag1--;
    obj.snum=33
    if(Math.abs(obj.x-player.x)<=(100<<4)){
    if(!obj.swimflag){
        if(Math.abs(obj.x-player.x)<(10<<4))obj.vx=0;
        else if(obj.x>player.x){
            obj.vx=-5;
            obj.snum=33+((obj.acou>>4)&2);
        }
        if(obj.x<player.x){
            obj.vx=5;
            obj.snum=26+((obj.acou>>4)&2);
        }
        if(obj.flag2){
            obj.vy=-10;
        }
    }
    else{
        if(Math.abs(obj.x-player.x)<(10<<4))obj.vx=0;
        else if(obj.x>player.x){
            obj.vx=-3;
            obj.snum=37+((obj.acou>>4)&2);
            if(obj.flag2)obj.vx=-5
        }
        if(obj.x<player.x){
            obj.vx=3;
            obj.snum=30+((obj.acou>>4)&2);
            if(obj.flag2)obj.vx=5
        }
        if(obj.flag2){
            obj.vy=-5;
        }
    }
    }
    else{
        obj.vx=0;
    }

    obj.w=sprite[obj.snum].w;
    obj.h=sprite[obj.snum].h;

}
function monsterDraw01(obj){
    vcon.save();
    let px=(obj.x>>4)-field.scx;
    let py=(obj.y>>4)-field.scy;
    let sw=obj.w;
    let sh=obj.h;
    let x  = px-(sw>>1);
    let y  = py-(sh>>1);
    let sx=sprite[obj.snum].x;
    let sy=sprite[obj.snum].y;


   if(obj.angle){
    vcon.translate(px,py);
    vcon.rotate(obj.angle*TO_RADIANS);
    //壁に沿って描画をずらす
    vcon.drawImage(chImg,sx,sy,sw,sh,
            -18,8,sw,sh);
   }
   else vcon.drawImage(chImg,sx,sy,sw,sh,
                 x,y,sw,sh);
    obj.angle=0;
   vcon.restore();
}


//コウモリ
function monsterMove02(obj)
{
    if(obj.flag1>0)obj.flag1--;
    obj.vy-=GRAVITY+1;
    if(Math.abs(obj.x-player.x)<=(100<<4)){
        if(obj.x>player.x){
            if(!obj.flag1){
            obj.vx=-20;
            obj.vy=55;
            obj.flag1=180;
            obj.chc=false;
            }
            if(!obj.angle)obj.snum=44+((obj.acou>>2)&2);
        }
        else{
            if(!obj.flag1){
                obj.vx=20;
                obj.vy=55;
                obj.flag1=180;
                obj.chc=false;
            }
            if(!obj.angle)obj.snum=41+((obj.acou>>2)&2);
        }
    }

    if(obj.chc){
        obj.angle=180
        obj.vx=0;
        obj.snum=40;
    }
    obj.w=sprite[obj.snum].w;
    obj.h=sprite[obj.snum].h;
}
function monsterDraw02(obj){//コウモリの描画
    vcon.save();
    let px=(obj.x>>4)-field.scx;
    let py=(obj.y>>4)-field.scy;
    let sw=obj.w;
    let sh=obj.h;
    let x  = px-(sw>>1);
    let y  = py-(sh>>1);
    let sx=sprite[obj.snum].x;
    let sy=sprite[obj.snum].y;


   if(obj.angle){

    vcon.translate(px,py);
    vcon.rotate(obj.angle*TO_RADIANS);
    //描画をずらす
    vcon.drawImage(chImg,sx,sy,sw,sh,
            0,0-12,sw,sh);
   }
   else vcon.drawImage(chImg,sx,sy,sw,sh,
                 x,y,sw,sh);
    obj.angle=0;
    vcon.restore();
}

//タツノウチオトシゴ
function monsterMove03(obj)
{
    if(obj.x>player.x){
        obj.snum=49+((obj.acou>>5)&1);
        obj.dirc=1;
    }
    if(obj.x<player.x){
        obj.snum=47+((obj.acou>>5)&1);
        obj.dirc=0;
    }
    let oy=obj.oy<<8;
    if(obj.y<(oy-(8<<4))){
        obj.vy=2;
    }
    else if(obj.y>(oy+(14<<4))){
        obj.vy=-2;
    }
    

    if(Math.abs(obj.x-player.x)<(150<<4)&&!obj.reload)
        {
            if(obj.flag1<4){
                if((obj.acou&5)==0){
                    monsterattack.push(new MonsterAttack(obj.x,obj.y-(5<<4),obj.dirc,5));
                    obj.flag1++;
                }
            }
            else{
                obj.reload=180;
                obj.flag1=0;
            }
        }
 
    obj.w=sprite[obj.snum].w;
    obj.h=sprite[obj.snum].h;
}

//トゲネズミ
function monsterMove04(obj){
    if(Math.abs(obj.vx)>16)obj.flag1=true;
     //衝突判定
     if(obj.flag1&&obj.vx==0){
        obj.flag1=false;
        obj.flag2=1;
     }
    
    if(!obj.flag1&&!obj.flag2){
        if(obj.x>player.x){
            if((obj.acou&10)==0)obj.vx--;
            obj.snum=86+((obj.acou>>5)&1);
        }
        else{
            if((obj.acou&10)==0)obj.vx++;
            obj.snum=88+((obj.acou>>5)&1);
        }
    }
    if(obj.flag1){
        if(obj.vx)obj.snum=90+((obj.acou>>3)&3)
        else obj.snum=93-((obj.acou>>3)&3)
    }
    if(obj.flag2){
        if(obj.x>player.x)obj.snum=96+((obj.acou>>5)&1);
        else obj.snum=94+((obj.acou>>5)&1);
        obj.link=0;
        if(obj.flag2++>180)obj.flag2=0;
    }
    else obj.link=1;

    obj.w=sprite[obj.snum].w;
    obj.h=sprite[obj.snum].h;
}

function monsterMove05(obj){//カヤクコロガシ
    let ox=obj.ox<<8;

    obj.flag1++;
    if(obj.x<(ox-(32<<4))){
        obj.vx=5;
        obj.dirc=0;
    }
    else if(obj.x>(ox+(32<<4))){
        obj.vx=-5;
        obj.dirc=1;
    }
    
    if(obj.flag1>(60<<3)){
        obj.link=1;
        obj.snum=51+((obj.acou>>5)&1);
        if(Math.abs(obj.x-player.x)<(96<<4)){
            if(obj.x>player.x&&obj.dirc==1){
                obj.flag1=0;
                obj.link=0;
                monsterattack.push(new MonsterAttack(obj.x-(4<<4),obj.y,obj.dirc,7));

            }
            else if(obj.x<player.x&&obj.dirc==0){
                obj.flag1=0;
                obj.link=0;
                monsterattack.push(new MonsterAttack(obj.x-(4<<4),obj.y,obj.dirc,7));
            }
        }
    }
    else obj.snum=53+((obj.acou>>5)&1);
    if(obj.dirc)obj.snum+=4;
    
    obj.w=sprite[obj.snum].w;
    obj.h=sprite[obj.snum].h;
    
}

function monsterMove06(obj){//ゴーレムの動き
    if(obj.acou<2){
        audio.bgmStop(field.back);//前のbgm停止
        audio.bgmStart(4);
        audio.bnum=4;
    }
    if(Math.abs(obj.x-player.x)<(48<<4)){
        obj.snum=109;
        obj.flag1++;
        if(180>obj.flag1&&obj.flag1>120){//地面叩き
            obj.snum=116;
            obj.x+=Math.pow(-1,((obj.acou>>1)&1))<<3;
        }
        else if(240>obj.flag1&&obj.flag1>180){
            obj.snum=117;
            if(obj.flag1==181){
                monsterattack.push(new MonsterAttack(obj.x+(24<<4),obj.y+(4<<4),0,10));
                monsterattack.push(new MonsterAttack(obj.x-(24<<4),obj.y+(4<<4),0,10));
            }
        }
        else if(obj.flag1>=240)obj.flag1=0;

    }
    else if(obj.x>player.x){
        obj.flag1=0;
        obj.snum=110
        obj.dirc=1;
        if(!obj.reload)obj.reload=60<<2;
        if(obj.reload==30)anime.push(new Anime(47,(obj.x>>8)+(16>>4),(obj.y>>8)+(16>>4)));
    }
    else if(obj.x<player.x){
        obj.flag1=0;
        obj.snum=113
        obj.dirc=0;
        if(!obj.reload)obj.reload=60<<2;
        if(obj.reload==30)anime.push(new Anime(47,(obj.x>>8)-(16>>4),(obj.y>>8)+(16>>4)));
    }

    //大ジャンプ
    if(obj.flag2==0){
        obj.vy=-100;
        obj.jump=1;
        obj.flag2=60<<4;
    }

    if(obj.flag2)obj.flag2--;
    if(obj.jump)obj.snum=108;

    if(!obj.jump&&obj.reload>(60<<2)-24){//カヤク投げ
        let anim=[111,110,112];
        let cou=-(obj.reload-(60<<2))
        if(obj.dirc==1){
            obj.snum=anim[cou>>3];
            if(obj.reload==(60<<2)-23)monsterattack.push(new MonsterAttack(obj.x-(16<<4),obj.y,1,7));
        }
        anim=[114,113,115]
        if(obj.dirc==0){
            obj.snum=anim[cou>>3];
            if(obj.reload==(60<<2)-23)monsterattack.push(new MonsterAttack(obj.x+(16<<4),obj.y,0,7));
        }
    }
    
    
    obj.w=sprite[obj.snum].w;
    obj.h=sprite[obj.snum].h;
}

let monsterFunc=[
    monsterMove00,//スライム
    monsterMove01,//トカゲ
    monsterMove02,//コウモリ
    monsterMove03,//たつ
    monsterMove04,//ネズミ
    monsterMove05,//虫
    monsterMove06, //ゴーレム
  ];


function bossFunc1(obj){//落石
    monsterattack.push(new MonsterAttack(obj.x,obj.y+(16<<4),0,9));
    monsterattack.push(new MonsterAttack(obj.x,obj.y+(16<<4),1,9));
    for(let i=0;i<8;i++){
    let x=(rand((obj.x>>4)-150,(obj.x>>4)+150))>>4;
    let y=(rand((obj.y>>4)-250,(obj.y>>4)-150))>>4;
    if(i<1)anime.push(new Anime(46,x,y));
    else anime.push(new Anime(45,x,y));
    obj.reload=(60<<2)-24;
}
}

  //整数のランダムを作る
function rand(min,max){
    return Math.floor( Math.random()*(max-min+1) )+min;
}
