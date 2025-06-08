
const ANIME_STAND=1;
const ANIME_WALK=2;
const ANIME_BRAKE=4;
const ANIME_JUMP=8;
const GRAVITY=4;
const MAX_SPEED=24;


class Player
{
    constructor(x,y)
    {
        this.x=x<<4;
        this.y=y<<4;
        this.vx=0;
        this.vy=0;
        this.anim=0;
        this.snum=0;
        this.acou=0;
        this.dirc=0;
        this.jump=0;
        this.reload=0;
        this.type=0;
        this.newtype=0;
        this.newhp=0;
        this.muteki=0;
        this.guard=false;
        this.trans=0;
        this.r=0;
        this.w=0;
        this.h=0;
        this.mhp=100;
        this.hp=this.mhp;
        this.prehp=0;
        this.swimflag=false;
        this.tamaflag=0;
        this.flag1=0;
        this.flag2=0;
        this.angle=0;
        this.chf=false;
        this.chc=false;
        this.chj=false;
    }

        //床の判定
        checkFloor()
        {
            if(this.vy<0)return;
            let lx=((this.x+this.vx)>>4);
            let ly=((this.y+this.vy)>>4);
            let gy=this.type==2?((this.w-this.h)>>1):0;
    
            if((this.flag2||this.flag1)&&this.type==2){//張り付いたトカゲの判定
                if(field.isBlock(lx,ly+(this.h>>1)+gy)==1)
                    {
                        if(this.anim==ANIME_JUMP)this.anim=ANIME_WALK;
                        this.jump=0;
                        this.vy=0;
                        this.chc=true;
                    }
                    else this.chc=false;
                }
            else{//通常の判定
                if(field.isBlock(lx+(this.w>>1)-1,ly+(this.h>>1))==1||
                field.isBlock(lx,ly+(this.h>>1))==1||
                field.isBlock(lx-(this.w>>1)+1,ly+(this.h>>1))==1)
                {
                    if(this.anim==ANIME_JUMP)this.anim=ANIME_WALK;
                    this.jump=0;
                    this.vy=0;
                    //足が食い込んだブロックの座標(左上)に身長を引く
                    this.y=((((ly+(this.h>>1))>>4)<<4)-(this.h>>1))<<4;
                    this.chf=true;
                }
                else this.jump=16;
            }
        }

    //天井の判定
    checkCeil()
    {
        if(this.vy>=0)return;

        let lx=((this.x+this.vx)>>4);
        let ly=((this.y+this.vy)>>4);
        let gx=this.type==2?((this.h>>1)-2):0;
        let gy=this.type==2?((this.w-this.h)>>1):0;
        let bl;
        //戻り値が０でfalse、それ以外はブロックリストの値として参照
        if(field.isBlock(lx+gx,ly-(this.h>>1)-gy)==1||
        field.isBlock(lx-gx,ly-(this.h>>1)-gy)==1
    )
        {
            this.jump=15;
            this.vy=0;
            this.chc=true;
            if(this.type==3)this.flag1=20;

            //ブロック換算
            let x=(lx)>>4
            let y=(ly+(this.h>>1)+4)>>4
        }
        else this.chc=false;
    }
        
        //横の壁の判定
        checkWall()
        {

            let lx=((this.x+this.vx)>>4);
            let ly=((this.y+this.vy)>>4);   
            let w=this.w>>1;
            let h=this.h>>1;
            let array=field.isBlock(lx,ly);

            //右側のチェック
            if(field.isBlock(lx+w,ly-h+(this.h/3))==1||
               field.isBlock(lx+w,ly)==1||
               field.isBlock(lx+w,ly+h-(this.h/3))==1||
               array[0]==5)
            {
                this.vx=0;
                this.x-=this.w>>1;
            }
            else //左側のチェック
            if(field.isBlock(lx-w,ly-h+(this.h/3))==1||
               field.isBlock(lx-w,ly)==1||
               field.isBlock(lx-w,ly+h-(this.h/3))==1||
               array[0]==5)
            {
                this.vx=0;
                this.x+=this.w>>1;
            }
            
        }

