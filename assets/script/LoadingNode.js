// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var utils = require("Utils");
cc.Class({
    extends: cc.Component,

    properties: {
        stepNodes:[cc.Node],
        mouthNode:cc.Node,
        rateMask:cc.Node,
        spriteFrames:[cc.SpriteFrame],
        wordLabel:cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on('VOICEPROCESSING', this.handSpeakListening, this);
    },
    handSpeakListening(event){
        let tmp=event.getUserData();
        if(tmp.suc){
            console.log(tmp.data.SuggestedScore);
            if(tmp.data.SuggestedScore>=50){
                this.wordsSpeakResult[this.currentStep]=1;
                this.stepNodes[this.currentStep].getChildByName("icon_right").active=true;
                this.currentStep++;
                this.rateMask.width=1562*0.1667*this.currentStep;
                if(this.rateMask.width>1562){
                    this.rateMask.width=1562;
                }
                if(this.currentStep==this.wordsArray.length){
                    //this.audioControl.closeAudio();
                    let evt = new cc.Event.EventCustom("GO_GAME", true);
                    cc.systemEvent.dispatchEvent(evt);
                }else{
                    this.newListen();
                }
            }else{
                this.newListen();
            }
        }else{
            this.newListen();
        }
    },
    start () {
        let words=["strawberry","peach","banana","watermelon","apple","cherry","kiwi","lemon","orange","pear","dragon fruit","coconut"];
        let wordsCache=["strawberry","peach","banana","watermelon","apple","cherry","kiwi","lemon","orange","pear","dragon fruit","coconut"]
        this.wordsArray=utils.utils.randomArray(words,6);
        this.wordsSpeakResult=[0,0,0,0,0,0];
        for (let index = 0; index < this.wordsArray.length; index++) {
            const element = this.wordsArray[index];
            console.log(element,words.indexOf(element));
            this.stepNodes[index].getChildByName("bg_wt").getChildByName("apple_01").getComponent(cc.Sprite).spriteFrame=this.spriteFrames[wordsCache.indexOf(element)];
            this.stepNodes[index].getChildByName("icon_right").active=false;
        }
        this.currentStep=0;
        this.checkNext=true;
        cc.tween(this.node)
        .delay(2)
        .call(() => {
            this.startRecordVoice();
        })
        .delay(2)
        .call(() => {
            this.stopRecordVoice();
        })
        .start();


        
    },
    newListen(){
        cc.tween(this.node)
        .call(() => {
            this.startRecordVoice();
        })
        .delay(2)
        .call(() => {
            this.stopRecordVoice();
        })
        .start();
    },
    startRecordVoice(){
        this.voiceStart="RECORDING";
        this.mouthNode.getComponent(cc.Animation).play("mouth");
        this.wordLabel.string=this.wordsArray[this.currentStep];
        window.startVoiceRecord(this.wordsArray[this.currentStep]);
    },
    stopRecordVoice(){
        this.voiceStart="PROCESSING";
        this.mouthNode.getComponent(cc.Animation).stop();
        window.stopVoiceRecord();
    }
});
