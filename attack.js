//
//攻撃モーション
//

//プレイヤー攻撃処理

class PlayerAttack
{
    constructor(x,y,dirc,type)
    {
        this.x=x;
        this.y=y;
        this.dirc=dirc;
        this.vx=attackrMaster[type].vx;
        this.vy=attackrMaster[type].vy;
        this.ovy=this.vy;
        this.r=attackrMaster[type].r;
        this.type=attackrMaster[type].type;
        this.snum=attackrMaster[type].snum;
        this.atk=attackrMaster[type].atk;
        this.kill=false;
        this.acou=0;
        this.w=0;
        this.h=0;
    }

    //障害物の判定
    checkBarrier()
    {
        if(!this.vx)return;
        let lx=((this.x)>>4);
        let ly=((this.y)>>4);
        if(field.isBlock(lx,ly-this.h/2)==1||
        field.isBlock(lx+this.w/2,ly)==1||
        field.isBlock(lx-this.w/2,ly)==1)
            {
                this.kill=true;
                if(this.type==7)playerattack.push(new PlayerAttack(this.x,this.y,this.dirc,8));
            }
    }        

        //床の判定
        checkFloor()
        {
            let lx=((this.x+this.vx)>>4);
            let ly=((this.y+this.vy)>>4);
            if(field.isBlock(lx,ly+(this.h>>1))==1&&this.vy>32)
            {
                playerattack.push(new PlayerAttack(this.x,this.y,this.dirc,8));
                this.kill=true;
                return;
                //this.vy=0;
                //this.y=((((ly+(this.h>>1))>>4)<<4)-(this.h>>1))<<4;
            }
        }

    update()
    {
        if(cancelflag)return;
        if(this.kill)return;
        this.w=sprite[this.snum].w;
        this.h=sprite[this.snum].h;
        if(this.x<field.scx<<4 || this.x>(field.scx+SCREEN_SIZE_W)<<4||
        this.y<field.scy<<4 || this.y>(field.scy+SCREEN_SIZE_H)<<4)this.kill =true;

        if(!this.vx&&this.type!==6){//近接攻撃の処理
            /*if(this.dirc==0&&this.acou==0){
            }*/
            if(this.dirc==1&&this.acou==0&&this.type!==2){
                this.snum+=3;
            }
            if(this.acou<6)this.snum+=(this.acou>>2)
            if(this.acou>16)this.kill=true;
        }
        

        for(let i=0; i<monster.length;i++)
        {//当たり判定
            if(!monster[i].remove&&checkHit(!monster[i].muteki&&
                this.x, this.y, this.r,
                monster[i].x, monster[i].y, monster[i].r
            ))
            {
                if(this.type==0)//ヒョーイ
                {
                    this.kill=true;
                    if(monster[i].link)return; //link０以外でヒョーイキャンセル
                    monster[i].remove=true;
                    player.x=monster[i].x;
                    player.y=monster[i].y;
                    player.newtype=monster[i].tnum+1;
                    player.newhp=monster[i].hp;
                    player.trans=60;
                    audio.enum=9;
                    audio.seFunc(audio.enum);
                }
                else{
                    audio.enum=3;
                    audio.seFunc(audio.enum);
                    if((monster[i].hp-=this.atk)<=0){
                        monster[i].remove=true;
                        if(monster[i].tnum=6)talkphaselist[0]=3;
                    }
                    else{
                        monster[i].muteki=30;
                    }
                }
                break;
            }
        }

        this.acou++;
        //重力
        if(this.vx&&this.ovy&&this.vy<64)this.vy+=GRAVITY;
        if(this.type==7){
            this.checkFloor();
            this.snum=100+((this.acou>>4)&1)
            if(this.acou<2){
                if(Math.abs(player.vx)>6)this.vx=32;
                else this.vx=16;
            }
        }
        this.checkBarrier();

        
        if(this.dirc==0)this.x+=this.vx;
        else this.x-=this.vx;
        this.y+=this.vy;
        if(this.type==0&&this.dirc)this.snum=128;
        if(this.type==6){//転がり判定
            this.x=player.x;
            this.y=player.y;
            this.snum=98+((this.acou>>4)&1);
            if(!player.flag1)this.kill=true;
        }
    }

