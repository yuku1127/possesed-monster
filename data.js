//
//データ一覧
//

class IventMaster
{
    constructor(type,r,snum)
    {
        this.type=type;
        this.r=r;
        this.snum=snum;
    }
}

let iventMaster=
[
    new IventMaster(0,48,22),  //0.ワプナ
]


class MonsterMaster
{
	constructor(tnum,r,hp,atk,backbl)
	{
		this.tnum =tnum;
		this.r = r;
		this.hp=hp;
        this.atk=atk;
        this.backbl=backbl;
	}
}

let monsterMaster=
[
	new MonsterMaster(0,5,30,1,-1),        //0.スライム
	new MonsterMaster(1,7,50,5,-1),        // 1.トカゲ
    new MonsterMaster(2,10,50,5,-1),        // 2.コウモリ
    new MonsterMaster(3,10,100,5,26),        // 3.タツノウチオトシゴ
    new MonsterMaster(4,10,50,10,-1),        // 4.トゲネズミ
    new MonsterMaster(5,7,30,1,-1),        // 5.カヤクコロガシ
    new MonsterMaster(6,16,200,20,-1),        // 6.ゴーレム
]

//モンスター変換関数
function monsterReturnFunc(bl){
    switch(bl)
    {
        case 52:
            return monsterMaster[0];
        break;
        case 53:
            return monsterMaster[1];
        break;
        case 54:
            return monsterMaster[2];
        break;
        case 55:
            return monsterMaster[3];
        break;
        case 56:
            return monsterMaster[4];
        break;
        case 57:
            return monsterMaster[5];
        break;
        case 58:
            return monsterMaster[6];
        break;
    }
}


class AttackMaster
{
	constructor(type,r,vx,vy,snum,atk)
	{
		this.type =type;
		this.r = r;
		this.vx=vx;
        this.vy=vy;
        this.snum=snum;
        this.atk=atk;
	}
}

let attackrMaster=
[
	new AttackMaster(0,4,64,0,126,0),        //0.ヒョーイ電波
	new AttackMaster(1,8,0,0,65,10),        // 1.斬撃
    new AttackMaster(2,8,0,0,71,8),        // 2.噛みつき
    new AttackMaster(3,8,0,0,74,5),        // 3.体当たり
    new AttackMaster(4,0,0,0,80,0),        // 4.衝撃
    new AttackMaster(5,2,32,-99,83,10),    // 5.タツノウチオトシ弾
    new AttackMaster(6,8,0,0,98,10),    // 6.トゲネズミ回転
    new AttackMaster(7,7,1,-99,100,10),    // 7.ツチカヤク
    new AttackMaster(8,16,0,0,102,10),    // 8.爆煙
    new AttackMaster(9,8,32,0,84,20),    // 9.地震
    new AttackMaster(10,16,0,0,118,20),    // 10.大地震
    new AttackMaster(11,4,0,1,125,5),    // 11.汚染水
]


class Sprite
{
    constructor(x,y,w,h)
    {
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
    }
}

