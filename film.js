//
//スタート画面,ゲームオーバー演出,ムービー
//

class Film{
    constructor(){
        this.blackout=0;
        this.cou=0;
        this.end=false;
    }

    update(){
        if(this.blackout)this.blackout--;
        if(gameOver&&this.cou<2){
            cancelflag=true;
            audio.bgmStop(audio.bnum);//前のbgm停止
            audio.bnum=5;
            audio.bgmStart(audio.bnum);
        }

        if(this.end){
            if(this.cou<2){
                cancelflag=true;
                audio.bgmStop(audio.bnum);
            }
            else if(this.cou==120){
                audio.bnum=6;
                audio.bgmStart(audio.bnum);
            }
        }
    }

    gamestart(){//spaceでゲーム開始
        //dataに入れたリストを初期化してゲーム内のリストと区別
        storage.data.action_talkphase=[0];
        storage.data.monster_bosslocationlist=[];

        //データのロード
        storage.load();//保存データがあればstorage.dataに格納
        player.x=storage.data.player_x;
        player.y=storage.data.player_y;
        player.hp=storage.data.player_hp;
        player.prehp=storage.data.player_prehp;
        if(!player.prehp)player.prehp=100;

        player.type=storage.data.player_type;
        if(player.type)player.mhp=monsterMaster[player.type-1].hp;
        else player.mhp=100;

        //所持アイテムのロード
        let itemlist=storage.data.item_datalist;
        for(let i=0;i<itemlist.length;i++){
            item.push(new Item(itemlist[i]));
        }

        //取得済みアイテム位置のロード
        let list=storage.data.item_locationlist;
        for(let i=0;i<list.length;i++){
            fieldData[list[i][1]*FIELD_SIZE_W+list[i][0]]=-1;
        }
        itemlocationlist=list;  //再代入

        //コレクションアイテム数のロード
        let c_list=storage.data.item_collectionlist;
        //inventory.collectlist=c_list;
        if(c_list.length){
        inventory.collect1=c_list[0];
        inventory.collect2=c_list[1];
        inventory.collect3=c_list[2];
        }

        //トークフェイズのロード
        talkphaselist=storage.data.action_talkphase;

        //破壊済みアクションマス位置のロード
        let a_list=storage.data.action_locationlist;
        for(let i=0;i<a_list.length;i++){
            fieldData[a_list[i][1]*FIELD_SIZE_W+a_list[i][0]]=-1;
        }
        actionlocationlist=a_list;  //再代入
        
        //ボスの再生
        list=bosslocationlist;//セーブしてないマスの位置も元のblに戻す
        for(let i=0;i<list.length;i++){
            fieldData[list[i][1]*FIELD_SIZE_W+list[i][0]]=list[i][2];
        }

        //討伐済みボス位置のロード
        let b_list=storage.data.monster_bosslocationlist;
        for(let i=0;i<b_list.length;i++){
            fieldData[b_list[i][1]*FIELD_SIZE_W+b_list[i][0]]=-1;
        }
        bosslocationlist=b_list;  //再代入

        //フロア位置の更新
        field.floar=field.isFloar(player.x,player.y);
        //bgmの再生
        audio.bgmStart(floardata[field.floar].back);
        field.back=floardata[field.floar].back;
        audio.bnum=field.back;
   
        gameStart=true;
        setTimeout(() => {cancelflag=false;},300 );
        
        if(player.acou<2)gameInit();//ウィンドウをロードした時のみゲーム初期化
    }
    
    gamehome(){
        con.fillStyle="black";
        con.fillRect(0,0,can.width,can.height);
    
        con.fillStyle="blue";
        con.font="30px 'DotGothic16'";
        let s='POSSESED MONSTER'
        let w=con.measureText(s).width;
        con.fillText(s,can.width/2-w/2,can.height/2-20);
    
        s="Push 'space' key to start !";
        w=con.measureText(s).width;
        let x=can.width/2 - w/2;
        let y=can.height/2 - 20+40;
        con.fillText(s,x,y);

        s="Shiftキーでデータ消去";
        w=con.measureText(s).width;
        con.fillStyle="white";
        x=can.width/2-w/2;
        y=can.height-10;
        con.fillText(s,x,y);

        for(let i=0;i<monster.length;i++)
            {
                monster[i].kill=true;
            }
        for(let i=0;i<anime.length;i++)
            {
                anime[i].kill=true;
            }
        for(let i=0;i<item.length;i++)
            {
                item[i].kill=true;
            }
        for(let i=0;i<action.length;i++)
            {
                action[i].kill=true;
            }
        inventory.array.splice(0,inventory.array.length);
    }


