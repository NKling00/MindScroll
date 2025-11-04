
import { ScrollForm } from '/js/scrollForm.js';
import { titleStory } from '/js/scenes/titleStory.js';
import { laptopPopScene } from '/js/scenes/laptopPopScene.js';      




const story2 = titleStory;
const story1 = laptopPopScene;

const stories = [story1,story2];

const element2 = document.getElementById('title_THREEBG');
const element1 = document.getElementById('laptopPopTHREE');
//console.log (element1);
const elements = [element1,element2];

//create scrollform
//instantiates scenes and assigns them to elements
document.addEventListener('DOMContentLoaded', () => { //wait for dom to load
    //to do :wait for each file to load
    const mindScroll = new ScrollForm(elements,stories);
});