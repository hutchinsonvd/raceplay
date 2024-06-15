//so simple html webpage

//it auto loads a picture from dataset
//user has a scroll bar with all the possible nationalities to choose

var TEST_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Bundesarchiv_Bild_183-1985-0810-023,_Christine_Wachtel,_Hildegard_Körner-Ullrich.jpg/200px-Bundesarchiv_Bild_183-1985-0810-023,_Christine_Wachtel,_Hildegard_Körner-Ullrich.jpg";


function getNextImage() {
    console.log("here");
    document.getElementById("image").src = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Melania_Mazzucco.jpg/200px-Melania_Mazzucco.jpg";
}
