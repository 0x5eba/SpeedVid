document.addEventListener('DOMContentLoaded', function () {

    var inputs = document.getElementById('inputs').getElementsByTagName('input')
    var curr_speed = "x1"
    var curr_video = "0"

    function changeHandlerSpeed(event) {
        curr_speed = this.value
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: 'changeSpeed', "speed": curr_speed}, function(message){
                console.log(message)
            })
        })
    }
    function changeHandlerVideo(event) {
        curr_video = this.value
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: 'changeVideo', "video": curr_video}, function(message){
                console.log(message)
            })
        })
    }
    Array.prototype.forEach.call(inputs, function(radio) {
        radio.addEventListener('change', changeHandlerSpeed);
    });

    function getAllVideos(){
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: 'getAllVideos'}, function(message){
                let tot_videos = message.tot_videos

                let div = document.createElement("div")
                div.id = "videos"
                div.style.marginTop = "10px"
                let label = document.createElement("label")
                if(tot_videos > 0){
                    label.innerHTML = "video: "
                } else {
                    label.innerHTML = "No video found"
                }
                
                div.append(label)
                for(let a = 0; a < tot_videos; ++a){
                    let inp = document.createElement("input")
                    inp.type = "Radio"
                    let name = (a+1).toString()
                    inp.value = (a).toString()
                    inp.name = "numVideo"

                    if(a == 0){
                        inp.checked = true
                    }

                    inp.addEventListener('change', changeHandlerVideo);

                    let label = document.createElement("label")
                    label.innerHTML = name

                    div.append(inp, label)
                }
                document.getElementById("root").append(div)
            })
        })
    }
    getAllVideos()
}, false)