let sprite =[
    new Sprite(0,5,15,27),//0右静,
    new Sprite(22,5,23,27),//1右１
    new Sprite(43,5,23,27),//2右2
    new Sprite(67,5,23,27),//3右3
    new Sprite(93,5,19,27),//4ジャンプ
    new Sprite(118,5,12,27),//5泳ぎ１
    new Sprite(134,5,12,27),//6泳ぎ2
    new Sprite(150,5,12,27),//7泳ぎ3
    new Sprite(166,5,12,27),//8泳ぎ4
    new Sprite(182,5,12,27),//9泳ぎ5
    new Sprite(214,36,24,28),//10右打ち
    new Sprite(1,37,15,27),//11左静
    new Sprite(20,37,18,27),//12
    new Sprite(44,37,18,27),//13
    new Sprite(67,37,18,27),//14
    new Sprite(92,37,17,27),//15ジャンプ
    new Sprite(114,37,12,27),//16泳ぎ1
    new Sprite(130,37,12,27),//17泳ぎ2
    new Sprite(146,37,12,27),//18泳ぎ3
    new Sprite(161,37,17,27),//19泳ぎ4
    new Sprite(178,37,12,27),//20泳ぎ5
    new Sprite(241,36,24,28),//21左うち

    new Sprite(203,42,11,22),//22ワプナ
    new Sprite(0,0,2,2),//23弾
    new Sprite(226,12,12,12),//24スライム右
    new Sprite(242,12,12,12),//25スライム左
    new Sprite(1,72,29,8),//26トカゲ右歩き
    new Sprite(33,72,29,8),//27右歩き
    new Sprite(66,72,29,8),//28右歩き
    new Sprite(97,67,29,13),//29右ジャンプ
    new Sprite(128,67,23,13),//30右泳ぎ
    new Sprite(152,65,23,13),//31右泳ぎ
    new Sprite(176,65,23,13),//32右泳ぎ
    new Sprite(2,88,29,8),//33左歩き
    new Sprite(34,88,29,8),//34左歩き
    new Sprite(65,88,29,8),//35左歩き
    new Sprite(97,83,29,13),//36左ジャンプ
    new Sprite(129,83,23,13),//37左およぎ
    new Sprite(152,82,23,13),//38左およぎ
    new Sprite(177,83,23,13),//39左およぎ
    new Sprite(7,97,10,23),//40コウモリ静止
    new Sprite(121,102,22,19),//41コウモリ右とび
    new Sprite(145,99,22,19),//42右とび
    new Sprite(172,101,22,19),//43右とび
    new Sprite(25,101,22,19),//44左とび
    new Sprite(49,99,22,19),//45左とび
    new Sprite(75,102,22,19),//46左とび
    new Sprite(1,120,15,24),//47タツノウチオトシ右
    new Sprite(17,120,15,24),//48右
    new Sprite(32,120,15,24),//49左
    new Sprite(48,120,15,24),//50左
    new Sprite(65,130,23,14),//51ニトロ転がし右持ち
    new Sprite(88,130,23,14),//52右持ち
    new Sprite(114,138,12,6),//53右
    new Sprite(130,138,12,6),//54右
    new Sprite(144,130,23,14),//55左もち
    new Sprite(168,130,23,14),//56左持ち
    new Sprite(195,138,12,6),//57左
    new Sprite(210,138,12,6),//58左
    new Sprite(1,151,30,17),//59岩かめ右
    new Sprite(3,151,30,17),//60右
    new Sprite(70,152,30,17),//61静止右
    new Sprite(97,151,30,17),//62左
    new Sprite(129,151,30,17),//63左
    new Sprite(165,151,30,17),//64静止左

    new Sprite(288,8,16,16),//65右斬撃１
    new Sprite(272,8,16,16),//66右斬撃２
    new Sprite(256,8,16,16),//67右斬撃３
    new Sprite(288,40,16,16),//68左斬撃１
    new Sprite(304,40,16,16),//69左斬撃２
    new Sprite(320,40,16,16),//70左斬撃３
    new Sprite(304,8,16,16),//71噛みつき１
    new Sprite(320,8,16,16),//72噛みつき２
    new Sprite(336,8,16,16),//73噛みつき3
    new Sprite(272,24,16,16),//74右体当たり１
    new Sprite(288,24,16,16),//75右体当たり２
    new Sprite(304,24,16,16),//76右体当たり３
    new Sprite(370,40,16,16),//77左体当たり１
    new Sprite(352,40,16,16),//78左体当たり２
    new Sprite(336,40,16,16),//79左体当たり３
    new Sprite(368,24,16,16),//80衝撃１
    new Sprite(384,24,16,16),//81衝撃２
    new Sprite(400,24,16,16),//82衝撃３
    new Sprite(272,40,2,2),//83タツノウチオトシゴ弾
    new Sprite(288,56,16,16),//84地震左
    new Sprite(304,56,16,16),//85地震右

    new Sprite(192,152,16,16),//86棘ネズミ左１
    new Sprite(208,152,16,16),//87棘ネズミ左2
    new Sprite(224,152,16,16),//88棘ネズミ右１
    new Sprite(240,152,16,16),//89棘ネズミ右１
    new Sprite(256,152,16,16),//90棘ネズミ転がり１
    new Sprite(272,152,16,16),//91棘ネズミ転がり2
    new Sprite(288,152,16,16),//92棘ネズミ転がり3
    new Sprite(304,152,16,16),//93棘ネズミ転がり4
    new Sprite(192,168,16,16),//94棘ネズミ反転左１
    new Sprite(208,168,16,16),//95棘ネズミ反転左2
    new Sprite(224,168,16,16),//96棘ネズミ反転右１
    new Sprite(240,168,16,16),//97棘ネズミ反転右１
    new Sprite(320,56,16,16),//98棘ネズミ回転衝撃1
    new Sprite(336,56,16,16),//99棘ネズミ回転衝撃2
    new Sprite(224,128,16,16),//100土かやく1
    new Sprite(240,128,16,16),//101土かやく2
    new Sprite(368,8,16,16),//102爆煙1
    new Sprite(384,0,32,32),//103爆煙2
    new Sprite(416,0,32,32),//104爆煙3


    new Sprite(214,68,24,28),//105水中右打ち
    new Sprite(241,68,24,28),//106水中左打ち
    new Sprite(213,97,27,15),//107仰向け

    new Sprite(0,184,64,40),//108ゴーレムしゃがみ
    new Sprite(64,184,64,40),//109ゴーレム正面
    new Sprite(128,184,40,40),//110ゴーレム左１
    new Sprite(168,184,40,40),//111ゴーレム左２
    new Sprite(208,184,40,40),//112ゴーレム左3
    new Sprite(248,184,40,40),//113ゴーレム右１
    new Sprite(288,184,40,40),//114ゴーレム右２
    new Sprite(328,184,40,40),//115ゴーレム右3
    new Sprite(0,232,64,40),//116ゴーレム振り上げ１
    new Sprite(0,280,64,40),//117ゴーレム振り下ろし１
    new Sprite(384,32,32,32),//118大地震1
    new Sprite(384,32,32,32),//119大地震1
    new Sprite(384,32,32,32),//120大地震1

    new Sprite(288,88,16,16),//121火の玉
    new Sprite(304,88,16,16),//122煙
    new Sprite(320,88,16,16),//123とげ
    new Sprite(336,88,16,16),//124汚染水パイプ
    new Sprite(272,112,8,8),//125汚染水

    new Sprite(304,112,16,16),//126ヒョーイ電波右１
    new Sprite(320,112,16,16),//127ヒョーイ電波右2
    new Sprite(288,128,16,16),//128ヒョーイ電波左１
    new Sprite(336,144,16,16),//129ヒョーイ電波左2

    new Sprite(352,88,16,16),//130遮断ブロック
    new Sprite(368,88,16,16),//131鉄格子ブロック


]

