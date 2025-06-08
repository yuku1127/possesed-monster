class Inventory{
    constructor(){
        this.array=[];
        this.menuflag=false;
        this.cou=0;
        this.collect1=0;
        this.collect2=0;
        this.collect3=0;
        this.collectlist=[];
        this.cancelflag=false;
        this.cursor=0;
        this.full=false;
    }
    //アイテム選択
    itemSelect(){
        //右ボタンで下に移動
        if(keyb.Right&&this.cou>16){
            if(this.cursor<this.array.length-1)this.cursor++;
            else this.cursor=0;
            this.cou=2;
            audio.enum=4;
            audio.seFunc(audio.enum);
        }
        //左ボタンで上に移動
        if(keyb.Left&&this.cou>16){
            if(this.cursor>0)this.cursor--;
            else this.cursor=this.array.length-1;
            this.cou=2;
            audio.enum=4;
            audio.seFunc(audio.enum);
            }
    }

    //アイテム使用
    itemUse(){
        if(keyb.ABUTTON&&this.array.length){
            useFunc(this);
        }
    }


    update(){
        if(this.cancelflag)this.cancelflag--; //cancelflag=0でインベントリを開けるようにする
        this.cou++;
        if(this.cou==1)this.cursor=0; //カーソル位置を戻す
        if(this.array.length==5)this.full=true; //アイテム上限数５
        else this.full=false;
        if(!this.menuflag)return;
        this.itemSelect();
        this.itemUse();
     
    }
    draw(){
        


        if(this.menuflag){
            vcon.fillStyle="#734e30";
            vcon.fillRect(5,30,SCREEN_SIZE_W/2,SCREEN_SIZE_H/2);
            vcon.strokeStyle ="white";
            vcon.strokeRect(5,30,SCREEN_SIZE_W/2,SCREEN_SIZE_H/2);
            vcon.fillStyle="#FFF";
            vcon.fillText("持っているもの",10,45);

            if(this.array.length){
                for(let i=0;i<this.array.length;i++){
                    field.drawBlock(this.array[i].bl,100,55+(i*15));
                    vcon.fillText(this.array[i].text,30,70+(i*15));
                    if(this.cursor==i)vcon.fillRect(20,62+(i*15),5,5);
                }
            }

            field.drawBlock(38,SCREEN_SIZE_H,3);
            vcon.fillText("×"+this.collect1,SCREEN_SIZE_H+16,15);
            field.drawBlock(39,SCREEN_SIZE_H,18);
            vcon.fillText("×"+this.collect2,SCREEN_SIZE_H+16,30);
            field.drawBlock(63,SCREEN_SIZE_H,33);
            vcon.fillText("×"+this.collect3,SCREEN_SIZE_H+16,45);

            if(talkphaselist[0]==1)vcon.fillText(textdata[16],10,185);//ヘルプの追加
            if(this.array[this.cursor]!==undefined)vcon.fillText("spaceで使用",10,160);
            vcon.fillText("D:攻撃",SCREEN_SIZE_H-80,85);
            vcon.fillText("A:ヒョーイ/解除",SCREEN_SIZE_H-80,100);
            vcon.fillText("W:インベントリ",SCREEN_SIZE_H-80,115);
            vcon.fillText("Space:ジャンプ",SCREEN_SIZE_H-80,130);
        }
    }
}

function useFunc(obj){
    if(obj.array[obj.cursor]==undefined)return//
    switch(obj.array[obj.cursor].type)
    {
        case 0:
        if(player.type&&player.hp<player.mhp){
            player.hp=player.mhp;
            obj.array.splice(obj.cursor,1);
            audio.enum=5;
            audio.seFunc(audio.enum);
        }
        break;
        case 1:
        if(player.type==0&&player.hp<player.mhp){
            player.hp=player.mhp;
            obj.array.splice(obj.cursor,1);
            audio.enum=5;
            audio.seFunc(audio.enum);
        }
        break;
    }
}
