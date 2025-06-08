class Massage{
    constructor(num,tcou){
      this.num=textmassage[num].num;
      this.chara=textmassage[num].chara;
      this.tcou=tcou;                  //テキスト回数
      this.tsec=textmassage[num].tsec; //テキスト表示秒数
      this.flag=0;     //会話秒数
      this.fflag=false;//ファーストフラグ
      this.kill=false;
      this.cou=0;
      this.delay=2000;
      film.talk=true;
    }
    update(){
      if(this.kill){
        /*setTimeout(() => {
        film.talk=false;
        //cancelflag=false;
      }, this.delay);*/
        return;
      }
      this.cou++;
      this.chara=textmassage[this.num].chara;
      this.tsec=textmassage[this.num].tsec;
      if(this.flag)this.flag--;
    }

    draw(){
      let text=textdata[this.num];
        if(!this.flag){//時間経過で次の会話に進める
          if(keyb.DBUTTON){
            if(this.tcou>=0){
              if(this.fflag){//2回目以降の会話で前の会話を消去
                let pretext=textdata[this.num-1];
                RemoveTextMessage(pretext);
              }
              initRevealTextMessage(text); 
              audio.enum=8;
              audio.seFunc(audio.enum);
              this.flag=this.tsec; //次の会話までの秒数
              if(this.tcou--)this.num++;
            }
            else{ 
              RemoveTextMessage(text);
              cancelflag=false;
              action.flag=false;
              this.kill=true;
            }
          }
        }
        this.fflag=true;
    }
}

//テキストの削除
function RemoveTextMessage(text,delay){
  setTimeout(()=>{
    for(i=0;i<text.length;i++){
      const revealed = document.getElementsByClassName("revealed")[0];
      revealed.parentNode.removeChild(revealed);
    }
  },delay)
}

//テキストを読み込み
function initRevealTextMessage(text) {
    let chars = [];
    const text_message_p = document.getElementsByClassName("text_massage_p")[0];
    text.split("").forEach((char) => {
      let span = document.createElement("span");
      span.textContent = char;
      text_message_p.appendChild(span);
  
      chars.push({
        span,
        delayAfter: char === " " ? 0 : 60,
      });
    });
  
    revealTextMessage(chars);
  }
  
  //一文字ずつ表示
  function revealTextMessage(list) {
    let timeout;
    const next = list.splice(0, 1)[0];
    next.span.classList.add("revealed");
  
  
    if (list.length > 0) {
      timeout = setTimeout(() => {
        revealTextMessage(list);
      }, next.delayAfter);
    } else {
      clearTimeout(timeout);
    }
  }
