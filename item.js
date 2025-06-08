//
//アイテム,
//
class Item
{
    constructor(bl,x,y,type)
    {
        this.ox=x;
        this.oy=y;
        //ピクセル単位からさらに４ビットずらす
        this.x=x<<8;
        this.y=y<<8;
        this.bl=bl;
        this.type=type; //１でコレクションアイテム
        this.kill=false;
        this.count=0;
        this.drawflag=false;
        fieldData[y*FIELD_SIZE_W+x]=-1;
        inventory.cancelflag=50;
        if(this.type==undefined)inventory.array.push(inventoryFunc(this.bl));
        if(this.ox!==undefined)this.state=1;
        else this.state=0;
    }

    update()
    {
        if((gameOver||film.end)&&film.cou<2)fieldData[this.oy*FIELD_SIZE_W+this.ox]=this.bl;
        if(this.drawflag)return;
        this.count++;
        if(this.count<15)this.y-=70;
        //if(this.x==undefined)this.drawflag=true; //保存したアイテムは最初から取得時の描画はしない
        if(this.count>49){
            this.drawflag=true; //描画だけ終了
            if(this.bl==63)this.kill=true;
        }
        
    }

    draw()
    {
        
        if(this.drawflag)return;
        //getDraw(this.x>>4,this.y>>4,this.bl)

            let px=(this.x>>4)-field.scx;
            let py=(this.y>>4)-field.scy;
            field.drawBlock(this.bl,px,py);
            vcon.fillStyle="#FFF";
            vcon.fillText("+1",px,py-10);
    }
}
