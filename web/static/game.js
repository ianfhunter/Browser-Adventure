
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
    newGold = parseInt(window.player.inventory["gold"])
    $("#gold")[0].innerHTML = newGold
}
function update_hp(){
    $("#current_hp")[0].innerHTML = parseInt(window.player.current_hp)
    $("#remaining_hp")[0].innerHTML = parseInt(window.player.max_hp)
}
function update_bag(){
    // TODO:
    // $("#item-bag")[0].innerHTML(

    // )
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

function showMessage(text_node){
    msg = text_node.textContent
    msg = $.trim(msg)
    container = $("#chat-container")[0]

    // TODO: Alternate Left + Right

    // Note: We insert these logically backwards
    container.innerHTML =`
        <div class="chat">
            <div class="avatar-box ">
                <span class="chat-name">Narrator</span>
                <img class="avatar-img" src="img/avatars/narrator.webp" />
            </div>
            <div class="speechbubble"> 
                <div class="dialog dialog-left">`+
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
    map.innerHTML += `<div class="battlemap-room" style="--x:${x};--y:${y};--width:${width};--height:${height};" onclick="activateLocation('${placename}')" >${number}</div>`
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
}

function activateLocation(locationName){
    // text = window.module.getElementsByTagName("location")
    s = 'location[name="'+locationName+'"]'
    place = document.mdl.querySelector(s)
    // events = place.querySelector("event")

    eventLookup = {
        "text":showMessage,
        "inventoryAdd": addItemToInventory,
        "inventoryRemove": removeItemFromInventory,
        "revealLocation": addNewMapInteraction,
    }
    
    for(var i = 0; i != place.children.length; i++){
        child = place.children[i]
        // eventLookup[child.tagName](child)
        try {
            eventLookup[child.tagName](child)
        } catch (error) {
            NotImplemented(child)
        }        
    };
}