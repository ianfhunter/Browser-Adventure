
function module_populate(module){
    quest_name = module.getElementsByTagName("meta")[0].attributes.name.value
    // console.log(quest_name)
    //  FOR all active quests
    content = "<li class='quest-title'><a href='#'>"
    content += quest_name
    content += "</a></li>"
    
    $("#quest-journal-list").html(content)
};

function initialize_ui(player){
    update_gold()
    update_hp()
}
function update_gold(){
    g = window.player.inventory["gold"]
    if (g != undefined){
        g = parseInt(g)
    }else{
        g = 0
    }
    $("#gold")[0].innerHTML = g
}
function update_hp(){
    $("#current_hp")[0].innerHTML = parseInt(window.player.current_hp)
    $("#remaining_hp")[0].innerHTML = parseInt(window.player.max_hp)
}
function update_bag(){
    // TODO:
}

class Player {
    constructor() {
        this.name = 'Aura';
        this.avatar = 'img/avatar/default_hero.webp';
        this.inventory = {"gold": 0};
        this.current_hp = 4
        this.max_hp = 4
    }
}

function showEvent(event_text){
    // Note: We insert these logically backwards
    container.innerHTML =`
        <div class="chat">
            <div class="eventbubble"> 
                <div class="dialog">`+
                    event_text + `
                </div>
            </div>
        </div>
    ` + container.innerHTML
}

function showMessage(text_node){
    msg = text_node.innerHTML
    msg = $.trim(msg)
    container = $("#chat-container")[0]

    console.log(text_node)
    
    speaker = text_node.getAttribute("speaker")
    if (speaker != undefined){
        npc = document.mdl.querySelector(`npc[id='${speaker}']`)
        display_name = npc.getAttribute("name")
        avatar = npc.getAttribute("avatar")
        color = npc.getAttribute("color")
        frame_color = npc.getAttribute("frame")
    }else{
        display_name = "Narrator"
        avatar = "narrator.webp"
        color = "#583e05"
        frame_color = "#976b0c"
    }

    // TODO: Alternate Left + Right

    // Note: We insert these logically backwards
    container.innerHTML =`
        <div class="chat">
            <div class="avatar-box ">
                <span class="chat-name">${display_name}</span>
                <img class="avatar-img" src="img/avatars/${avatar}" style="border-color:${frame_color}" />
            </div>
            <div class="speechbubble"> 
                <div class="dialog dialog-left" style="background-color:${color}">`+
                    msg + `
                </div>
            </div>
        </div>
    ` + container.innerHTML

}

function NotImplemented(unknown_node){
    console.log("Not Implemented:", unknown_node)
}

function addNewMapInteraction(place_node){
    console.log(place_node)
    map = $(".battlemap-overlay")[0]
    placename = place_node.getAttribute("name")

    s = `location[name="${placename}"]`
    console.log(s)
    locale = document.mdl.querySelector(s)
    x = locale.getAttribute("x")
    y = locale.getAttribute("y")
    width = locale.getAttribute("width") | 1;
    height = locale.getAttribute("height") | 1;
    number = $(".battlemap-overlay").children().length + 1

    console.log(x,y,width,height,number,placename)
    //TODO: Nicely format hover text
    map.innerHTML += `<div class="battlemap-room" title="${placename}"style="--x:${x};--y:${y};--width:${width};--height:${height};" onclick="activateLocation('${placename}')" >${number}</div>`
}

function addItemToInventory(inventoryNode){
    what = inventoryNode.getAttribute("item")
    how_much = parseInt(inventoryNode.getAttribute("amount"))

    console.log(inventoryNode)
    console.log(what, how_much)
    try {
        existing = parseInt(window.player.inventory[what])
    } catch (error) {
        existing = 0
    }
    window.player.inventory[what] = existing + how_much
    update_gold()
    update_bag()
    showEvent(`(${how_much}) ${what} added to inventory`)
}
function removeItemFromInventory(inventoryNode){
    what = inventoryNode.getAttribute("item")
    how_much = parseInt(inventoryNode.getAttribute("amount"))

    console.log(inventoryNode)
    console.log(what, how_much)
    try {
        existing = parseInt(window.player.inventory[what])
    } catch (error) {
        existing = 0
    }
    window.player.inventory[what] = existing - how_much
    
    if (window.player.inventory[what] <= 0){
        delete window.player.inventory[what]
    }
    // TODO: Remove 0 items.
    update_gold()
    update_bag()

    showEvent(`(${how_much}) ${what} removed from inventory`)
}
function changeLocation(redirect_node){
    map = redirect_node.getAttribute("map")
    entrance = redirect_node.getAttribute("entrance")
    console.log(map, entrance)

    s = 'map[name="'+map+'"]'
    console.log(s)
    new_map = document.mdl.querySelector(s)
    new_map_img = new_map.getAttribute("image")

    bm = $(".battlemap")[0] 
    bm.setAttribute("src", new_map_img)
    bmo = $(".battlemap-overlay")[0] 
    bmo.innerHTML = ""

    locs = $(new_map).children("location")
    for (var i = 0; i != locs.length; i++){
        hidden = locs[i].getAttribute("hidden")
        if(!hidden){
            
            addNewMapInteraction(locs[i])
        }
    }

    // TODO: Show available locations
    activateLocation(entrance)
}

function activateLocation(locationName){
    // text = window.module.getElementsByTagName("location")
    s = 'location[name="'+locationName+'"]'
    place = document.mdl.querySelector(s)
    // events = place.querySelector("event")
    console.log("[Activated: "+locationName+"]")
    eventLookup = {
        "text":showMessage,
        "inventoryAdd": addItemToInventory,
        "inventoryRemove": removeItemFromInventory,
        "revealLocation": addNewMapInteraction,
        "changeMap": changeLocation,
    }
    
    for(var i = 0; i != place.children.length; i++){
        child = place.children[i]
        f = eventLookup[child.tagName]
        if(f != undefined)
            f(child)
        else
            NotImplemented(child)    
    };
    // TODO: Turn mapbox grey after leaving
    // TODO: Turn mapbox yellow when active

}