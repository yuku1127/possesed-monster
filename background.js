//
//背景画像の描画
//

class BackGround{
    constructor(){}
    update(){}
    draw(){
        switch(floardata[field.floar].back){
            case 0:
                vcon.drawImage(backImg,0,0,30<<4,20<<4,0,0,(30<<4)<<2,(20<<4)<<2);
            break;
            case 1:
                vcon.drawImage(backImg,0,64,30<<4,20<<4,0,0,(30<<4)<<2,(20<<4)<<2);
            break;
            case 2:
                vcon.drawImage(backImg,96,64,30<<4,20<<4,0,0,(30<<4)<<2,(20<<4)<<2);
            break;
            case 3:
                vcon.drawImage(backImg,96,0,30<<4,20<<4,0,0,(30<<4)<<2,(20<<4)<<2);
            break;
        }

    }
}