    //ブロックの種類の判定
    checkBlock()
    {

        let lx=((this.x+this.vx)>>4);
        let ly=((this.y+this.vy)>>4);
        let array=field.isBlock(lx,ly);
        //ブロック換算
        let x=lx>>4
        let y=ly>>4

        if(array[0]==2){//水中
            this.swimflag=true;
            if(array[1]!==29&&array[1]!==28)return;
            if(!gameOver && !player.muteki &&!player.guard){
                if(array[1]==29)playerDamage(20);
                if(array[1]==28&&this.type!==4)playerDamage(3);
            }
        }
        else if(array[0]==3&&!inventory.full){//アイテム
            audio.enum=0;
            audio.seFunc(audio.enum);
            item.push(new Item(array[1],x,y));
        }
        else if(array[0]==4){//アイテム
            audio.enum=0;
            audio.seFunc(audio.enum);
            if(array[1]==38)inventory.collect1++;
            if(array[1]==39)inventory.collect2++;
            //inventory.openflag=60;
            item.push(new Item(array[1],x,y,1));
        }
        else if(array[0]==8){//ワープ判定
            field.side=field.isSide(field.floar,player.x,player.y); 
            field.warpFunc(field.side);
            field.floar=field.isFloar(player.x,player.y); //移動後に再判定
            //bgmの再生
            if(field.back!==floardata[field.floar].back){
                audio.bgmStop(field.back);//前のbgm停止
                field.back=floardata[field.floar].back;
                audio.bgmStart(field.back);
                audio.bnum=field.back;
            }
            
            film.blackout=40;
            inventory.cancelflag=40;
        }
        else this.swimflag=false;
    }

        //解除
        updateremove()
        {
            if(keyb.BBUTTON&&this.type)
                {
                    this.type=0;
                    this.mhp=100;
                    this.hp=this.prehp;
                    this.reload=120;
                }
        }
    
        //メニュー表示
        updatemenu(){
            if(keyb.DBUTTON&&!inventory.cancelflag){
                if(inventory.menuflag&&inventory.cou>20){//閉じる
                    inventory.menuflag=false;
                    inventory.cou=0;
                    cancelflag=false;
                }
                else if(!inventory.menuflag&&inventory.cou>20){//開く
                    inventory.menuflag=true;
                    inventory.cou=0;
                    cancelflag=true;
                }
            }
        }

    update()
    {
        if(gameOver){//ゲームオーバーで死亡イラスト
            return;
        }
        this.updatemenu();
        if(cancelflag)return;
        if(this.muteki)this.muteki--;
        if(this.trans)this.trans--;
        if(this.reload>0)this.reload--;
        if(this.tamaflag>0)this.tamaflag--;
        if(this.trans==30)
        {
            this.prehp=this.hp;
            this.type=this.newtype;
            this.mhp=monsterMaster[this.newtype-1].hp;
            this.hp=this.newhp;
        }
        this.acou++;
        this.updateremove();
        
        playerFunc[this.type](this);

        
        //重力
        if(this.vy<64)this.vy+=GRAVITY;
        //浮力
        if(this.swimflag&&this.vy>-32)this.vy-=3;

        this.checkBlock();


        //横の壁のチェック
        if(this.type!==2)this.checkWall();

        //床のチェック
        this.checkFloor();

        //天井のチェック
        this.checkCeil();
    
        this.x+=this.vx;
        this.y+=this.vy;
        
    }

