function getRandomPlace(obj){
    let keys = Object.keys(obj);
    let randomKey = keys[Math.floor(Math.random() * keys.length)];
    return randomKey
}

function distance(x1,y1,x2,y2){
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2)
}

function defineLocations(){ // ?locations=location1,location2
    let mapItems={"Salal":[214,117],"Bhakra Nangal":[246,158],"Tehri":[292,206],"Rana Pratap Sagar":[223,338],"Sardar Sarovar":[164,438],"Hirakud":[417,444],"Nagarjuna Sagar":[302,576],"Tungabhadra":[235,588],"Namrup":[701,263],"Singrauli":[382,364],"Ramagundam":[313,506],"Narora":[296,256],"Kakrapara":[161,441],"Tarapur":[156,485],"Kalpakkam":[328,667],"Noida":[272,241],"Gandhinagar":[134,380],"Mumbai":[160,501],"Pune":[175,510],"Hyderabad":[291,550],"Bengaluru":[261,671],"Chennai":[333,663],"Thiruvananthapuram":[248,779],"Kandla":[80,389],"Marmagao":[180,603],"New Mangalore":[206,668],"Kochi":[238,750],"Tuticorin":[274,776],"Vishakhapatnam":[413,534],"Paradip":[490,463],"Haldia":[520,421],"Amritsar(Raja Sansi - Sri Gurum Dass jee)":[218,153],"Delhi(Indira Gandhi)":[259,242],"Mumbai(Chhatrapati Shivaji)":[159,495],"Chennai(Meenam Bakkam)":[329,666],"Kolkata(Netaji Subhash Chandra Bose)":[529,401],"Hyderabad(Rajiv Gandhi)":[295,549]};
    for (let [place,cord] of Object.entries(mapItems)){
        mapItems[place]=[cord[0]-40,cord[1]-5]
    }
    let newItems = {"Indore":[189,402],"Surat":[118, 447],"Kanpur":[ 306, 287],"Coimbatore":[214, 714],"Durgapur":[ 478, 376],"Bokaro":[ 437, 369],"Jamshedpur":[442, 400],"Bhilai":[324, 442],"Vijayanagar":[202, 596],"Salem":[ 245, 686]}
    mapItems = {...mapItems, ...newItems};

    if (window.location.search.startsWith("?locations=")){ 
        const arg = window.location.search.replace("%20"," ").split("?locations=")[1] //[location1,location2], space in urlbecomes %20  
        locations = arg.split(',') //array of asked loactions
        for (let [place,cord] of Object.entries(mapItems)){
            if (!locations.includes(place)){delete mapItems[place]}
        }
    }
    return mapItems;

}

document.addEventListener("DOMContentLoaded", function() {
    let nitemsDone = 0
    let mapItems = defineLocations();
    let totalLocations = Object.keys(mapItems).length;
    let score =0;
    let dot = null;
    // let factor = screen.height/1080;
    let factor = screen.width/1920;
    imageMap.width = 707*factor
    imageMap.height = 796*factor
    for (let [place,cord] of Object.entries(mapItems)){
        mapItems[place]=[cord[0]*factor,cord[1]*factor]
    }
    imageMap.addEventListener("click", function(event) {
        let imageMapRect = imageMap.getBoundingClientRect();
        let imageMapLeft = imageMapRect.left + window.scrollX;
        let imageMapTop = imageMapRect.top + window.scrollY;
        if (submitBtn.innerHTML == "START" || submitBtn.disabled===true){return}
        if (dot) {
            dot.remove();
        }
        let x = event.offsetX;
        let y = event.offsetY;
        dot = document.createElement("div");
        dot.className = "dot";
        dot.style.left = (x + imageMapLeft) + "px";
        dot.style.top = (y + imageMapTop) + "px";
        imageMap.parentNode.appendChild(dot); 
    });

    submitBtn.addEventListener("click", function() {
        if (submitBtn.innerHTML==="RESTART"){
            location.reload(); 
        }
        let imageMapRect = imageMap.getBoundingClientRect();
        let imageMapLeft = imageMapRect.left + window.scrollX;
        let imageMapTop = imageMapRect.top + window.scrollY;
        let ansX=null;
        let ansY=null;
        if (submitBtn.innerHTML == "START"){submitBtn.innerHTML = "SUBMIT"}
        if (markHeading.textContent.startsWith("Mark")){
            nitemsDone ++;
            let askedPlace = markHeading.textContent.slice(5)
            ansX = mapItems[askedPlace][0]
            ansY = mapItems[askedPlace][1]
            let ansDot = document.createElement("div");
            ansDot.className = "ansDot";
            ansDot.style.left = (ansX + imageMapLeft) + "px";
            ansDot.style.top = (ansY + imageMapTop) + "px";
            imageMap.parentNode.appendChild(ansDot); 
            delete mapItems[askedPlace];
            submitBtn.disabled = true;
            setTimeout(function(){
                submitBtn.disabled = false;
                ansDot.remove();
                if (dot){dot.remove();}
                if (Object.keys(mapItems).length === 0){
                    submitBtn.innerHTML = "RESTART"
                    markHeading.textContent = "Score: " + score +"/"+totalLocations+". Press restart to try again!";
                }else{
                    place = getRandomPlace(mapItems);
                    markHeading.textContent = "Mark " + place;
                }
            }, 2500);
        }else{
        place = getRandomPlace(mapItems);
        markHeading.textContent = "Mark " + place;
        }

        if (dot) {
            let userX = parseFloat(dot.style.left.slice(0,-2)) - imageMapLeft;
            let userY = parseFloat(dot.style.top.slice(0,-2)) - imageMapTop;
            if (distance(userX,userY,ansX,ansY)<50){score+=1;}
            scorePanel.innerHTML = `Score: ${score}/${nitemsDone}`
        }
    });
});
