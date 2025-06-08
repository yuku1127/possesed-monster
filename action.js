//
//特殊な演出 話す,開ける,壊すなどのブロック
//

class Action {
    constructor(bl,x,y)
    {
        this.ox=x;
        this.oy=y;
        this.bl=bl;
        this.x=x<<8;
        this.y=y<<8;
        this.flag=false;
        this.drawflag=false;
        this.kill=false;
        this.remove=false;
        if(this.bl==61||this.bl==62||this.bl==78)fieldData[y*FIELD_SIZE_W+x]=21;//透明な当たり判定
        else fieldData[y*FIELD_SIZE_W+x]=-1;
        this.cou=0;
        this.state=0;//１で破壊未セーブ、0でセーブの必要なし
    }


    update()
    {
        if((gameOver||film.end)&&film.cou<2){
            fieldData[this.oy*FIELD_SIZE_W+this.ox]=this.bl;
            if(this.bl==78)fieldData[(this.oy-1)*FIELD_SIZE_W+this.ox]=62;
        }
        if(this.remove)return;
        this.cou++;
        actionFunc(this); 
    }
    
    draw()
    {
        if(gameOver||film.end)return;
        if(this.remove)return;

        let px=(this.x>>4)-field.scx;
        let py=(this.y>>4)-field.scy;
 
        field.drawBlock(this.bl,px,py);
        if(this.bl==49&&this.flag){
            if(this.flag--){
                vcon.fillStyle="#FFF";
                vcon.fillText("セーブしました",SCREEN_SIZE_W/3,SCREEN_SIZE_H/2);
            }
        }
        if(this.drawflag){
            if(massage.length)return;
            vcon.fillStyle="#FFF";
            if(this.bl==49&&!this.flag)vcon.fillText("「W」でセーブ",SCREEN_SIZE_W/3+15,SCREEN_SIZE_H/2);
            if(this.bl==60)vcon.fillText("「W」で話す",SCREEN_SIZE_W/3+20,SCREEN_SIZE_H/2-20);
            if(this.bl==61)vcon.fillText("強い衝撃を与えれば壊せそうだ",SCREEN_SIZE_W/3-30,SCREEN_SIZE_H/2);
            if(this.bl==78)vcon.fillText("鍵穴がある",SCREEN_SIZE_W/3+20,SCREEN_SIZE_H/2);
        }
    }
}

function actionFunc(obj){
    switch(obj.bl)
    {
        case 60: 
        actionFunc00(obj); //ワプナ
        break;
        case 49:
        actionFunc01(obj); //テント
        break;
        case 61: 
        actionFunc02(obj); //岩
        break;
        case 62:
        actionFunc03(obj); //扉
        break;
        case 78:
        actionFunc03(obj); //扉2
        break;
    }
}



function actionFunc00(obj){//ワプナ
    let cx=obj.x+(8<<4)
    let cy=obj.y+(8<<4)
    if(checkHit(cx,cy,36,player.x,player.y,player.r)&&
        !checkHit(cx,cy,8,player.x,player.y,player.r))
    {
        obj.drawflag=true;
        inventory.cancelflag=10;
        if(massage.length)return;
        if(keyb.DBUTTON){
            if(talkphaselist[0]==0&&player.vx==0){
                massage.push(new Massage(0,9));
                cancelflag=true;
                talkphaselist[0]++;
            }
            else if(talkphaselist[0]==1&&player.vx==0&&
                    inventory.collect1&&inventory.collect2)
            {
                massage.push(new Massage(10,2));
                cancelflag=true;
                talkphaselist[0]++;
            }
            else if(talkphaselist[0]==2&&player.vx==0){
                audio.enum=0;
                audio.seFunc(audio.enum);
                item.push(new Item(63,player.x>>8,player.y>>8,1));
                inventory.collect3++;
                inventory.collect1--;
                inventory.collect2--;
                talkphaselist[0]=undefined;
            }
            else if(talkphaselist[0]==3&&player.vx==0){
                massage.push(new Massage(13,2));
                cancelflag=true;
                talkphaselist[0]++;
            }
            else if(talkphaselist[0]==4){//エンディング
                film.end=true;
                talkphaselist[0]++;
            }
        }
    }
    else obj.drawflag=false;
}
function actionFunc01(obj){//テント
    let cx=obj.x+(16<<4)
    let cy=obj.y
    if(checkHit(cx,cy,18,player.x,player.y,player.r))
    {
        obj.drawflag=true;
        inventory.cancelflag=10; //メニューを開かせない
        if(keyb.DBUTTON){
            player.hp=player.mhp;
            obj.cou=0;
            obj.flag=120;

            //データセーブ
            for(let i=0;i<inventory.array.length;i++){
                itemdatalist.push(inventory.array[i].bl)//
            }
            for(let i=0;i<item.length;i++){
                if(item[i].state==1){//新規のアイテム位置を保存
                    itemlocationlist.push([item[i].ox,item[i].oy,item[i].bl]);
                    item[i].state=0;
                }
            }

            //
            for(let i=0;i<action.length;i++){
                if(action[i].state==1){//新規破壊済みアクションマス位置を保存
                    actionlocationlist.push([action[i].ox,action[i].oy,action[i].bl]);
                    if(action[i].bl==78)actionlocationlist.push([action[i].ox,(action[i].oy-1),62]);//扉上のマス
                    action[i].state=0;
                }
            }

            inventory.collectlist=[inventory.collect1,inventory.collect2,inventory.collect3]
            

            user_data={
                player_x:player.x,
                player_y:player.y,
                player_hp:player.hp,
                player_prehp:player.prehp,
                player_type:player.type,
                item_datalist:itemdatalist,
                item_locationlist:itemlocationlist,
                item_collectionlist:inventory.collectlist,
                action_talkphase:talkphaselist,
                action_locationlist:actionlocationlist,
            };
            storage.data=user_data;
            storage.save();
            
            itemdatalist.splice(0,itemdatalist.length);
            //itemlocationlist.splice(0,itemlocationlist.length);
          
        }
    }
    else obj.drawflag=false;
}

function actionFunc02(obj){//岩
    let cx=obj.x+(8<<4)
    let cy=obj.y+(8<<4)
    if(checkHit(cx,cy,13,player.x,player.y,player.r))
    {
        obj.drawflag=true;
        if(player.type==5&&player.flag1){//トゲネズミ回転で破壊
        fieldData[obj.oy*FIELD_SIZE_W+obj.ox]=-1;
        obj.remove=true;
        audio.enum=6;
        audio.seFunc(audio.enum);
        }
    }else obj.drawflag=false;
    if(!playerattack.length)return;
    for(let i=0;i<playerattack.length;i++){//ツチカヤクで破壊
        let at=playerattack[i];
        if(at.type==8&&checkHit(cx,cy,13,at.x,at.y,at.r)){
            fieldData[obj.oy*FIELD_SIZE_W+obj.ox]=-1;
            obj.remove=true;
            audio.enum=6;
            audio.seFunc(audio.enum);
        }
    }
}

function actionFunc03(obj){//扉
    let cx=obj.x+(8<<4)
    let cy=obj.y+(8<<4)
    if(checkHit(cx,cy,13,player.x,player.y,player.r))
    {
        obj.drawflag=true;
        if(inventory.collect3){
        obj.state=1;
        fieldData[obj.oy*FIELD_SIZE_W+obj.ox]=-1;
        fieldData[(obj.oy-1)*FIELD_SIZE_W+obj.ox]=-1;
        obj.remove=true;
        audio.enum=6;
        audio.seFunc(audio.enum);
        inventory.collect3--;
        }
    }else obj.drawflag=false;
}
