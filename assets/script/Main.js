// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        loadingNode:cc.Node,
        gameNode:cc.Node,
        startNode:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on('GO_GAME', this.goGame, this);
    },

    start () {
        this.startNode.active=true;
        this.loadingNode.active=false;
        this.gameNode.active=false;
        // this.goGame();
        //this.goLoading();
    },
    goLoading(){
        this.startNode.active=false;
        this.loadingNode.active=true;
        this.gameNode.active=false;
        window.createRecorder();

    },
    goGame(){
        if(cc.sys.isNative){
            if(jsb.startHandTracking()){
                this.startNode.active=false;
                this.loadingNode.active=false;
                this.gameNode.active=true;
            }
        }else{
            this.startNode.active=false;
            this.loadingNode.active=false;
            this.gameNode.active=true;
            window.startTracking();
        }
        
        //window.startTracking();
    }

    // update (dt) {},
});
