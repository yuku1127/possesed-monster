//動きのある背景、煙、火の玉など

class Anime{
    constructor(bl,x,y,generate)
    {
        this.ox=x;
        this.oy=y;
        //ピクセル単位からさらに４ビットずらす
        this.x=x<<8;
        this.y=bl==47?(y<<8)+(12<<4):y<<8;
        this.num=animedataFunc(bl).num;
        this.vx=animedataFunc(bl).vx;
        this.vy=animedataFunc(bl).vy;
        this.grav=animedataFunc(bl).grav;
        this.backbl=animedataFunc(bl).backbl;
        this.r=animedataFunc(bl).r;
        this.atk=5;
        this.snum=23;
        this.bl=bl;
        this.kill=false;    //クラスを消すフラグ
        this.remove=false;  //描画をやめてクラスは残すフラグ
        this.count=0;
        this.acou=0;
        this.reload=0;
        this.generate=generate;//trueの時はblリスト以外で生成されたクラス
        fieldData[y*FIELD_SIZE_W+x]=this.backbl;
    }

    update(){
        if(this.kill){//アニメーションを消す直前にマスを元のblに戻す
            if(!this.generate)fieldData[this.oy*FIELD_SIZE_W+this.ox]=this.bl;
            return;
        }
        if(cancelflag)return;
        if(this.remove)return;
        if(cancelflag)return;
        if(this.reload)this.reload--;
        this.acou++;
        if(this.vy<64&&this.grav)this.vy+=GRAVITY;
        this.x+=this.vx;
        this.y+=this.vy;
        animemoveFunc(this);

        if(!this.r)return;
        //当たり判定
        let cx=this.x+((sprite[this.snum].w>>1)<<4)
        let cy=this.y+((sprite[this.snum].h>>1)<<4)
        if(!gameOver && !player.muteki && checkHit(cx, cy, this.r,
            player.x, player.y, player.r) )
            {
                playerDamage(this.atk);
            }
    }

    draw(){
        if(this.remove)return;
        if(this.snum==undefined)return;
        let px=(this.x>>4)-field.scx+(sprite[this.snum].w>>1);
        let py=(this.y>>4)-field.scy+(sprite[this.snum].h>>1);
        drawsprite(this.snum,px,py);
    }

}

function animemoveFunc(obj){
    let lx=(obj.x+obj.vx)>>4;
    let ly=(obj.y+obj.vy)>>4;
    let cx=obj.x+((sprite[obj.snum].w>>1)<<4)
    let cy=obj.y+((sprite[obj.snum].h>>1)<<4)
    switch(obj.num)
    {
        case 0: //火の玉
        if((obj.y>>4)>(obj.oy<<4)){
            if(obj.count++<120){
                obj.vy=-4;
            }
            else{
                obj.vy=-100;
            }
        }
        else obj.count=0;
        obj.snum=121;

        break;

        case 1: //煙
        obj.vy-=GRAVITY;
        if(obj.count++>180){
            obj.y=obj.oy<<8
            obj.count=0;
        }
        obj.snum=122;
        break;

        case 2://トゲ岩
        if(field.isBlock(lx,ly+(sprite[obj.snum].h>>1)))obj.remove=true;
        obj.snum=93-((obj.acou>>3)&3)
        break;

        case 3://トゲネズミ
        if(field.isBlock(lx,ly+(sprite[obj.snum].h>>1))){
            obj.remove=true;
            monster.push(new Monster(56,lx>>4,ly>>4,true));
        }
        obj.snum=96;
        break;

        case 4://カヤクコロガシ
        obj.snum=53;
        if(obj.acou>120)obj.remove=true;
        break;

        case 5://とげ
        obj.snum=123;
        break;

        case 6://汚染水
        obj.snum=124;
        if(obj.reload)return;
         if(obj.count<8){
                if((obj.acou&5)==0){
                    monsterattack.push(new MonsterAttack(cx,cy,1,11));
                    obj.count++;
                }
            }
            else{
                obj.reload=180;
                obj.count=0;
            }
        break;

        case 7://ボス戦遮断ブロック
        if(monster.length){
        if(monster[0].remove==false){//ボスのいるマップでは最初のモンスタークラスが必ずゴーレムになる
            fieldData[obj.oy*FIELD_SIZE_W+obj.ox]=21;
            obj.snum=130;
        }
        else{
            fieldData[obj.oy*FIELD_SIZE_W+obj.ox]=-1;
            obj.snum=131;
        }
        }
        else{
            fieldData[obj.oy*FIELD_SIZE_W+obj.ox]=-1;
            obj.snum=131;
        }
        break;
    }
}
