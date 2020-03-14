var settings = {
    src: "",
    duration: 0,
    curr_time: 0,
    paused: false,
    played: false,
    volume: 1,
}

function getAllVideos(){
    var videos = document.querySelectorAll('video')
    var iframes = document.querySelectorAll('iframe')

    function rec(list_iframes){
        for(let a = 0; a < list_iframes.length; ++a){
            if(list_iframes[a] === null || list_iframes[a].contentDocument === null){
                continue
            }
            var iFrameBody = list_iframes[a].contentDocument.getElementsByTagName('body')[0];
            let videos_iframe = iFrameBody.querySelectorAll('video')
            
            videos = [...videos, ...videos_iframe];

            let iframes_iframe = iFrameBody.querySelectorAll('iframe')
            if(iframes_iframe !== undefined && iframes_iframe.length !== 0){
                rec(iframes_iframe)
            }
        }
    }
    if(iframes !== undefined && iframes.length !== 0){
        rec(iframes)
    }
    
    chrome.storage.sync.set({"tot_videos": JSON.stringify(videos.length)}, function() {})

    return videos
}

var videos = getAllVideos()

chrome.storage.onChanged.addListener(function(changes, area) {
    if(area === "sync"){
        if(changes === "curr_video"){
            
        }
    }
})

// setTimeout(function(){ 
//     // window.setInterval(function(){
//     //     chrome.storage.sync.get("curr_video", function(storage){
//     //         console.log(storage)
//     //     })
//     // }, 1000);
// }, 3000)