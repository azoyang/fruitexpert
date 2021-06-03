function Utils() {
    this.randomArray = function(t,c) {
        if(t.length<c){
            let oldLength=t.length;
            let repairCount=c-oldLength;
            let beishu=Math.floor(repairCount/oldLength);
            if(beishu>0){
                for(let i=0;i<beishu;i++){
                    t.forEach(element => {
                        t.push(element);
                    });
                }
                let limitNum=c-oldLength*beishu;
                if(limitNum>0){
                    for(let i=0;i<limitNum;i++){
                        let randomIndex=Math.floor(t.length*Math.random());
                        t.push(t[randomIndex]);
                    }
                }
            }else{
                for(let i=0;i<repairCount;i++){
                    let randomIndex=Math.floor(t.length*Math.random());
                    t.push(t[randomIndex]);
                }
            }
            

            
        }
        t.sort(function(t, e) {
            return 10 * Math.random() < 5 ? 1 : -1;
        });
        return t.slice(0,c);
    };
}
exports.Utils = Utils;
exports.utils = new Utils();
