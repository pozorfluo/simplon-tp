USE exoVilles;

-- Obtenir la liste des 10 villes les plus peuplées en 2012
SELECT
    `ville_nom`
FROM 
    `villes_france_free` 
ORDER BY 
    `ville_population_2012` DESC 
LIMIT 
    10;

-- Obtenir la liste des 50 villes ayant la plus faible superficie
SELECT
    `ville_nom`
FROM 
    `villes_france_free`
ORDER BY 
    `ville_surface` ASC
LIMIT 
    50;

-- Obtenir la liste des départements d’outres-mer, c’est-à-dire ceux dont le 
-- numéro de département commencent par “97”
SELECT
    `departement_nom`
FROM 
    `departement`
WHERE 
    `departement_code` LIKE '97%'
ORDER BY 
    `departement_nom` ASC;

-- Obtenir le nom des 10 villes les plus peuplées en 2012, ainsi que le nom du 
-- département associé
SELECT
    `ville_nom`,
    `ville_departement`,
    `departement_nom`
FROM 
    `departement` 
LEFT JOIN
    `villes_france_free` ON `ville_departement` = `departement_code`
ORDER BY 
    `ville_population_2012` DESC 
LIMIT 
    10;

-- Obtenir la liste du nom de chaque département, associé à son code et du 
-- nombre de commune au sein de ces département, en triant afin d’obtenir en 
-- priorité les départements qui possèdent le plus de communes
SELECT
    `ville_departement`,
    `departement_nom`,
    COUNT(*) AS `nombre_communes`
FROM 
    `departement` 
LEFT JOIN
    `villes_france_free` ON `ville_departement` = `departement_code`
GROUP BY
    `ville_departement`
ORDER BY 
    `nombre_communes` DESC;

-- Obtenir la liste des 10 plus grands départements, en terme de superficie
SELECT
    `ville_departement`AS `departement_code`,
    `departement_nom`,
    CONVERT(SUM(ville_surface),DECIMAL(64,0)) AS `departement_superficie`
FROM 
    `departement` 
LEFT JOIN
    `villes_france_free` ON `ville_departement` = `departement_code`
GROUP BY
    `ville_departement`
ORDER BY 
    `departement_superficie` DESC
LIMIT 
    10;

-- Compter le nombre de villes dont le nom commence par “Saint”
SELECT
    COUNT(*) AS `nombre_communes_saint`
FROM 
    `villes_france_free`
WHERE 
    `ville_nom` LIKE 'Saint%';

-- Obtenir la liste des villes qui ont un nom existants plusieurs fois, et 
-- trier afin d’obtenir en premier celles dont le nom est le plus souvent utilisé 
-- par plusieurs communes
SELECT
    `ville_nom`,
    COUNT(*) AS `nombre_communes`
FROM 
    `villes_france_free`
GROUP BY
    `ville_nom`
ORDER BY 
    `nombre_communes` DESC;

-- Obtenir en une seule requête SQL la liste des villes dont la superficie 
-- est supérieur à la superficie moyenne
SELECT
    `ville_nom`,
    `ville_surface`
FROM 
    `villes_france_free` 
WHERE 
    `ville_surface` > (SELECT AVG(`ville_surface`) FROM `villes_france_free`)
ORDER BY 
    `ville_surface` DESC;

-- Obtenir la liste des départements qui possèdent plus de 2 millions 
-- d’habitants
SELECT 
    `ville_departement` AS `departement_code`,
    `departement_nom`,
    SUM(`ville_population_2012`) AS `departement_population_2012`
FROM 
    `villes_france_free`
LEFT JOIN
    `departement` ON `departement_code` = `ville_departement`
GROUP BY 
    `ville_departement`
HAVING 
    `departement_population_2012` > 2000000
ORDER BY 
    `departement_population_2012` DESC;

-- Remplacez les tirets par un espace vide, pour toutes les villes commençant 
-- par “SAINT-” (dans la colonne qui contient les noms en majuscule)

-- if they meant to update the table :
-- UPDATE 
--     `villes_france_free`

-- if they meant 'display' :
SELECT
    `ville_nom`,
    REPLACE(ville_nom, '-', ' ')
FROM 
    `villes_france_free`
WHERE 
    `ville_nom` LIKE 'Saint%';