var settings = []
var setting = {
    src: "",
    duration: 0,
    curr_time: 0,
    paused: false,
    volume: 1,
    speed: 1,
}
var curr_video = 0

function getAllVideos(){
    var videos2 = document.querySelectorAll('video')
    var iframes = document.querySelectorAll('iframe')

    function rec(list_iframes){
        for(let a = 0; a < list_iframes.length; ++a){
            if(list_iframes[a] === null || list_iframes[a].contentDocument === null){
                continue
            }
            var iFrameBody = list_iframes[a].contentDocument.getElementsByTagName('body')[0];
            let videos_iframe = iFrameBody.querySelectorAll('video')
            
            videos2 = [...videos2, ...videos_iframe];

            let iframes_iframe = iFrameBody.querySelectorAll('iframe')
            if(iframes_iframe !== undefined && iframes_iframe.length !== 0){
                rec(iframes_iframe)
            }
        }
    }
    if(iframes !== undefined && iframes.length !== 0){
        rec(iframes)
    }

    return videos2
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleepFor(time_sleep) {
    await sleep(time_sleep)
}

function update(videos2){
    settings_tmp = []
    for(let a = 0; a < videos2.length; ++a){
        var sett = JSON.parse(JSON.stringify(setting))
        // while(true){
        //     if(isNaN(videos2[a].duration) || videos2[a].duration === null || videos2[a].duration === undefined){
        //         sleepFor(100)
        //     }
        //     console.log(videos2[a].duration, isNaN(videos2[a].duration))
        //     sett.duration = videos2[a].duration
        //     break
        // }
        sett.duration = videos2[a].duration
        sett.src = videos2[a].src + " - " + videos2[a].currentSrc
        sett.curr_time = videos2[a].currentTime
        sett.paused = videos2[a].paused
        sett.volume = videos2[a].volume
        sett.speed = videos2[a].playbackRate
        settings_tmp.push(sett)
    }

    settings = JSON.parse(JSON.stringify(settings_tmp))

    // chrome.storage.sync.set({"videos_settings": JSON.stringify(settings)}, function() {})
}

var videos = getAllVideos()
update(videos)
// console.log("Get videos", videos)

async function updateVideo(time_sleep) {
    while(true){
        await sleep(time_sleep)

        videos = getAllVideos()
        // console.log(videos)
        update(videos)
    }
}
updateVideo(1000)

chrome.storage.onChanged.addListener(function(changes, area) {
    if(area === "sync"){
        if(changes.curr_video !== undefined){
            curr_video = changes.curr_video.newValue
            videos[curr_video].scrollIntoView();
        }
    }
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request !== undefined && request.curr_setting !== undefined){
        let curr_setting = request.curr_setting
        videos[curr_video].volume = curr_setting.volume
        videos[curr_video].playbackRate = curr_setting.speed

        if(curr_setting.paused === true){
            videos[curr_video].pause()
        } else {
            videos[curr_video].play()
        }
    }
    else if(request !== undefined && request.get_settings !== undefined){
        if(videos.length !== 0){
            // while(settings.length === undefined){
            //     sleepFor(100)
            // }
            // while(videos.length !== settings.length){
            //     sleepFor(100)
            // }
            videos[curr_video].scrollIntoView();
            sendResponse({"videos_settings": JSON.stringify(settings)})
        } else {
            sendResponse({"videos_settings": JSON.stringify([])})
        }
    }
    else if(request !== undefined && request.curr_time !== undefined){
        videos[curr_video].currentTime = request.curr_time
        settings[curr_video].curr_time = request.curr_time
    }
    else if(request !== undefined && request.get_curr_time !== undefined){
        // while(videos.length === 0 && settings.length !== 0){
        //     sleepFor(100)
        // }
        // console.log("2", videos)
        sendResponse({"get_curr_time": JSON.stringify(videos[curr_video].currentTime)})
    }
})