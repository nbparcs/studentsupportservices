export function calculateAOIAttention(gazeData){

    const attention = {};


    gazeData.forEach(point=>{

        const aoi = point.aoi;


        if(!attention[aoi]){
            attention[aoi]=0;
        }


        attention[aoi]++;

    });


    return attention;

}



export function calculateViewingTime(gazeData){

    const viewingTime={};


    for(let i=1;i<gazeData.length;i++){

        const previous = gazeData[i-1];

        const current = gazeData[i];


        const duration =
            current.timestamp - previous.timestamp;


        const aoi=current.aoi;


        if(!viewingTime[aoi]){
            viewingTime[aoi]=0;
        }


        viewingTime[aoi]+=duration;

    }


    return viewingTime;

}



export function getGazePath(gazeData){

    const path=[];


    gazeData.forEach(point=>{


        if(
            path[path.length-1] !== point.aoi
        ){

            path.push(point.aoi);

        }

    });


    return path;

}