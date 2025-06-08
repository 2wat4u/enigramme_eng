// Variables globales
let mots = [];
let motActuel = "";

// Charger les mots depuis le fichier JSON
fetch('words_eng.json')
    .then(response => response.json())
    .then(data => {
        mots = data.words; // Stocker les mots
        console.log("Mots chargés :", mots);
        lancerMot(); // Lancer une première question automatiquement
    })
    .catch(error => console.error("Erreur de chargement du fichier JSON :", error));

// Fonction pour afficher la définition avec un effet fade-in
function afficherDefinition(definition) {
    const definitionElement = document.getElementById('definition');
    definitionElement.textContent = definition;
    definitionElement.classList.add('fade-in');
    setTimeout(() => {
        definitionElement.classList.remove('fade-in');
    }, 1000); // Durée de l'animation
}

// Fonction pour choisir un mot aléatoire et afficher ses détails
function lancerMot() {
    const niveau = document.getElementById('niveau').value || "tous";
    const groupe = document.getElementById('groupe').value || "tous";

    const motsFiltres = mots.filter(mot => {
        return (
            (niveau === "tous" || mot.niveau === niveau) &&
            (groupe === "tous" || mot.groupe === groupe)
        );
    });

    if (motsFiltres.length > 0) {
        const motChoisi = motsFiltres[Math.floor(Math.random() * motsFiltres.length)];
        motActuel = motChoisi.nom;

        // Animation pour la définition
        afficherDefinition(motChoisi.def);

        // Animation pour l'anagramme
        const anagrammeElement = document.getElementById('anagramme');
        anagrammeElement.textContent = melangerMot(motChoisi.nom);
        anagrammeElement.classList.add('fade-in');
        setTimeout(() => {
            anagrammeElement.classList.remove('fade-in');
        }, 1000); // Durée de l'animation
    } else {
        document.getElementById('definition').textContent = "No word found for these criteria.";
        document.getElementById('anagramme').textContent = "???";
        motActuel = "";
    }
}

// Fonction pour mélanger les lettres d'un mot (générer une anagramme)
function melangerMot(mot) {
    return mot.split('').sort(() => Math.random() - 0.5).join('').toUpperCase();
}

// Fonction pour afficher une icône de validation ou erreur
function afficherIconeValidation(isCorrect) {
    const validationIcon = document.getElementById('validation-icon');

    if (isCorrect) {
        validationIcon.className = "icon success"; // Afficher le crochet
        validationIcon.textContent = "✔"; // Symbole de succès
    } else {
        validationIcon.className = "icon error"; // Afficher le X
        validationIcon.textContent = "✖"; // Symbole d'erreur
    }

    validationIcon.style.opacity = "1"; // Afficher l'icône
    setTimeout(() => {
        validationIcon.style.opacity = "0"; // Cacher l'icône après 1 seconde
    }, 1000);
}

// Fonction pour vérifier la réponse de l'utilisateur
function verifierReponse() {
    const inputSection = document.getElementById("input-section");
    const guess = document.getElementById('guess').value.trim().toLowerCase();

    if (motActuel && guess === motActuel.toLowerCase()) {
        afficherIconeValidation(true); // Afficher l'icône de succès
        document.getElementById('guess').value = ""; // Vider le champ d'entrée
        lancerMot(); // Générer une nouvelle question
    } else {
        afficherIconeValidation(false); // Afficher l'icône d'erreur

        // Ajouter une animation de "shake" au conteneur
        inputSection.classList.add('shake');
        setTimeout(() => {
            inputSection.classList.remove('shake'); // Retirer l'animation après 500ms
        }, 500);

        document.getElementById('guess').value = ""; // Réinitialiser l'input
    }

    // Remettre le focus sur l'input
    document.getElementById('guess').focus();
}

// Fonction pour sauter la question
function sauterQuestion() {
    document.getElementById('guess').value = ""; // Réinitialiser l'input
    lancerMot(); // Générer une nouvelle question

    // Remettre le focus sur l'input
    document.getElementById('guess').focus();
}

// Fonction pour réinitialiser le jeu lors du changement de niveau ou de groupe
function resetJeu() {
    motActuel = ""; // Réinitialiser le mot actuel
    document.getElementById('definition').textContent = "";
    document.getElementById('anagramme').textContent = "";
    lancerMot(); // Relancer une nouvelle question automatiquement

    // Remettre le focus sur l'input
    document.getElementById('guess').focus();
}

// Raccourci clavier : Appuyer sur "Entrée" pour valider
document.getElementById('guess').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        verifierReponse();
    }
});

// Gestionnaires d'événements pour le jeu
document.getElementById('valider').addEventListener('click', verifierReponse);
document.getElementById('sauter').addEventListener('click', sauterQuestion);

// Gestionnaires pour le changement de niveau et de groupe
document.getElementById('niveau').addEventListener('change', resetJeu);
document.getElementById('groupe').addEventListener('change', resetJeu);
