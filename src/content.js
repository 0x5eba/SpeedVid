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

    return videos
}

var videos = getAllVideos()

function update(videos){
    function sleepFor(sleepDuration){
        var now = new Date().getTime();
        while(new Date().getTime() < now + sleepDuration){} 
    }

    settings = []
    for(let a = 0; a < videos.length; ++a){
        while(true){
            if(videos[a].duration === null){
                sleepFor(100)
            }
            break
        }
        let sett = JSON.parse(JSON.stringify(setting))
        sett.src = videos[a].src + " - " + videos[a].currentSrc
        sett.duration = videos[a].duration
        sett.curr_time = videos[a].currentTime
        sett.paused = videos[a].paused
        sett.volume = videos[a].volume
        sett.speed = videos[a].playbackRate
        settings.push(sett)
    }

    // chrome.storage.sync.set({"videos_settings": JSON.stringify(settings)}, function() {})
}

window.setInterval(function(){
    update(videos)
}, 1000);

chrome.storage.onChanged.addListener(function(changes, area) {
    if(area === "sync"){
        if(changes.curr_video !== undefined){
            curr_video = changes.curr_video.newValue
        }
    }
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request !== undefined && request.curr_setting !== undefined){
        let curr_setting = request.curr_setting
        // videos[curr_video].currentTime = curr_setting.curr_time
        videos[curr_video].volume = curr_setting.volume
        videos[curr_video].playbackRate = curr_setting.speed

        console.log(curr_setting)

        if(curr_setting.paused === true){
            videos[curr_video].pause()
        } else {
            videos[curr_video].play()
        }
    }

    if(request !== undefined && request.get_settings !== undefined){
        sendResponse({"videos_settings": JSON.stringify(settings)})
    }
})