    draw(){
        if(this.blackout){//移動時に暗転
            vcon.fillStyle="black";
            vcon.fillRect(0,0,SCREEN_SIZE_W,SCREEN_SIZE_H);

        }

        if((60*6)>frameCount&&frameCount>(60*3)){//
            vcon.fillStyle ="white";
                let s="ポーチを開く：W";
                let w=vcon.measureText(s).width;
                let x=SCREEN_SIZE_W/2 - w/2;
                let y=SCREEN_SIZE_H/2 - 20;
                vcon.fillText(s,x,y);
        }
        //hp０でgameover表示
        if(gameOver)
            {
                vcon.fillStyle ="red";
                let s="GAME OVER";
                let w=vcon.measureText(s).width;
                let x=SCREEN_SIZE_W/2 - w/2;
                let y=SCREEN_SIZE_H/2 - 20;
                vcon.fillText(s,x,y);
                s="Push 'R' key to restart !";
                w=vcon.measureText(s).width;
                x=SCREEN_SIZE_W/2 - w/2;
                y=SCREEN_SIZE_H/2 - 20+20;
                vcon.fillText(s,x,y);
                let px=(player.x>>4)-field.scx;
                let py=(player.y>>4)-field.scy;
                drawsprite(107,px,py);
             }
            
            //if(!gameStart)this.gamehome();

        if(this.end){//エンドロール
            let px=(player.x>>4)-field.scx;
            let py=(player.y>>4)-field.scy;
            drawsprite(107,px,py);
            
            if(this.cou>=120){
                vcon.font=" 16px 'DotGothic16'";
                vcon.fillStyle ="green";
                let s="GAME CLEAR!";
                let w=vcon.measureText(s).width;
                let x=SCREEN_SIZE_W/2 - w/2;
                let y=SCREEN_SIZE_H/2 - 20;
                vcon.fillText(s,x,y);
            }

            if((60*14)>this.cou&&this.cou>(60*8)){
                vcon.fillStyle ="white";
                vcon.font=" 12px 'DotGothic16'";
                let s="BGM提供:MOMIZizm MUSiC（もみじば）";
                let w=vcon.measureText(s).width;
                let x=SCREEN_SIZE_W/2 - w/2;
                let y=SCREEN_SIZE_H/2 ;
                vcon.fillText(s,x,y);

                s="SE提供:FC音工場";
                w=vcon.measureText(s).width;
                x=SCREEN_SIZE_W/2 - w/2;
                y=SCREEN_SIZE_H/2 + 20;
                vcon.fillText(s,x,y);

            }
            else if((60*20)>this.cou&&this.cou>(60*14)){
                vcon.fillStyle ="white";
                vcon.font=" 12px 'DotGothic16'";
                let s="企画、構成、イラスト：yuku";
                let w=vcon.measureText(s).width;
                let x=SCREEN_SIZE_W/2 - w/2;
                let y=SCREEN_SIZE_H/2 ;
                vcon.fillText(s,x,y);
            }
            else if(this.cou>(60*20)){
                vcon.fillStyle ="white";
                vcon.font=" 12px 'DotGothic16'";
                let s="Thank you for playing!!";
                let w=vcon.measureText(s).width;
                let x=SCREEN_SIZE_W/2 - w/2;
                let y=SCREEN_SIZE_H/2 ;
                vcon.fillText(s,x,y);
                s="Push 'R' key to restart";
                w=vcon.measureText(s).width;
                x=SCREEN_SIZE_W/2 - w/2;
                y=SCREEN_SIZE_H/2+90 ;
                vcon.fillText(s,x,y);
            }
        }

        }

}
