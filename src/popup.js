document.addEventListener('DOMContentLoaded', function () {
    var tot_video = 0
    var curr_video = 0
    var videos_settings = []
    var setting = {
        duration: 0,
        curr_time: 0,
        paused: false,
        volume: 1,
        speed: 1,
    }

    var curr_setting = JSON.parse(JSON.stringify(setting))

    function sendMessage(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {"curr_setting": curr_setting}, function(response) {});
        });
    }

    function sendCurrTime(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {"curr_time": curr_setting.curr_time}, function(response) {});
        });
    }

    $("#slider_speed").slider()
    $("#slider_speed").on("slide", function(slideEvt) {
        let val = slideEvt.value
        $("#speed").text(val.toFixed(1))
        curr_setting.speed = parseFloat(val.toFixed(1))
        sendMessage()
    })

    $("#slider_timer").slider()
    $("#slider_timer").on("slide", function(slideEvt) {
        let val = slideEvt.value
        $("#timer").text(val)
        curr_setting.curr_time = parseInt(val)
        sendCurrTime()
    })

    $("#slider_volume").slider()
    $("#slider_volume").on("slide", function(slideEvt) {
        let val = slideEvt.value*100
        $("#volume").text(parseInt(val))
        curr_setting.volume = parseFloat(slideEvt.value)
        sendMessage()
    })

    document.getElementById("btn-pause").onclick = function() {
        document.getElementById("btn-pause").style.display = "none"
        document.getElementById("btn-play").style.display = "block"
        curr_setting.paused = true
        sendMessage()
    }

    document.getElementById("btn-play").onclick = function() {
        document.getElementById("btn-play").style.display = "none"
        document.getElementById("btn-pause").style.display = "block"
        curr_setting.paused = false
        sendMessage()
    }

    document.getElementById("btn-forward").onclick = function() {
        curr_setting.curr_time += 30
        curr_setting.curr_time = Math.min(curr_setting.curr_time, videos_settings[curr_video].duration)
        sendCurrTime()
    }

    document.getElementById("btn-back").onclick = function() {
        curr_setting.curr_time -= 30
        curr_setting.curr_time = Math.max(curr_setting.curr_time, 0)
        sendCurrTime()
    }

    function getIdxCurrVideo(){
        let select = document.getElementById("btns-videos")
        let inputs = select.querySelectorAll('input')
        for(let a = 0; a < inputs.length; ++a){
            if(inputs[a].checked === true){
                return a
            }
        }
        return -1
    }

    function addVideo(first, checked){
        let select = document.getElementById("btns-videos")
        let label = document.createElement("label")
        let input = document.createElement("input")
        input.type = "radio"
        input.name = "dark"
        if(checked === true){
            input.checked = true
        }
        let span = document.createElement("span")
        span.className = "design"
        // if(first === true){
        //     span.style.marginRight = "0px"
        // }
        label.appendChild(input)
        label.appendChild(span)
        select.appendChild(label)
    }

    function changeVideoSettings(curr_setting2){
        $("#slider_timer").slider("destroy")
        $("#slider_timer").slider({
            min: 0,
            max: curr_setting2.duration,
            step: 1,
            value: curr_setting2.curr_time,
        })
        $("#slider_timer").on("slide", function(slideEvt) {
            let val = slideEvt.value
            $("#timer").text(parseInt(val))
            curr_setting.curr_time = parseInt(val)
            sendCurrTime()
        })

        $("#slider_volume").slider("destroy")
        $("#slider_volume").slider({
            min: 0,
            max: 1,
            step: 0.01,
            value: curr_setting2.volume,
        })
        $("#slider_volume").on("slide", function(slideEvt) {
            let val = slideEvt.value*100
            $("#volume").text(parseInt(val))
            curr_setting.volume = parseFloat(slideEvt.value)
            sendMessage()
        })

        $("#slider_speed").slider("destroy")
        $("#slider_speed").slider({
            min: 0.1,
            max: 3.0,
            step: 0.1,
            value: curr_setting2.speed,
        })
        $("#slider_speed").on("slide", function(slideEvt) {
            let val = slideEvt.value
            $("#speed").text(val.toFixed(1))
            curr_setting.speed = parseFloat(val.toFixed(1))
            sendMessage()
        })

        $("#speed").text(parseFloat(curr_setting2.speed))
        $("#timer").text(parseInt(curr_setting2.curr_time))
        $("#volume").text(parseInt(curr_setting2.volume*100))
        $("#max_time").text(parseInt(curr_setting2.duration))

        if(curr_setting2.paused === false){ 
            document.getElementById("btn-play").style.display = "none"
            document.getElementById("btn-pause").style.display = "block"
        } else {
            document.getElementById("btn-play").style.display = "block"
            document.getElementById("btn-pause").style.display = "none"
        }
    }

    setTimeout(function(){ 
        // chrome.storage.sync.get("curr_video", function(storage){
        //     if(storage !== undefined && storage.curr_video !== undefined){
        //         curr_video = parseInt(storage.curr_video)
        //     } else {
        //         curr_video = 0
        //     }
        // })

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {"get_settings": true}, function(storage) {
                if(storage !== undefined && storage.videos_settings !== undefined){
                    videos_settings = JSON.parse(storage.videos_settings)

                    tot_video = videos_settings.length

                    for(let a = 0; a < tot_video; ++a){
                        addVideo(a === 0, a === curr_video)
                    }
                    
                    if(tot_video === 0){
                        document.getElementById("root").style.display = "none"
                        document.getElementById("root2").style.display = "block"
                    } else {
                        document.getElementById("root").style.display = "block"
                        document.getElementById("root2").style.display = "none"
                        
                        curr_setting = videos_settings[curr_video]
                        changeVideoSettings(curr_setting)
                    }
                }
            })
        })

        window.setInterval(function(){
            new_curr_video = getIdxCurrVideo()
            if(new_curr_video !== curr_video){
                curr_video = new_curr_video
                chrome.storage.sync.set({"curr_video": curr_video}, function() {})
            }
        }, 500);

        window.setInterval(function(){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {"get_curr_time": true}, function(storage) {
                    if(storage !== undefined && storage.get_curr_time !== undefined){
                        let val = parseInt(JSON.parse(storage.get_curr_time))
                        $("#timer").text(val)
                        curr_setting.curr_time = val

                        // $("#slider_timer").slider("destroy")
                        // $("#slider_timer").slider({
                        //     min: 0,
                        //     max: curr_setting.duration,
                        //     step: 1,
                        //     value: curr_setting.curr_time,
                        // })
                        // $("#slider_timer").on("slide", function(slideEvt) {
                        //     let val2 = parseInt(slideEvt.value)
                        //     $("#timer").text(val2)
                        //     curr_setting.curr_time = val2
                        //     sendCurrTime()
                        // })
                    }
                })
            })
        }, 300)

    }, 500)

}, false)