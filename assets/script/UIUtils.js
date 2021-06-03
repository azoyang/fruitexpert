function UIUtils() {
   
        this.showProgressBarChange=function(barNode,fromRate,toRate,needSeconds,callBack,callBackParam){
            //barNode.totalLength
            let step=(toRate-fromRate)/(needSeconds/0.04);
            barNode.progress=fromRate;
            barNode.schedule(()=>{
                if(barNode.progress+step<toRate){
                    barNode.progress=toRate;
                }else{
                    barNode.progress+=step;
                }
                if(barNode.progress<=toRate){
                    barNode.unscheduleAllCallbacks();
                    if(undefined!==callBack){
                        if(undefined!==callBackParam){
                            callBack(callBackParam);
                        }else{
                            callBack();
                        }
                    }
                    
                }
            }, 0.04);
        };
        
    }
exports.UIUtils = UIUtils;
exports.uiUtils = new UIUtils();