    draw()
    {
        let px=(this.x>>4)-field.scx;
        let py=(this.y>>4)-field.scy;
        drawsprite(this.snum,px,py);
    }
}



//モンスター攻撃処理
class MonsterAttack
{
    constructor(x,y,dirc,type)
    {
        this.x=x;
        this.y=y;
        this.dirc=dirc;
        this.vx=attackrMaster[type].vx;
        this.vy=attackrMaster[type].vy;
        this.ovy=this.vy;
        this.r=attackrMaster[type].r;
        this.type=attackrMaster[type].type;
        this.snum=attackrMaster[type].snum;
        this.atk=attackrMaster[type].atk;
        this.kill=false;
        this.acou=0;
        this.w=0;
        this.h=0;
    }

    //障害物の判定
    checkBarrier()
    {
        if(!this.vx&&this.type!==11)return;  //速度を持った攻撃のみ判定する
        let lx=this.x>>4;
        let ly=this.y>>4;
        if(field.isBlock(lx,ly-this.h/2)==1||
           field.isBlock(lx+this.w/2,ly)==1||
           field.isBlock(lx-this.w/2,ly)==1)
            {
                this.kill=true;
                if(this.type==7)monsterattack.push(new MonsterAttack(this.x,this.y,this.dirc,8));
            }
    }        

    //床の判定
    checkFloor()
    {
        let lx=((this.x+this.vx)>>4);
        let ly=((this.y+this.vy)>>4);
        if(field.isBlock(lx,ly+(this.h>>1))==1)
        {
            if(this.vy>32){
                monsterattack.push(new MonsterAttack(this.x,this.y,this.dirc,8));
                this.kill=true;
                return;
            }
            this.vy=0;
            this.y=((((ly+(this.h>>1))>>4)<<4)-(this.h>>1))<<4;
        }
    }

    update()
    {
        if(cancelflag)return;
        this.w=sprite[this.snum].w;
        this.h=sprite[this.snum].h;
        this.acou++;
        if(this.x<field.scx<<4 || this.x>(field.scx+SCREEN_SIZE_W)<<4||
        this.y<field.scy<<4 || this.y>(field.scy+SCREEN_SIZE_H)<<4)this.kill =true;

        if(!this.vx&&this.type!==11){
            if(this.dirc==0&&this.acou==0){
                this.x+=(24<<4);
            }
            if(this.dirc==1&&this.acou==0){
                this.x-=(24<<4);
                if(!this.type==2)this.snum+=3;
            }
            if(this.acou<6)this.snum+=(this.acou>>2)
            if(this.acou>16)this.kill=true;
        }

            if(checkHit(!gameOver && !player.muteki && 
                this.x, this.y, this.r,
                player.x, player.y, player.r
            ))
            {
                if(this.vx){
                    this.kill=true;
                    if(this.type==7){
                        monsterattack.push(new MonsterAttack(this.x,this.y,this.dirc,8));
                    }
                }
                playerDamage(this.atk);
            }

      
        //重力
        if(/*this.vx&&*/this.ovy&&this.vy<64)this.vy+=GRAVITY;
        if(this.type==7){
            this.checkFloor();
            this.snum=100+((this.acou>>4)&1)
            if(this.acou<2)this.vx=Math.abs(player.x-this.x)/60;
        }
        this.checkBarrier();
        
        if(this.dirc==0)this.x+=this.vx;
        else this.x-=this.vx;
        this.y+=this.vy;
    }

    draw()
    {
        let px=(this.x>>4)-field.scx;
        let py=(this.y>>4)-field.scy;
        drawsprite(this.snum,px,py);
    }