    draw()
    {
        if(film.end)return;
        if(gameOver)return;
        if(this.muteki && (this.acou&10)>5)return;
        if(this.trans && (this.acou&10)>5)return;
        let px=(this.x>>4)-field.scx;
        let py=(this.y>>4)-field.scy;

        if(this.type==2)playerDraw02(this);
        else if(this.type==3)playerDraw03(this);
        else drawsprite(this.snum,px,py);
    }
}
//
//
//

    function playerMove00(obj){//ノームの動き
        obj.guard=false;
        //ジャンプ処理
        if(!obj.swimflag)
        {
           if(keyb.ABUTTON)
           {
               if(obj.jump==0)
               {
                   obj.anim=ANIME_JUMP;
                   obj.jump=1;
               }
               if(obj.jump<15)obj.vy=-(48-obj.jump);
           }
           if(obj.jump)obj.jump++;
        }
        else
        {
            if(keyb.ABUTTON)
            {
                   obj.vy=-16;
            }
            obj.jump=0;
        }

        //歩き処理
    function updateWalkSub(obj,dir)
    {
        if(dir==0&&obj.vx<MAX_SPEED&&!obj.swimflag)obj.vx++;
        if(dir==1&&obj.vx>-MAX_SPEED&&!obj.swimflag)obj.vx--;
        if(dir==0&&obj.vx<(MAX_SPEED>>1)&&obj.swimflag)obj.vx++;
        if(dir==1&&obj.vx>-(MAX_SPEED>>1)&&obj.swimflag)obj.vx--;

        if(!obj.jump)
        {
            if(obj.anim==ANIME_STAND)obj.acou=0;
            obj.anim=ANIME_WALK;
            obj.dirc=dir;
        }
     }

        if(keyb.Left){
            updateWalkSub(obj,1);
        }else if(keyb.Right){
            updateWalkSub(obj,0);
        }else{
            if(!obj.jump)
            {
                if(obj.vx>0)obj.vx-=1;
                if(obj.vx<0)obj.vx+=1;
                if(obj.flag1||obj.flag2)obj.vy=0;
                if(!obj.vx)obj.anim=ANIME_STAND;
            }
        }
        //弾処理
            if(keyb.BBUTTON&&!obj.reload)
                {
                    playerattack.push(new PlayerAttack(obj.x,obj.y,obj.dirc,0));
                    audio.enum=1;
                    audio.seFunc(audio.enum);
                    obj.reload=180;
                    obj.tamaflag=20;
                }

        //スプライト設定
                if(!obj.swimflag)    
                {
                switch(obj.anim)
                {
                    case ANIME_STAND:
                    obj.snum=0;
                    break;
                    case ANIME_WALK:
                    obj.snum=1 +((obj.acou/8)&2);
                    break;
                    case ANIME_JUMP:
                    obj.snum=4;
                    break;
                }
                }
                else
                {
                switch(obj.anim)
                {
                    case ANIME_STAND:
                    obj.snum=7;
                    break;
                    case ANIME_WALK:
                    obj.snum=5 +((obj.acou>>4)&3);
                    break;
                    case ANIME_JUMP:
                    obj.snum=5 +((obj.acou>>4)&3);
                    break;
                }
                }
                if(obj.dirc)obj.snum+=11;
            
                if(obj.tamaflag){//射撃モーション
                    if(!obj.swimflag&&obj.dirc)obj.snum=21;
                    if(!obj.swimflag&&!obj.dirc)obj.snum=10;
                    if(obj.swimflag&&obj.dirc)obj.snum=106;
                    if(obj.swimflag&&!obj.dirc)obj.snum=105;
                }
                

                //当たり半径
                obj.r=8
                obj.w=15;
                obj.h=27;
                //フラグ初期化
                obj.flag1=0;
                obj.flag2=0;

    }

    //
    //
    function playerMove01(obj){//pスライムの動き
        //ジャンプ処理
        if(keyb.ABUTTON)
            {
                if(obj.jump==0)
                {
                    obj.anim=ANIME_JUMP;
                    obj.jump=1;
                }
                if(obj.jump<15)obj.vy=-(32-obj.jump);
            }
            if(obj.jump)obj.jump++;
        
        //歩き処理
   function updateWalkSub(obj,dir)
   {
       if(dir==0&&obj.vx<16)obj.vx++;
       if(dir==1&&obj.vx>-16)obj.vx--;

       if(!obj.jump)
       {
           if(obj.anim==ANIME_STAND)obj.acou=0;
           obj.anim=ANIME_WALK;
           obj.dirc=dir;
       }
    }
    if(keyb.Left){
        updateWalkSub(obj,1);
    }else if(keyb.Right){
        updateWalkSub(obj,0);
    }else{
        if(!obj.jump)
        {
            if(obj.vx>0)obj.vx-=1;
            if(obj.vx<0)obj.vx+=1;
            if(obj.flag1||obj.flag2)obj.vy=0;
            if(!obj.vx)obj.anim=ANIME_STAND;
        }
    }

    ///近接攻撃処理
    if(keyb.CBUTTON&&!obj.reload)
        {
            let gx=obj.dirc==0?(24<<4):(-24<<4);
            playerattack.push(new PlayerAttack(obj.x+gx,obj.y,obj.dirc,3));
            obj.reload=30;
            obj.tamaflag=20;
        }

    //スプライトの処理
            obj.snum=24;
            if(obj.dirc)obj.snum+=1
            obj.r=5;
            obj.w=sprite[obj.snum].w;
            obj.h=sprite[obj.snum].h;
    }

    //
    //
    function playerMove02(obj){//pトカゲの動き
        //ジャンプ処理
            if(!obj.flag1&&!obj.flag2){
                if(!obj.swimflag)
                {
                    if(keyb.ABUTTON)
                    {
                        if(obj.jump==0)
                        {
                            obj.anim=ANIME_JUMP;
                            obj.jump=1;
                        }
                        if(obj.jump<15)obj.vy=-(64-obj.jump);
                    }
                    if(obj.jump)obj.jump++;
                }
                else
                {
                    if(keyb.ABUTTON)obj.vy=-16;
                    obj.jump=0;
                }
            }
            else{ //壁から離れる
                if(keyb.ABUTTON){
                    if(obj.flag1){
                        obj.vx=-32;
                        obj.flag1=0;
                        obj.dirc=1;
                    }
                    else{
                        obj.vx=32;
                        obj.flag2=0;
                        obj.dirc=0;
                    }
                }
            }

            //歩き処理
            function updateWalkSub(obj,dir)
            {
        if(!obj.flag1&&!obj.flag2){
            if(dir==0&&!obj.swimflag)obj.vx=16;
            if(dir==1&&!obj.swimflag)obj.vx=-16;
            if(dir==0&&obj.swimflag)obj.vx=8;
            if(dir==1&&obj.swimflag)obj.vx=-8;
        }
        else{
            if(dir==0&&obj.flag1)obj.vy=-8;
            if(dir==1&&obj.flag1)obj.vy=8;
            if(dir==0&&obj.flag2)obj.vy=8;
            if(dir==1&&obj.flag2)obj.vy=-8;
        }

       if(!obj.jump)
       {
           if(obj.anim==ANIME_STAND)obj.acou=0;
           obj.anim=ANIME_WALK;
           obj.dirc=dir;
       }
            }

            if(keyb.Left){
                updateWalkSub(obj,1);
            }else if(keyb.Right){
                updateWalkSub(obj,0);
            }else{
                if(!obj.jump)
                {
                    if(obj.vx>0)obj.vx-=1;
                    if(obj.vx<0)obj.vx+=1;
                    if(obj.flag1||obj.flag2)obj.vy=0;
                    if(!obj.vx)obj.anim=ANIME_STAND;
                }
            }
        //壁の摩擦力
        if(obj.flag1||obj.flag2){
            obj.vy-=GRAVITY;
            if(obj.swimflag)obj.vy+=3;
        }

    ///近接攻撃処理
    if(keyb.CBUTTON&&!obj.reload&&!obj.flag1&&!obj.flag2)
        {
            let gx=obj.dirc==0?(24<<4):(-24<<4);
            playerattack.push(new PlayerAttack(obj.x+gx,obj.y,obj.dirc,2));
            obj.reload=30;
            obj.tamaflag=20;
        }

        //スプライトの処理
            if(!obj.swimflag)    
                {
                switch(obj.anim)
                {
                    case ANIME_STAND:
                    obj.snum=26;
                    break;
                    case ANIME_WALK:
                    obj.snum=26 +((obj.acou/8)&2);
                    break;
                    case ANIME_JUMP:
                    obj.snum=29;
                    break;
                }
                }
                else
                {
                switch(obj.anim)
                {
                    case ANIME_STAND:
                    obj.snum=30;
                    break;
                    case ANIME_WALK:
                    obj.snum=30 +((obj.acou>>4)&2);
                    break;
                    case ANIME_JUMP:
                    obj.snum=30 +((obj.acou>>4)&2);
                    break;
                }
                }

            if(obj.dirc)obj.snum+=7
            obj.r=7;
            obj.w=sprite[obj.snum].w;
            obj.h=sprite[obj.snum].h;


            //くっつき判定
            let lx=((obj.x+obj.vx)>>4);
            let ly=((obj.y+obj.vy)>>4);
    
            //トカゲ右側のチェック
            if(field.isBlock(lx+(obj.w>>1)+(obj.flag1<<4),ly)==1)
            {
                obj.vx=0;
                obj.flag1=1;
                obj.angle=270;
                obj.jump=0;

            }
            else 
            //トカゲ左側のチェック
            if(field.isBlock(lx-(obj.w>>1)-(obj.flag2<<4),ly)==1)
            {
                //if(!obj.flag2)obj.x=((((lx-(obj.w>>1))>>4)<<4)+16+(obj.w>>1))<<4;
                obj.vx=0;
                obj.flag2=1;
                obj.angle=90;
                obj.jump=0;
            }
            else{
                obj.flag1=0;
                obj.flag2=0;
            }


    }

    function playerDraw02(obj){//pトカゲの描写
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
        let gx=obj.flag1==true?((sw-sh)>>1):-((sw-sh)>>1);
        let gy=((sw-sh)>>1)
        vcon.drawImage(chImg,sx,sy,sw,sh,
            -(sw>>1)/*+gx*/,-(sh>>1)+gy,sw,sh);
       }
       else vcon.drawImage(chImg,sx,sy,sw,sh,
                     x,y,sw,sh);
        obj.angle=0;
       vcon.restore();

       vcon.fillStyle="white";
       vcon.fillRect(px,py,2,2);
    }

    //
    //
    function playerMove03(obj){//pコウモリの動き
        //上昇処理
        obj.vy-=3;//滑空力
        if(obj.flag1>0)obj.flag1--;

        if(keyb.ABUTTON){
            if(!obj.flag1)obj.vy=-16;
            if(obj.chc){
                if(!obj.flag1){
                    obj.vy=20;
                    obj.chc=false;
                }
                obj.flag1=20;
            }
            else if(obj.chf){
                obj.vy=-40;
                obj.chf=false;
            }
        }
        
        //横移動処理
   function updateWalkSub(obj,dir){
    if(obj.chc||obj.chf)return;//床、天井にいる時動かない
    if(dir==0&&obj.vx<16)obj.vx++;
    if(dir==1&&obj.vx>-16)obj.vx--;
    obj.anim=ANIME_WALK;
    obj.dirc=dir;
    }

    if(keyb.Left){
        updateWalkSub(obj,1);
    }else if(keyb.Right){
        updateWalkSub(obj,0);
    }else{
            if(obj.vx>0)obj.vx-=1;
            if(obj.vx<0)obj.vx+=1;}

        ///近接攻撃処理
        if(keyb.CBUTTON&&!obj.reload)
            {
                let gx=obj.dirc==0?(24<<4):(-24<<4);
                playerattack.push(new PlayerAttack(obj.x+gx,obj.y,obj.dirc,1));
                obj.reload=30;
                obj.tamaflag=20;
            }


        //スプライトの処理
        obj.snum=41 +((obj.acou/8)&1);
        if(obj.dirc)obj.snum+=3;

        //その他
        if(obj.chf){
            obj.vx=0;
            obj.snum=40;
        }
        else if(obj.chc){
            obj.vx=0;
            obj.snum=40;
            obj.angle=180;
            obj.vy-=1;
        }

        obj.r=7;
        obj.w=sprite[obj.snum].w;
        obj.h=sprite[obj.snum].h;
    }
    function playerDraw03(obj){//pコウモリの描写
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


    function playerMove04(obj){//pタツノウチオトシゴの動き
       //ジャンプ処理
       if(!obj.swimflag)
        {
           if(keyb.ABUTTON)
           {
               if(obj.jump==0)
               {
                   obj.anim=ANIME_JUMP;
                   obj.jump=1;
               }
               if(obj.jump<15)obj.vy=-(48-obj.jump);
           }
           if(obj.jump)obj.jump++;
        }
        else
        {
            if(keyb.ABUTTON)
            {
                   obj.vy=-16;
            }
            obj.jump=0;
        }
        
          //歩き処理
          function updateWalkSub(obj,dir)
          {
              if(dir==0)obj.vx=16;
              if(dir==1)obj.vx=-16;
              if(!obj.jump)
              {
                  obj.anim=ANIME_WALK;
                  obj.dirc=dir;
              }
           }

    if(keyb.Left){
        updateWalkSub(obj,1);
    }else if(keyb.Right){
        updateWalkSub(obj,0);
    }else{
        if(!obj.jump)
        {
            if(obj.vx>0)obj.vx-=1;
            if(obj.vx<0)obj.vx+=1;
            if(obj.flag1||obj.flag2)obj.vy=0;
            if(!obj.vx)obj.anim=ANIME_STAND;
        }
    }

    ///攻撃処理
    if(keyb.CBUTTON&&!obj.reload)
        {
            let gx=obj.dirc==0?(4<<4):(-4<<4);
            playerattack.push(new PlayerAttack(obj.x+gx,obj.y-(5<<4),obj.dirc,5));
            obj.reload=30;
            obj.tamaflag=20;
        }

    //スプライトの処理
    switch(obj.anim)
    {
        case ANIME_STAND:
        obj.snum=47;
        break;
        case ANIME_WALK:
        obj.snum=47 +((obj.acou>>4)&1);
        break;
        case ANIME_JUMP:
        obj.snum=47;
        break;
    }
            if(obj.dirc)obj.snum+=2
            obj.r=5;
            obj.w=sprite[obj.snum].w;
            obj.h=sprite[obj.snum].h;
    }



    function playerMove05(obj){//pトゲネズミの動き
        //水中で強制解除
        if(obj.swimflag)
        {
                obj.type=0;
                obj.mhp=100;
                obj.hp=obj.prehp;
                obj.reload=120;
                return;
        }

        //衝突判定
        if(obj.flag1&&obj.vx==0)obj.flag2=1;

        //転がり判定
        if(Math.abs(obj.vx)>20){
            if(obj.flag1==0)playerattack.push(new PlayerAttack(obj.x,obj.y,obj.dirc,6));
            obj.flag1=true;
            obj.guard=true;
        }
        else{
             obj.flag1=false;
             obj.guard=false;
        }
        
        //ジャンプ処理
        if(keyb.ABUTTON)
            {
                if(obj.jump==0)
                {
                    obj.anim=ANIME_JUMP;
                    obj.jump=1;
                }
                if(obj.jump<8&&!obj.flag1)obj.vy=-(32-obj.jump);
                if(obj.jump<16&&obj.flag1)obj.vy=-(48-obj.jump);
            }
            if(obj.jump)obj.jump++;
    
        //歩き処理
        function updateWalkSub(obj,dir)
        {
            if(dir==0&&obj.vx<28)obj.vx++;
            if(dir==1&&obj.vx>-28)obj.vx--;    
            if(!obj.jump)
            {
                if(obj.anim==ANIME_STAND)obj.acou=0;
                obj.anim=ANIME_WALK;
                obj.dirc=dir;
            }
         }
    
            if(keyb.Left){
                updateWalkSub(obj,1);
            }else if(keyb.Right){
                updateWalkSub(obj,0);
            }else{
                if(!obj.jump)
                {
                    if(obj.vx>0)obj.vx-=1;
                    if(obj.vx<0)obj.vx+=1;
                    if(!obj.vx)obj.anim=ANIME_STAND;
                }
            }

            if(obj.flag2){
                obj.vx=0;
                if(obj.flag2++>60)obj.flag2=0;
            }
    
            //スプライト設定
            if(!obj.swimflag)    
            {
                switch(obj.anim)
                {
                        case ANIME_STAND:
                        obj.snum=88;
                        break;
                        case ANIME_WALK:
                        obj.snum=88 +((obj.acou>>3)&1);
                        break;
                        case ANIME_JUMP:
                        obj.snum=88;
                        break;
                }
            }
                
            if(obj.dirc)obj.snum-=2;
            if(obj.flag1){
               
                if(obj.vx)obj.snum=90+((obj.acou>>3)&3)
                else obj.snum=93-((obj.acou>>3)&3)
            }
            else if(obj.flag2){//ひっくり返る
                if(obj.dirc)obj.snum=94 +((obj.acou>>3)&1);
                else obj.snum=96 +((obj.acou>>3)&1);
            }
                
            //当たり半径
            obj.r=5;
            obj.w=sprite[obj.snum].w;
            obj.h=sprite[obj.snum].h;
    }


    function playerMove06(obj){//カヤクコロガシ
        //ジャンプ処理
               if(keyb.ABUTTON&&obj.flag1<(60<<2))
               {
                   if(obj.jump==0)
                   {
                       obj.anim=ANIME_JUMP;
                       obj.jump=1;
                   }
                   if(obj.jump<15)obj.vy=-(32-obj.jump);
               }
               if(obj.jump)obj.jump++;
    
            //歩き処理
        function updateWalkSub(obj,dir)
        {
            if(dir==0&&obj.vx<8)obj.vx++;
            if(dir==1&&obj.vx>-8)obj.vx--;
            obj.flag1++;
            if(!obj.jump)
            {
                if(obj.anim==ANIME_STAND)obj.acou=0;
                obj.anim=ANIME_WALK;
                obj.dirc=dir;
            }
         }
    
            if(keyb.Left){
                updateWalkSub(obj,1);
            }else if(keyb.Right){
                updateWalkSub(obj,0);
            }else{
                if(!obj.jump)
                {
                    if(obj.vx>0)obj.vx-=1;
                    if(obj.vx<0)obj.vx+=1;
                    if(!obj.vx)obj.anim=ANIME_STAND;
                }
            }
            //弾処理
            if(keyb.CBUTTON&&obj.flag1>(60<<2))
            {
                playerattack.push(new PlayerAttack(obj.x,obj.y,obj.dirc,7));
                obj.flag1=0;
            }

                    
            //スプライト設定
            switch(obj.anim)
            {
                        case ANIME_STAND:
                        obj.snum=53;
                        break;
                        case ANIME_WALK:
                        obj.snum=53+((obj.acou>>5)&1);
                        break;
                        case ANIME_JUMP:
                        obj.snum=53;
                        break;
            }
  
            if(obj.flag1>(60<<2)){
                if(obj.anim==ANIME_WALK)obj.snum=51+((obj.acou>>5)&1);
                else obj.snum=51;
            }
            if(obj.dirc)obj.snum+=4;
            obj.w=sprite[obj.snum].w;
            obj.h=sprite[obj.snum].h;
    }

    let playerFunc=[
        playerMove00,
        playerMove01,
        playerMove02,
        playerMove03,
        playerMove04,
        playerMove05,
        playerMove06,
      ];
