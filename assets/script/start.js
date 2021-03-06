// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var Fruit = require('fruit');
var UIUtils = require("UIUtils");
cc.Class({
    extends: cc.Component,

    properties: {

        // 这两个参数可用于手机适配
        origin_bk_w: 640,
        origin_bk_h: 480,

        background:{
            default: null,
            type: cc.Node
        },
        scoreLabel:cc.Node,
        // 刀光及对象池相关
        knife_part: {
            default: null,
            type: cc.Prefab
        },
        pooled_knifves: [],
        num_pooled_knifves: 12,
        knife_width: 10,
        knife_height: 10,
        tryagain:cc.Node,
        finishScore:cc.Node,
        finishNode:cc.Node,
        // 界面相关元素的旋转速度
        _rotation: 0.7,
        prg: cc.ProgressBar,
        // 触摸事件坐标
        sx:null,
        sy:null,
        ex:null,
        ey:null,

        // 水果及对象池
        pooled_fruits: [],
        num_pooled_fruits: 10,

        peach_prefab:{
            default: null,
            type: cc.Prefab
        },
        peach_part_1: {
            default: null,
            type: cc.Prefab
        },
        peach_part_2: {
            default: null,
            type: cc.Prefab
        },
        sandia_prefab:{
            default: null,
            type: cc.Prefab
        },
        sandia_part_1: {
            default: null,
            type: cc.Prefab
        },
        sandia_part_2: {
            default: null,
            type: cc.Prefab
        },
        banana_prefab:{
            default: null,
            type: cc.Prefab
        },
        banana_part_1: {
            default: null,
            type: cc.Prefab
        },
        banana_part_2: {
            default: null,
            type: cc.Prefab
        },
        basaha_prefab:{
            default: null,
            type: cc.Prefab
        },
        basaha_part_1: {
            default: null,
            type: cc.Prefab
        },
        basaha_part_2: {
            default: null,
            type: cc.Prefab
        },
        apple_prefab:{
            default: null,
            type: cc.Prefab
        },
        apple_part_1: {
            default: null,
            type: cc.Prefab
        },
        apple_part_2: {
            default: null,
            type: cc.Prefab
        },
        
        boom_prefab:{
            default: null,
            type: cc.Prefab
        },

        // 切开水果时的刀光
        flash_prefab:{
            default: null,
            type: cc.Prefab
        },

        // 这两个可用于多点触控问题，判断是否同一事件
        last_event_id: null,
        new_event_id: null,

        // 进入游戏时所需要的节点组（得分label、xxx等）
        game_start_need: [cc.Node],

        game_score: 0 ,
        fruit_missed: 0,

        // 带有Graphics组件的预制体，作为画笔
        paint:{
            default: null,
            type: cc.Prefab
        },
        
        // 炸弹头部火星特效相关
        gid: 0,
        pooled_boom_flame: [],
        num_pooled_boom_flame: 20,

        // 世界时间
        global_timer: 0,

        // 炸弹爆炸时特效相关
        boom_is_broken: false,
        blank_opacity: 255,

        //audio
        boom_audio: {
            default: null,
            type: cc.AudioClip
        },
        menu_audio: {
            default: null,
            type: cc.AudioClip
        },
        over_audio: {
            default: null,
            type: cc.AudioClip
        },
        start_audio: {
            default: null,
            type: cc.AudioClip
        },
        throw_audio: {
            default: null,
            type: cc.AudioClip
        },
        splatter_audio: {
            default: null,
            type: cc.AudioClip
        },
        tmpNode:{
            default: null,
            type: cc.Node
        },
        cherry_prefab:cc.Prefab,
        cherry_part_1:cc.Prefab,
        cherry_part_2:cc.Prefab,
        kiwi_prefab:cc.Prefab,
        kiwi_part_1:cc.Prefab,
        kiwi_part_2:cc.Prefab,
        lemon_prefab:cc.Prefab,
        lemon_part_1:cc.Prefab,
        lemon_part_2:cc.Prefab,
        orange_prefab:cc.Prefab,
        orange_part_1:cc.Prefab,
        orange_part_2:cc.Prefab,
        pear_prefab:cc.Prefab,
        pear_part_1:cc.Prefab,
        pear_part_2:cc.Prefab,
        pitaya_prefab:cc.Prefab,
        pitaya_part_1:cc.Prefab,
        pitaya_part_2:cc.Prefab,
        coconut_prefab:cc.Prefab,
        coconut_part_1:cc.Prefab,
        coconut_part_2:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    initConfig(){
        //this.game_start_need_name = ["score_pic","score_label","x1","x2","x3","xf1","xf2","xf3","game_over_pic"];
        //this.fruit_type = ["sandia","peach","banana","basaha","apple","boom"];
        this.fruit_type = ["strawberry","peach","banana","watermelon","apple","cherry","kiwi","lemon","orange","pear","pitaya","coconut"];
        this.config = {
            "strawberry":[this.sandia_prefab,this.sandia_part_1,this.sandia_part_2],
            "peach":[this.peach_prefab,this.peach_part_1,this.peach_part_2],
            "banana":[this.banana_prefab,this.banana_part_1,this.banana_part_2],
            "watermelon":[this.basaha_prefab,this.basaha_part_1,this.basaha_part_2],
            "apple":[this.apple_prefab,this.apple_part_1,this.apple_part_2],
            "cherry":[this.cherry_prefab,this.cherry_part_1,this.cherry_part_2],
            "kiwi":[this.kiwi_prefab,this.kiwi_part_1,this.kiwi_part_2],
            "lemon":[this.lemon_prefab,this.lemon_part_1,this.lemon_part_2],
            "orange":[this.orange_prefab,this.orange_part_1,this.orange_part_2],
            "pear":[this.pear_prefab,this.pear_part_1,this.pear_part_2],
            "pitaya":[this.pitaya_prefab,this.pitaya_part_1,this.pitaya_part_2],
            "coconut":[this.coconut_prefab,this.coconut_part_1,this.coconut_part_2],
            // "boom":[this.boom_prefab,null,null],
        };

        // this.boom_frame = [];
        
    },
    
    // 这个函数实际仅用来画两条贝塞尔曲线，用来模拟炸弹火星效果。可以进一步扩展其它画线。
    drawLine(g,start_point,end_point,control_point_1,control_point_2){
        
        g.moveTo(start_point[0],start_point[1]);
        
        g.quadraticCurveTo(control_point_1[0],control_point_1[1],end_point[0],end_point[1]);
        g.quadraticCurveTo(control_point_2[0],control_point_2[1],start_point[0],start_point[1]);
        g.stroke();
        g.fillColor = new cc.Color().fromHEX("f0ef9c");
        g.fill();

    },

    onLoad () {
        
        this.initConfig();
        this.sandia = null;
        this.peach = null;
        //this.home_mask.x = -this.node.x;
        //this.home_mask.y = this.node.y;

        // 初始化刀光、水果对象池
        for(let i=0;i<this.num_pooled_knifves;i++){
            this.pooled_knifves.push(cc.instantiate(this.knife_part));
        }
        for(let i=0;i<this.num_pooled_fruits;i++){
            this.pooled_fruits.push(this.createFruit("none"));
        }

        // 开启碰撞组件、设置监听事件
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this, true);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this, true);
        this.node_h = this.node.height;
        this.node_w = this.node.width;
        console.log(this.node_h,",",this.node_w);
        this.knife_height = this.pooled_knifves[0].getComponent('knife').height;
        this.knife_width = this.pooled_knifves[0].getComponent('knife').width;


        cc.systemEvent.on('HAND_TRACKING', this.handTacking, this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onHandTracking2Mouse, this, true);
    },

    onHandTracking2Mouse:function(event){
        let x=event.getLocationX();
        let y=event.getLocationY();
        //alert("x="+x+",y="+y);
        if(this.prev_pos==null){
            this.prev_pos=cc.v2(x, y);
            this.sx = this.prev_pos.x;
            this.sy = this.prev_pos.y;
            let knife_part = this.getPooledKnife();
            this.node.addChild(knife_part);
            knife_part.setPosition(this.sx-this.node_w/2,this.sy-this.node_h/2);
        }else{
            this.curent_pos=cc.v2(x, y);
            this.ex = this.curent_pos.x;
            this.ey = this.curent_pos.y;
            this.processEventForVR();
            this.prev_pos=this.curent_pos;
            this.sx = this.prev_pos.x;
            this.sy = this.prev_pos.y;
        }
    },
    handTacking:function(event){
        let tmp=event.getUserData();
        //let x=parseInt((tmp.x-0.5)*this.node.width);
        //let y=parseInt((0.5-tmp.y)*this.node.height);
        //console.log(JSON.stringify(tmp),",x=",x,",y=",y);
        //this.tmpNode.active=true;
        //this.tmpNode.x=x;
        //this.tmpNode.y=y;
        console.log("handTacking="+JSON.stringify(tmp));
        //let dd=tmp.split(',');
        let x=parseInt(parseFloat(tmp.x)*this.node.width);
        //if(tmp.y>1) tmp.y=1;
        let y=parseInt((1-parseFloat(tmp.y))*this.node.height);
        console.log(tmp,",x=",x,",y=",y);
        if(this.prev_pos==null){
            this.prev_pos=cc.v2(x, y);
            this.sx = this.prev_pos.x;
            this.sy = this.prev_pos.y;
            let knife_part = this.getPooledKnife();
            this.node.addChild(knife_part);
            knife_part.setPosition(this.sx-this.node_w/2,this.sy-this.node_h/2);
        }else{
            this.curent_pos=cc.v2(x, y);
            this.ex = this.curent_pos.x;
            this.ey = this.curent_pos.y;
            this.processEventForVR();
            this.prev_pos=this.curent_pos;
            this.sx = this.prev_pos.x;
            this.sy = this.prev_pos.y;
        }
    },
    processEventForVR(){
        // 刀光以及相关audio
        let lenV = this.curent_pos.sub(this.prev_pos).mag(); 
        let roateV = 0;
        let falsh_angle = this.curent_pos.sub(this.prev_pos).signAngle(cc.v2(1,0)) / Math.PI * 180;

        if(lenV > this.knife_height){
            let tempVec = cc.v2(0,10);
            roateV = this.curent_pos.sub(this.prev_pos).signAngle(tempVec) / Math.PI * 180
            // 
            let end_pooledKnife = this.getPooledKnife();
            if(end_pooledKnife != null){
                this.node.addChild(end_pooledKnife);
                end_pooledKnife.height = lenV;
                end_pooledKnife.setPosition((this.sx+this.ex)/2-this.node_w/2,(this.sy+this.ey)/2-this.node_h/2);
                end_pooledKnife.angle = -roateV;
            }

            if(!this.throw_audio_id || this.throw_audio_id && cc.audioEngine.getState(this.throw_audio_id)!=1)
                this.throw_audio_id = cc.audioEngine.playEffect(this.throw_audio,false);
            
        }

        // 对水果和炸弹被切开时的处理
        this.pooled_fruits.forEach(e => {
            if(e && !e.isAvailable && e.fruit_all!=null ){
                console.log(JSON.stringify(this.prev_pos),",",JSON.stringify(this.curent_pos),",",JSON.stringify(e.fruit_all.getComponent('cc.PolygonCollider').world.points));
                if(e.fruit_all.getComponent('cc.PolygonCollider') && cc.Intersection.linePolygon(this.prev_pos,this.curent_pos, e.fruit_all.getComponent('cc.PolygonCollider').world.points)){
                    // cc.log("hit");
                    if(e.fruit_type != "boom"){
                        cc.audioEngine.playEffect(this.splatter_audio,false);

                        this.game_score++;
                        this.scoreLabel.getComponent('cc.Label').string= this.game_score;
                        var flash = cc.instantiate(this.flash_prefab);
                        flash.position = e.fruit_all.position;
                        flash.rotation = falsh_angle;
                        this.node.addChild(flash);
                        setTimeout(function(){
                            this.node.removeChild(flash);
                        }.bind(this),100);

                        e.apart();
                    }else{
                        e.apart();
                        this.boomIsBoom(e,e.fruit_all.x + this.node_w/2,e.fruit_all.y + this.node_h/2);
                    }
                }  
            }
        });

        if(this.finishNode.active){
            // 开始界面的水果被切开
            if (cc.Intersection.linePolygon(this.prev_pos,this.curent_pos,this.tryagain.getComponent('cc.PolygonCollider').world.points)) {
                cc.audioEngine.playEffect(this.splatter_audio,false);
                this.prepare_game_start();
            }
        }
    },


    start () {
        // 开始audio
        this.menu_audio_id = cc.audioEngine.play(this.menu_audio,false);
        this.prev_pos=null;
        this.curent_pos=null;
        cc.audioEngine.playEffect(this.splatter_audio,false);
        this.prepare_game_start();
    },

    update (dt) {
    
        this.global_timer += dt ;
      
        //this.dojo.angle = (this._rotation); 
        //this.new_game.angle = (-this._rotation); 
        //this.quit_game.angle = (-this._rotation); 
    
        this._rotation++;

        // 维护对象池
        this.pooled_knifves.forEach(e => {   
            if(!e.getComponent('knife').isActivate && e.getComponent('knife').life <= 0){
                this.node.removeChild(e);
                e.getComponent('knife').resetProperties();
            }
        });

        
        // 判断水果是否还在界面内，是否被切开，是否漏掉了。
        this.pooled_fruits.forEach(e => {
            if(!e.isAvailable){
                // cc.log('11')
                if(e.isActivate)
                    e.update(dt);
                else{
                    if(!e.isBroken){
                        if(e.fruit_type!="boom"){
                            this.fruit_missed++;
                            this.precess_fruit_missed();
                        }
                    }
                    e.fruit_destroy();
                    e.isAvailable = true;
                }
            }
        });
        
        // 当切到炸弹时的特效
        /*if(this.boom_is_broken && this.blank_paint && this.blank_opacity>0){
            var g = this.blank_paint.getComponent(cc.Graphics);
            g.clear();
            g.fillColor = cc.Color.WHITE.setA(this.blank_opacity-=255 * (dt/3));
            g.fillRect(0,0,1000,1000);
        }*/

    },

    // 对象池
    getPooledKnife(){ 
        for(let i=0; i<this.num_pooled_knifves; i++){
            if(this.pooled_knifves[i].getComponent('knife').isActivate){
                // cc.log(i,"is activate");
                this.pooled_knifves[i].getComponent('knife').isActivate = false;
                return this.pooled_knifves[i];
            }
        }
        
        let new_knife = cc.instantiate(this.knife_part);
        this.pooled_knifves.push(new_knife);
        new_knife.getComponent('knife').isActivate = false;
        this.num_pooled_knifves++;
        return new_knife;
    },

    // 相关事件
    onTouchStart(event){
        
        // if(!this.last_event_id)
        //     this.last_event_id = event.getID();
        // this.new_event_id = event.getID();
    
        this.prev_pos = event.getLocation();
        this.sx = event.getLocationX();
        this.sy = event.getLocationY();
        
        let knife_part = this.getPooledKnife();
        this.node.addChild(knife_part);
        knife_part.setPosition(this.sx-this.node_w/2,this.sy-this.node_h/2);
        console.log("this.prev_pos x=",this.prev_pos.x,",y=",this.prev_pos.y);
    },

    onTouchMove(event){
        
        // 这一段可以用来处理移动设备上的多点触控问题
        // if(this.new_event_id != event.getID()){
        //     // this.last_event_id = this.new_event_id;
        //     return;
        // }

        this.curent_pos = event.getLocation();
        this.ex = event.getLocationX();
        this.ey = event.getLocationY();
        this.curent_pos = event.getLocation();
        this.ex = event.getLocationX();
        this.ey = event.getLocationY();
        
        // 刀光以及相关audio
        let lenV = this.curent_pos.sub(this.prev_pos).mag(); 
        let roateV = 0;
        let falsh_angle = this.curent_pos.sub(this.prev_pos).signAngle(cc.v2(1,0)) / Math.PI * 180;

        if(lenV > this.knife_height){
            let tempVec = cc.v2(0,10)
            roateV = this.curent_pos.sub(this.prev_pos).signAngle(tempVec) / Math.PI * 180
            // 
            let end_pooledKnife = this.getPooledKnife();
            if(end_pooledKnife != null){
                this.node.addChild(end_pooledKnife);
                end_pooledKnife.height = lenV;
                end_pooledKnife.setPosition((this.sx+this.ex)/2-this.node_w/2,(this.sy+this.ey)/2-this.node_h/2);
                end_pooledKnife.angle = -roateV;
            }
            
            
            this.prev_pos = this.curent_pos;
            this.sx = this.ex;
            this.sy = this.ey;

            if(!this.throw_audio_id || this.throw_audio_id && cc.audioEngine.getState(this.throw_audio_id)!=1)
                this.throw_audio_id = cc.audioEngine.playEffect(this.throw_audio,false);
            
        }
        
        

        // 对水果和炸弹被切开时的处理
        this.pooled_fruits.forEach(e => {
            if(e && !e.isAvailable
                && e.fruit_all!=null 
                && (( e.fruit_all.getComponent('cc.PolygonCollider') && cc.Intersection.pointInPolygon(this.curent_pos, e.fruit_all.getComponent('cc.PolygonCollider').world.points) )
                     || ( e.fruit_all.getComponent('cc.CircleCollider') && cc.Intersection.polygonCircle([this.curent_pos], e.fruit_all.getComponent('cc.CircleCollider').world) ))){
                        // cc.log("hit");
                        if(e.fruit_type != "boom"){
                            cc.audioEngine.playEffect(this.splatter_audio,false);

                            this.game_score++;
                            this.scoreLabel.getComponent('cc.Label').string= this.game_score;
                        
                            var flash = cc.instantiate(this.flash_prefab);
                            flash.position = e.fruit_all.position;
                            flash.rotation = falsh_angle;
                            this.node.addChild(flash);
                            setTimeout(function(){
                                this.node.removeChild(flash);
                            }.bind(this),100);

                            e.apart();
                        }
                        // else{
                        //     e.apart();
                        //     this.boomIsBoom(e,e.fruit_all.x + this.node_w/2,e.fruit_all.y + this.node_h/2);
                        // }
                        
                        
                     }
        });


        if(this.finishNode.active){
            // 结束界面的再来一次被切中
            if (cc.Intersection.pointInPolygon(this.curent_pos, this.tryagain.getComponent('cc.PolygonCollider').world.points)) {
                cc.audioEngine.playEffect(this.splatter_audio,false);
                this.prepare_game_start();
            }
        }
        

    },
    // 从开始界面到游戏界面
    prepare_game_start(){
        // cc.log(this.menu_audio_id)
        this.finishNode.active=false;
        this.tryagain.active=false;
        this.game_score=0;
        this.scoreLabel.getComponent('cc.Label').string= this.game_score;
        cc.audioEngine.stopAll();
        this.prg.unscheduleAllCallbacks();
        this.unscheduleAllCallbacks();
        this.prg.progress=1;
        this.prg.unscheduleAllCallbacks();
        UIUtils.uiUtils.showProgressBarChange(this.prg,1,0,120,this.timeCheckFinish.bind(this));
        //this.node.removeChild(this.dojo);
        //this.node.removeChild(this.new_game);
        //this.node.removeChild(this.quit_game);
        //this.node.removeChild(this.home_mask);
        //this.node.removeChild(this.home_desc);
        //this.node.removeChild(this.ninja);
        //this.node.removeChild(this.logo);
        //this.node.removeChild(this.boom);

        // this.removePooledBoomFlame();
        // this.unschedule(this.boom_flame_schedule);

        cc.audioEngine.play(this.start_audio);
        
        // for(var i = 0; i < 5; i++){
            
        //     this.game_start_need[i].active = true;
        // }

        // 水果的出现
        this.schedule_func = function(){

            let num_fruits = Math.floor(Math.random() * 4);
            let is_boom = false;
            
            while(num_fruits--){
                let f = this.getPooledFruit(is_boom);
                if(f.fruit_type=="boom"){
                    is_boom = false;   
                }
            }
                        
            // this.getPooledFruit();
        }

        this.schedule(this.schedule_func.bind(this), 2.5);

        
 
    },
    timeCheckFinish(){
        this.unscheduleAllCallbacks();
        this.finishNode.active=true;
        this.tryagain.active=true;
        this.finishScore.getComponent(cc.Label).string=this.game_score;
        
    },
    // 创建水果
    createFruit(fruit_type,position_x,position_y,roate_angle,x_speed,y_speed){
        let t = new Fruit();
        // t.isActivate = true;
        t.game_manager = this;
        if(fruit_type=='none'){
            return t;
        }
        t.set_properties(fruit_type,cc.instantiate(this.config[fruit_type][0]),cc.instantiate(this.config[fruit_type][1]),cc.instantiate(this.config[fruit_type][2]),roate_angle,position_x,position_y,x_speed,y_speed);
        return t;
    },

    // 对象池
    getPooledFruit(is_boom){
        
        for(let i=0; i<this.num_pooled_fruits; i++){
            if(this.pooled_fruits[i].isAvailable){
                // cc.log(i,"is activate");
                let type_index = Math.floor(Math.random()*12);
                
                // if(Math.random() < 0.37){
                //     if(is_boom)
                //         type_index = 4;
                // }
                
                this.pooled_fruits[i].reset_all_properties();
                this.pooled_fruits[i].isActivate = true;
                this.pooled_fruits[i].isAvailable = false;
                let fruit_type = this.fruit_type[type_index];
                let fruit_roate_angle = Math.random() > 0.5 ? 1 : -1;
                let position_x = Math.random()*((this.background.x+this.background.width/2 - 2) - (this.background.x-this.background.width/2 + 2) +1)+ (this.background.x-this.background.width/2 + 2);
                let position_y = (this.background.y-this.node_h/2) + 0.01;
                let x_speed = Math.random() * (1.7-0.6+1) + 0.6;
                x_speed = position_x < this.background.x ? x_speed : -x_speed;
                let y_speed = Math.random() * (11.7 - 10.7 + 1) + 10.7; 
                if(fruit_type != "boom"){
                    this.pooled_fruits[i].set_properties(fruit_type,cc.instantiate(this.config[fruit_type][0]),cc.instantiate(this.config[fruit_type][1]),cc.instantiate(this.config[fruit_type][2]),fruit_roate_angle,position_x,position_y,x_speed,y_speed);
                }else{
                    this.pooled_fruits[i].set_properties(fruit_type,cc.instantiate(this.config[fruit_type][0]),this.config[fruit_type][1],this.config[fruit_type][2],fruit_roate_angle,position_x,position_y,x_speed,y_speed);
                }
                this.pooled_fruits[i].game_manager = this;

                if(fruit_type == 'boom'){

                }

                return this.pooled_fruits[i];
            }
        }

        cc.log('create new fruit');
        let new_fruit = this.createFruit("none");
        this.pooled_fruits.push(new_fruit);
        new_fruit.isActivate = true;
        new_fruit.isAvailable = false;
        new_fruit.game_manager = this;
        this.num_pooled_fruits++;

        let type_index = Math.floor(Math.random()*(1-0+1)+0)
        let fruit_type = this.fruit_type[type_index];
        let fruit_roate_angle = Math.random() > 0.5 ? 1 : -1;
        let position_x = Math.random()*((this.background.x+this.node_w/2 - 50) - (this.background.x-this.node_w/2 + 50) +1)+ (this.background.x-this.node_w/2 + 50);
        let position_y = (this.background.y-this.node_h/2);
        let x_speed = Math.random() * (1.7-0.6+1) + 0.6;
        x_speed = position_x < this.background.x ? x_speed : -x_speed;
        let y_speed = Math.random() * (11.7 - 10.7 + 1) + 10.7;  
        // Math.random() * (14 - 12 + 1) + 12
        new_fruit.set_properties(fruit_type,cc.instantiate(this.config[fruit_type][0]),cc.instantiate(this.config[fruit_type][1]),cc.instantiate(this.config[fruit_type][2]),fruit_roate_angle,position_x,position_y,x_speed,y_speed);
        
        return new_fruit;

    },

    // 漏掉水果时
    precess_fruit_missed(){
        if(this.fruit_missed > 0 && this.fruit_missed <= 3){
            //this.game_start_need[this.game_start_need_name.indexOf('x'+this.fruit_missed)].active = false;
            //this.game_start_need[this.game_start_need_name.indexOf('xf'+this.fruit_missed)].active = true;
        }
        if(this.fruit_missed >= 3){
            //this.game_over_and_restart();
        }
    },

    game_over_and_restart(){
        
    },

    // 对象池
    getPooledBoomFlame(id,life,center,angle,length,create_time,paint){
        for(let i=0;i<this.num_pooled_boom_flame;i++){
            if(this.pooled_boom_flame[i].active){
                this.pooled_boom_flame[i].set_properties(id,life,center,angle,length,create_time,paint);
                this.pooled_boom_flame[i].active = false;
                // cc.log('123')
                return this.pooled_boom_flame[i];
            }
        }

        let new_BF = new BoomFlame();
        this.pooled_boom_flame.push(new_BF);
        this.num_pooled_boom_flame++;
        new_BF.active = false;
        new_BF.set_properties(id,life,center,angle,length,create_time,paint);
        return new_BF;
    },

    removePooledBoomFlame(){
        for(let i=0;i<this.num_pooled_boom_flame;i++){
            if(!this.pooled_boom_flame[i].active){
                this.pooled_boom_flame[i].remove_boom_flame();
                this.pooled_boom_flame[i].active = true;
            }
        }
    },

    //boom light 用于下面的第一种方法
    createLight(x,y,every_angle,index){
        let light_len = 1074;
        let light_left_angle = Math.PI * (index * every_angle - 2.5) / 180;
        let light_right_angle = Math.PI * (index * every_angle + 2.5) / 180;
        let light_left_x = x + light_len * Math.cos(light_left_angle);
        let light_left_y = y + light_len * Math.sin(light_left_angle);
        let light_right_x = x + light_len * Math.cos(light_right_angle);
        let light_right_y = y + light_len * Math.sin(light_right_angle);

        // cc.log(x,y);
        let paint = cc.instantiate(this.paint)
        this.node.addChild(paint);
        let g = paint.getComponent(cc.Graphics);
        cc.log(index);
        // cc.log(g);
        // cc.log(light_left_x,light_left_y);
        g.moveTo(x,y);
        g.lineTo(light_left_x,light_left_y);
        g.lineTo(light_right_x,light_right_y);
        g.close();
        g.stroke();
        g.fillColor = new cc.Color().fromHEX("ffffff");
        g.fill();
 
    },

    boomIsBoom(fruit,x,y){
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this, true);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this, true);
        this.unscheduleAllCallbacks();
        let num_light = 10;
        let light_array = [];
        for(var i=0;i<num_light;i)
            light_array[i] = i++;
        light_array.sort(function(){    return 0.5-Math.random(); });

        cc.audioEngine.playEffect(this.boom_audio,false);
        // cc.log(light_array);
        //生成炸弹光线
        let num = num_light;
        let time = 0;

        // 第一种方法：
        /*

        let start_this = this;
        function set_time_func(x,y,light_array,num){
            setTimeout(function(){
                cc.log(x,y)
                this.createLight(x,y,360/num_light,light_array[num]);
            }.bind(start_this),time+=100);
        }

        while(num--){  
            // 第一种方法：
            set_time_func(x,y,light_array,num);

        }

        */
        
       // 第二种方法 
       let paint = cc.instantiate(this.paint);
       this.node.addChild(paint);

        while(num--){
            cc.log(num);
            setTimeout(function(){
                createLight(x,y,360/num_light,light_array[ this ],paint);
            }.bind(num),time+=110);
        }

        // 光线结束后，整个屏幕的特效
        setTimeout(function(){
            this.node.removeChild(paint);
            paint.destroy();
            fruit.fruit_destroy();
            this.blank_paint = cc.instantiate(this.paint);
            this.node.addChild(this.blank_paint);
            this.boom_is_broken = true;

        }.bind(this),time+=100);

        // 游戏结束
        setTimeout(function(){
            if(this.blank_paint){
                this.node.removeChild(this.blank_paint);
                this.blank_paint.destroy();
            }
            this.game_over_and_restart();
        }.bind(this),time+=3000);

    }

    
});

