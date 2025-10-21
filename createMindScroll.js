
import { ScrollForm } from '/js/scrollForm.js';
import { titleStory } from '/js/scenes/titleStory.js';
import { Scene2 } from '/js/scenes/scene2.js';



const story1 = titleStory;


const stories = [story1];

const element1 = document.getElementById('title_THREEBG');
console.log (element1);
const elements = [element1];

//create scrollform
//instantiates scenes and assigns them to elements
document.addEventListener('DOMContentLoaded', () => { //wait for dom to load
    //to do :wait for each file to load
    const mindScroll = new ScrollForm(elements,stories);
});