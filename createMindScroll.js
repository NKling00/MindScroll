const scene1 = new titleStory();
const scene2 = new Scene2();
const scene3 = new Scene3();

const element1 = document.getElementById('canvas-container');
const element2 = document.getElementById('canvas-container');
const element3 = document.getElementById('canvas-container');

const mindScroll = new ScrollForm([element1,element2,element3],[scene1,scene2,scene3]);