// first page function, transfers hand data to second page 
// via sessionStorage, changes window to second page
function getValue(){
    let hand = document.getElementById("hand_data").value;
    sessionStorage.setItem("hand", hand);
    window.location = "tablePage/table.html";
}

// initializations
let line = 0;
let finalSeatLine = 2;
let arr = [];
let arrTemp = [];
let pairs = {};

// maps number to the positions of where their box, name, button, and cards should go (indices)
// 0-1: box top, box left,
// 2-3: name top, name left,
// 4-5: btn top, btn left,
// 6-8: left/right card top, left card left, right card left
let locations = {
    0: ["5%","42%","2%","42.5%","18%","52%","0%","42.3%","48%"],// seat 1
    1: ["8%","58%","6%","58.5%","20%","56%","3%","58.5%","64.2%"],// seat 2
    2: ["25%","72%","22.5%","72.5%","30%","70%","19%","72.5%","78.2%"],// seat 3
    3: ["52%","73%","50%","73.5%","52%","70%","46.5%","73.5%","79.2%"],// seat 4
    4: ["70%","60%","68%","60.5%","71%","57.5%","65%","60.5%","66.2%"],// seat 5
    5: ["70%","25%","68%","25.5%","71%","38%","65%","25.5%","31.2%"],// seat 6
    6: ["52%","11%","50%","11.5%","50%","24%","46.5%","11.5%","17.2%"],// seat 7
    7: ["25%","12%","23%","12.5%","38%","24%","20%","12.5%","18.2%"],// seat 8
    8: ["8%","25%","6%","25.5%","23%","35%","3%","25.5%","31.2%"]// seat 9
}

// turns hand history into an array separated by newlines
function setArr(){
    let hand = sessionStorage.getItem("hand");
    arrTemp = hand.split('\n');
    for(let i = 0; i < arrTemp.length; i++){
        arr.push(arrTemp[i].split(' '));
    }
    setFinalSeatLine();
    right();

    // set attributes of box and name
    for(let i = 0; i < 9; i++){
        let percentages = locations[i];
        let boxShort = "box" + i.toString();
        let nameShort = "name" + i.toString();
        let cardLeft = "card" + i + 0;
        let cardRight = "card" + i + 1;
        // box
        document.getElementById(boxShort).style.display = "none"; // block
        document.getElementById(boxShort).style.backgroundColor = "lightblue";
        document.getElementById(boxShort).style.width = "12%";
        document.getElementById(boxShort).style.height = "12%";
        document.getElementById(boxShort).style.borderStyle = "solid";
        document.getElementById(boxShort).style.borderWidth = "large";
        document.getElementById(boxShort).style.borderColor = "black";
        document.getElementById(boxShort).style.position = "fixed";
        document.getElementById(boxShort).style.top = percentages[0];
        document.getElementById(boxShort).style.left = percentages[1];

        // name
        document.getElementById(nameShort).style.fontSize = "120%";
        document.getElementById(nameShort).style.position = "fixed";
        document.getElementById(nameShort).style.color = "black";
        document.getElementById(nameShort).style.top = percentages[2];
        document.getElementById(nameShort).style.left = percentages[3];

        // left card
        document.getElementById(cardLeft).style.display = "none";
        document.getElementById(cardLeft).style.height = "15%";
        document.getElementById(cardLeft).style.width = "5.5%";
        document.getElementById(cardLeft).style.position = "fixed";
        document.getElementById(cardLeft).style.top = percentages[6];
        document.getElementById(cardLeft).style.left = percentages[7];

        // right card
        document.getElementById(cardRight).style.display = "none";
        document.getElementById(cardRight).style.height = "15%";
        document.getElementById(cardRight).style.width = "5.5%";
        document.getElementById(cardRight).style.position = "fixed";
        document.getElementById(cardRight).style.top = percentages[6];
        document.getElementById(cardRight).style.left = percentages[8];
    }
}

// sets finalSeatLine to the final line for seating in arr
function setFinalSeatLine(){
    while(arr[finalSeatLine][0] == "Seat"){
        finalSeatLine++;
    }
    finalSeatLine--;
}

// "next" button is clicked
function right(){
    if(line >= arr.length) return;

    if(line <= 1){
        let s = "";
        let i = 0;
        while(arr[0][i] != "-"){
            s += arr[0][i] + " ";
            i++;
            // shouldnt ever go over 10
            if(i > 10) break;
        }
        document.getElementById("topLeft").innerHTML = s;
        i = 0;
        while(arr[1][i] != "Seat"){
            i++;
        }
        i++;
        s = arr[1][i].slice(1,arr[1][i].length);
        let btn = document.getElementById("btn");
        btn.style.top = locations[parseInt(s) - 1][4];
        btn.style.left = locations[parseInt(s) - 1][5];
        line = 2;
    }
    else if(line <= finalSeatLine){
        document.getElementById("btn").style.display = "block";
        line = 2;
        for(let i = line; i < finalSeatLine + 1; i++){
            let s = arr[i][1];
            let player = arr[i][2]

            let num = parseInt(s.slice(0, s.length - 1)) - 1;
            pairs[player] = parseInt(num);

            // name appears
            document.getElementById("name" + num).innerHTML = player;

            // block appears
            document.getElementById("box" + num).style.display = "block";

            // cards appear
            document.getElementById("card" + num + 0).style.display = "block";
            document.getElementById("card" + num + 1).style.display = "block";
        }
        line = finalSeatLine + 1;
    }
    else if(line <= finalSeatLine + 2){
        line = finalSeatLine + 1;

    }
}

function left(){
    alert(finalSeatLine);
}
