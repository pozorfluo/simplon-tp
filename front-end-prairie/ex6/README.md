# CSS 3 : Le responsive !
Notre site est presque près, il ne nous reste plus qu'a l'adapter pour les support mobiles. Afin de tester votre travail vous pouvez utiliser le mode "vue adaptative" de chrome et de firefox.

---
1. Mise en place du responsive
Pour gérer le responsive il faut dans un premier temps ajouter la balise meta "viewport" dans le head de la page. Cette balise indiquera au navigateur comment le site doit etre adapté.

Exercice : Mettez en place la balise meta viewport.

2. Version tablette
Il y a peu de travail pour la version tablette. Suivez les règles suivantes, à partir d'une résolution de 768px de large :

* Augmenter légèrement la taille du texte dans le menu, le aside et le corp de l'article
* Faire que la balise <aside> soit placé en dessous de l'article (attention a ce que le footer ne cache pas le contenu si la hauteur n'est pas suffisante)
* L'image dans l'article doit prendre 50% de la largeur
* Pour gérer la taille des polices en responsive il est conseillé d'utiliser l'unité "em", "rem" ou "%"

Exercice : Suivez les règles définies ci-dessus et mettez en place la version tablette.

3. Version Smartphone
Pour la version smartphone il reste encore un peu de travail. Suivez les règles suivantes, à partir de 630px de large

* Le menu doit disparaitre (nous réaliserons un menu hamburger avec jquery plus tard)
* L'image de l'article doit prendre toute la largeur
* Pour cacher un élément on utilise la propriété display

Exercice : Suivez les règles défini ci-dessus et mettez en place le responsive pour les smartphones.

---
La suite : [JQuery démarrage](https://github.com/simplon-roanne/front-end-prairie/tree/master/ex7)