//メッセージデータ
class TextMassage{
    constructor(num,chara,tsec){
        this.chara=chara;
        this.tsec=tsec;
        this.num=num;
    }
}

let textmassage=[
    new TextMassage(0,0,90),  //0.ワプナ1-1
    new TextMassage(1,0,90),  //1.ワプナ1-2
    new TextMassage(2,0,60),  //2.ワプナ1-3
    new TextMassage(3,0,120),  //3.ワプナ1-4
    new TextMassage(4,0,120),  //4.ワプナ1-5
    new TextMassage(5,0,120),  //5.ワプナ1-6
    new TextMassage(6,0,120),  //6.ワプナ1-7
    new TextMassage(7,0,120),  //7.ワプナ1-8
    new TextMassage(8,0,120),  //8.ワプナ1-9
    new TextMassage(9,0,120),  //9.ワプナ1-10

    new TextMassage(10,0,90),  //10.ワプナ1-11
    new TextMassage(11,0,90),  //11.ワプナ1-12
    new TextMassage(12,0,60),  //12.ワプナ1-13

    new TextMassage(13,0,120),  //13.ワプナ1-14
    new TextMassage(14,0,120),  //14.ワプナ1-15
    new TextMassage(15,0,120),  //15.ワプナ1-16
]

let textdata=[
    "謎のじいさん「なんじゃお主は」",                 //0.ワプナ1-1
    "謎のじいさん「随分と無口な奴じゃな」",            //1.ワプナ1-2
    "謎のじいさん「まあよいか」",                    //2.ワプナ1-3
    "謎のじいさん「お前さんにいい物をあげよう」",            //3.ワプナ1-4
    "謎のじいさん「ただし条件がある」",               //4.ワプナ1-5
    "謎のじいさん「洞窟内にある部品を落としてしまっての」",         //5.ワプナ1-6
    "謎のじいさん「それをとってきて欲しいのじゃ」",     //6.ワプナ1-7
    "謎のじいさん「それとこの近くには紫色の鉱石があるはずじゃ」",    //7.ワプナ1-8
    "謎のじいさん「その二つを合わせて持ってきてくれたら交換じゃ」",   //8.ワプナ1-9
    "謎のじいさん「これがなければここの探索も行き詰まるじゃろうて」",  //9.ワプナ1-10

    "謎のじいさん「おおそれじゃそれ！」",            //10.ワプナ1-11
    "謎のじいさん「約束通りいいものをあげよう」",            //11.ワプナ1-12
    "謎のじいさん「伝説の鍵じゃ！！」",            //12.ワプナ1-13

    "謎のじいさん「なぜワシがこんな所にいるのか気になるようじゃの」",            //13.ワプナ1-12
    "謎のじいさん「それはなぜかというと・・・」",            //14.ワプナ1-13
    "謎のじいさん「このゲームがデモ版だからじゃ！！」",            //15.ワプナ1-14

    "ヘルプ:老人に鉱石と部品を渡そう",    //16.ヘルプ1
]

