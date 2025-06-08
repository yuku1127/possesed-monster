class Audio{
    constructor(){
        this.bnum=undefined;
        this.enum=undefined;
    }
    bgmStart(num){
        let audio=document.getElementById('back'+num);
        audio.play();
    }
    bgmStop(num){
        let audio=document.getElementById('back'+num);
        audio.pause();
        audio.currentTime=0;
    }

    seFunc(num){
        let audio=document.getElementById('se'+num);
        audio.play();
    }
}
