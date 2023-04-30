/* TODO: inserite il codice JavaScript necessario a completare il MHW! */

/*query selector, sali al section genitore, if diversa da eventcurrenttarget deseleziona*/
let answerlist = [null, null, null];

/*Codice scritto per il mhw3*/

function getRandomInt(min,max) { 
    //crea un intero randomico
    var rand_int= Math.floor(Math.random() * (max - min) + min);
    return rand_int;
}

//PokeAPI

function onPokemonJson(json){  //uso l'api per cercare immagini di pokemon casuali tra tutti gli esistenti
    console.log(json);
    const pokemon = json.sprites.other["official-artwork"].front_default;
    return pokemon;
}

function onResponse(response){
    return response.json();
}
  
function getPokemon(){
    for(let box of answers){
        const id = getRandomInt(1,1008);
        fetch('https://pokeapi.co/api/v2/pokemon/'+ id
        ).then(onResponse).then(onPokemonJson).then((pokemon) => {
            img = box.querySelector(".pokemon");
            img.src = pokemon;
        });
    }
}

//gfycat API

function onGifJson(json){
    console.log(json);
    const gif = document.querySelector('#gif');
    const random = getRandomInt(0,10);
    console.log("your random gif is " + random);
    
    gif.src = json.gfycats[random].gif100px;
  }

function onTokenJson(json)
{
  console.log(json)
  // Imposta il token 
  token = json.access_token;
}

const id = '2_BHXu5Q';
const secret = 'ZAwbk56_5QAvFUyDaf0oEz__An7vJ1Bn28ep44da3cjvKrUB6xSNvAIecqmUDDW3';
const set_body = {
    client_id : id,
    client_secret : secret,
    grant_type : 'client_credentials',
}

let request_body = JSON.stringify(set_body);
console.log(request_body);


let token;

fetch("https://api.gfycat.com/v1/oauth/token",
	{
   method: "post",
   headers: {
    "Content-Type": "application/json",
  },
   body: request_body,  
  }
).then(onResponse).then(onTokenJson);

/*Codice preso dal mhw2*/

function resetQuiz(){
    for (let box of answers) {
        box.addEventListener('click', select);
        box.classList.remove('selected');
        box.classList.remove('unselected');
        const Check = box.querySelector(".checkbox");
            Check.src = "images/unchecked.png";
    }
    answerlist = [null, null, null];
    const resultbox = document.querySelector('#result');
    resultbox.classList.add('hidden');
    getPokemon();

}

function Makechoice(question, choice){
    if (question === "one") {
        answerlist[0] = choice;
    }
    else if (question === "two") {
        answerlist[1] = choice;
    }
    else if (question === "three") {
        answerlist[2] = choice;
    }
    console.log(answerlist);
}

function isQuizOver(){
    for(let answer of answerlist){
        if(answer === null){
            return false;
        }        
    }
    return true;
}

function calcResult(){
    if (answerlist[0] === answerlist[1] || answerlist[0] === answerlist[2]) {
        return answerlist[0];
    }
    else if (answerlist[1] === answerlist[2]) {
        return answerlist[1];
    }
    else {
        return answerlist[0];
    }
}

function showResult(result) {
    const htmltitle = document.querySelector('#title');
    const htmlcontents = document.querySelector('#contents');
    const tag = RESULTS_MAP[result].tag_Name;

    fetch("https://api.gfycat.com/v1/reactions/populated?tagName=" + tag,
    {
    headers:
        {
        Authorization: 'Bearer ' + token
        }
    }).then(onResponse).then(onGifJson);
    
    htmltitle.textContent = RESULTS_MAP[result].title;
    htmlcontents.textContent = RESULTS_MAP[result].contents;
    
    const resultbox = document.querySelector('#result');
    resultbox.classList.remove('hidden');
    for (let box of answers) {
        box.removeEventListener('click', select);
    }

}

function select(event) {
    const target = event.currentTarget;
    const check = target.querySelector(".checkbox");
    check.src = "images/checked.png";
    target.classList.add('selected');
    target.classList.remove('unselected');
    
    const parent = target.parentNode;
    const children = parent.querySelectorAll('div');
    for (let child of children) {
        if(child !== target) {
            child.classList.add('unselected');
            child.classList.remove('selected');
            const childCheck = child.querySelector(".checkbox");
            childCheck.src = "images/unchecked.png";
        }
    }
    Makechoice(target.dataset.questionId, target.dataset.choiceId);
    if (isQuizOver() === true) {
        const shownresult = calcResult();
        showResult(shownresult);

    }
}

const answers = document.querySelectorAll( '.choice-grid div');

getPokemon();

for (let box of answers) {
    box.addEventListener('click', select);
}

const button = document.querySelector('#button');
button.addEventListener('click', resetQuiz);