//インベントリデータ関数
function inventoryFunc(bl){
    switch(bl)
    {
        case 36:
            return inventorydata[0];
        break;
        case 37:
            return inventorydata[1];
        break;
        case 38:
        break;
    }
}

//インベントリデータ
class InventoryData{
    constructor(text,type,bl){
        this.text=text;
        this.type=type;
        this.bl=bl
}
}

let inventorydata=[
    new InventoryData("キラリンゴ",0,36), 
    new InventoryData("ポーション",1,37), 
]



//アニメデータ関数
function animedataFunc(bl){
    switch(bl)
    {
        case 42:
            return animedata[0];//火の玉
        break;
        case 43:
            return animedata[1];//煙
        break;
        case 45:
            return animedata[2];//とげ岩
        break;
        case 46:
            return animedata[3];//トゲネズミ
        break;
        case 47:
            return animedata[4];//カヤク転がし
        break;
        case 8:
            return animedata[5];//とげ
        break;
        case 48:
            return animedata[6];//汚染水
        break;
        case 64:
            return animedata[7];//汚染水
        break;
    }
}

//アニメデータ
class AnimeData{
    constructor(num,backbl,vx,vy,r,grav){
        this.num=num;
        this.backbl=backbl;
        this.vx=vx;
        this.vy=vy;
        this.r=r;
        this.grav=grav;
}
}

let animedata=[
    new AnimeData(0,29,0,-100,4,1),  //火の玉
    new AnimeData(1,-1,0,-8,0,0),    //煙
    new AnimeData(2,-1,0,16,8,0),  //トゲ岩
    new AnimeData(3,-1,0,16,8,0),    //トゲネズミ
    new AnimeData(4,-1,0,0,8,0),  //カヤクコロガシ
    new AnimeData(5,-1,0,0,8,0),    //とげ
    new AnimeData(6,-1,0,0,0,0),  //汚染水
    new AnimeData(7,-1,0,0,0,0),  //遮断ブロック
]

//フロアデータ
class FloarData{
    constructor(x,y,width,height,back){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.back=back;
    }
}

let floardata=[
    new FloarData(0,0,30,20,0),
    new FloarData(30,0,30,20,1),
    new FloarData(60,0,30,20,3),
    new FloarData(90,0,30,20,0),

    new FloarData(0,20,30,20,0),
    new FloarData(30,20,30,20,2),
    new FloarData(60,20,30,20,2),
    new FloarData(90,20,30,20,2),
    
    new FloarData(0,40,30,20,0),
    new FloarData(30,40,30,20,0),
    new FloarData(60,40,30,20,0),
    new FloarData(90,40,30,20,0),
]
