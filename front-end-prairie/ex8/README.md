# JQuery : Menu hamburger !
Pour pouvoir accueillir nos visiteurs sur smartphone dignement, nous allons devoir mettre en place du javascript afin d'avoir un menu hamburger

---
1. Mise en place du bouton d'ouverture
* Mettez en place le bouton du menu hamburger dans l'entête en utilisant l'image fournie (à mettre dans votre dossier image). 
* Il doit apparaitre à gauche de la barre de navigation seulement sur la version smartphone, être sur fond blanc, arrondis et sans bordure. 
* Il doit aussi faire 30px de haut et doit etre fixé a 5px du haut de l'écran et 10px du bord gauche. 
* Ce bouton devra avoir comme id "open" afin de pouvoir le cibler précisément plus tard.

Exercice : Suivez les règles et mettez en place le bouton d'ouverture du menu hamburger.

2. Préparation du menu
Préparez le menu en suivant les règles ci-dessous uniquement pour la version smartphone

* Le menu devra passer par dessu tout les éléments de la page
* Le menu devra utiliser la balise <nav> existante
* Le menu devra faire toute la hauteur de la page, 250px de large sur fond noir, les éléments le composant devront etre les uns en dessous des autres.
* La liste de lien devra avoir une marge de 40px par rapport au haut de l'écran.
* Le menu devra etre fixé a gauche de la page
* Un bouton avec une croix devra apparaitre dans le menu sur la version smartphone (utilisez le caractère × (multiplication) pour la croix). Le texte sera en blanc, sur fond transparent avec aucune bordure et placé a 10px du coin haut droite du menu. Le texte devra etre suffisament grand pour que le clic soit facile. Ce bouton devra avoir l'id "close".
* Le menu devra etre caché par défaut grâce a une translation de 250px vers la gauche.
* Le menu avoir une transition sur la propriété transform. (ça nous servira a animer l'ouverture plus tard)
* Pour faire passer des élément au dessus ou en dessous de d'autres il faut utiliser la propriété z-index.
* Pour revenir à la valeur par défaut de la propriété height ou width, vous devez utiliser la valeur "auto". (Exemple : "height:auto;")
* Dans ce contexte, il est conseillé d'utilise l'unité "vh" pour la hauteur du menu.

Exercice : Suivez les règles et mettez en place le menu pour smartphone.

3. Préparation de l'état ouvert du menu
Afin de pouvoir ouvrir le menu, nous allons devoir créer un état ouvert dans le CSS avant de passer sur la partie javascript. Pour gérer cet état nous allons utiliser une classe que nous allons nommer "open". Quand cette classe sera ajouté a la balise <nav> le menu devra apparaitre sur la page. Pour ce faire la valeur de transform pour la translation devra etre remise a zéro.

Exercice : Suivez les règles et mettez en place l'état ouvert. Pour tester, ajoutez seulement la classe "open" a l'élément <nav>

4. Mise en place du javascript
Créez votre fichier main.js dans le dossier js et chargez le dans VOS fichiers html avec la balise <script>
Votre code devra attendre que la page soit prête puis :

* Le clic sur l'élément avec l'id open doit ouvrir le menu en ajoutant la classe open a l'élément <nav>
* Le clic sur l'élément avec l'id close doit fermer le menu en retirant la classe open a l'élément <nav>

Pour attendre que les éléments de la page soient prêt a etre manipuler via du javascript, utilisez la fonction _ready_.

Exercice : Suivez les règles et finalisez la mise en place du menu hamburger

---
La suite : [HTML Le SEO](https://github.com/simplon-roanne/front-end-prairie/tree/master/ex9)