//boom flame
function BoomFlame(id,life,center,angle,length,create_time,paint){
    this.id = id;
    this.create_time = create_time;
    this.life = life;
    this.center = center;
    this.angle = angle;
    this.length = length;

    this.radius = 15;
    this.elapse = 0;

    this.paint = paint;

    this.active = true;

    BoomFlame.prototype.set_properties = function(id,life,center,angle,length,create_time,paint){
        this.id = id;
        this.create_time = create_time;
        this.life = life;
        this.center = center;
        this.angle = angle;
        this.length = length;

        this.radius = 15;
        this.elapse = 0;

        this.paint = paint;

        this.active = true;
    }

    BoomFlame.prototype.update_boom_flame = function(draw){
        if(this.life - this.elapse <= 0){
            this.remove_boom_flame();
            return ;
        }
        this.paint.getComponent(cc.Graphics).clear();
        let ratio_elapse_life = this.elapse / this.life;
        let angle = this.angle;
        let center = this.center;
        let len = this.length;
        let r = this.radius

        center = [ Math.trunc(center[0] + len * ratio_elapse_life * Math.cos(angle)) , Math.trunc( center[1] + len * ratio_elapse_life * Math.sin(angle) ) ];
        let start_point = [ Math.trunc( center[0] - r * (1-ratio_elapse_life) * Math.cos(angle) ) , Math.trunc( center[1] - r * (1-ratio_elapse_life) * Math.sin(angle) ) ];
        let end_point = [ Math.trunc( center[0] + r * (1-ratio_elapse_life) * Math.cos(angle) ) , Math.trunc( center[1] + r * (1-ratio_elapse_life) * Math.sin(angle) ) ];
        let control_point_1 = [ Math.trunc( center[0] + r * (1-ratio_elapse_life) * Math.cos(angle + 0.5*Math.PI) * 0.38 ) , Math.trunc( center[1] + r * (1-ratio_elapse_life) * Math.sin(angle + 0.5*Math.PI) * 0.38 ) ];
        let control_point_2 = [ Math.trunc( center[0] + r * (1-ratio_elapse_life) * Math.cos(angle - 0.5*Math.PI) * 0.38 ) , Math.trunc( center[1] + r * (1-ratio_elapse_life) * Math.sin(angle - 0.5*Math.PI) * 0.38 ) ];

        // cc.log('draw');
        // cc.log(this.paint);
        draw(this.paint.getComponent(cc.Graphics),start_point,end_point,control_point_1,control_point_2);



    }

    BoomFlame.prototype.remove_boom_flame = function(){
        this.paint.getComponent(cc.Graphics).clear();
        this.paint.destroy();
        // cc.log('remove');
        this.active = true;
        this.id = null;
        this.create_time = null;
        this.life = null;
        this.center = null;
        this.angle = null;
        this.length = null;

        this.radius = null;
        this.elapse = null;

        this.paint = null;

        
    }

}

//boom light 用于上面第二种方法
function createLight(x,y,every_angle,index,paint){
    let light_len = 1074;
    let light_left_angle = Math.PI * (index * every_angle - 2.5) / 180;
    let light_right_angle = Math.PI * (index * every_angle + 2.5) / 180;
    let light_left_x = x + light_len * Math.cos(light_left_angle);
    let light_left_y = y + light_len * Math.sin(light_left_angle);
    let light_right_x = x + light_len * Math.cos(light_right_angle);
    let light_right_y = y + light_len * Math.sin(light_right_angle);

    let g = paint.getComponent(cc.Graphics);
    g.moveTo(x,y);
    g.lineTo(light_left_x,light_left_y);
    g.lineTo(light_right_x,light_right_y);
    g.close();
    g.stroke();
    g.fillColor = cc.Color.WHITE;
    g.fill();

}

    


    
