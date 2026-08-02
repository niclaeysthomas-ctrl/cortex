/* ================= TRANSFERT =================
   Le vrai muscle : reconnaître QUELLE grille s'applique à une
   situation réelle non étiquetée. Chaque cas propose 4 modèles ;
   un seul est le bon. `ref` pointe vers l'id de la grille.        */
const SCENARIOS = [
  { id:'t_reflex', dom:'Finance',
    txt:"Le cours d'une entreprise grimpe. Ce cours élevé lui permet de lever du capital à bas coût, de racheter des concurrents et d'attirer les meilleurs talents — ce qui améliore réellement ses fondamentaux, donc son cours.",
    options:["Réflexivité","Momentum de marché","Retour à la moyenne","Convexité"], correct:0, ref:'reflexivite',
    why:"La perception <b>agit</b> sur ce qu'elle observe : le prix modifie les fondamentaux qu'il est censé refléter. C'est une boucle réflexive (Soros), pas un simple momentum." },

  { id:'t_scaling', dom:'Sciences',
    txt:"Une ville double sa population. Pourtant son nombre de stations-service, de km de routes et de longueur de câbles ne croît que d'environ 1,8× — pas 2×.",
    options:["Loi de Benford","Lois d'échelle","Paradoxe de Simpson","Retour à la moyenne"], correct:1, ref:'scaling',
    why:"Les infrastructures suivent une loi de puissance sous-linéaire (~exposant 0,85) : plus une ville grossit, plus elle est efficiente par habitant. La taille change les règles." },

  { id:'t_fattails', dom:'Finance',
    txt:"Une banque calibre son risque sur 20 ans de données calmes (moyenne, écart-type). Survient un mouvement à « 25 écarts-types », théoriquement impossible avant la fin de l'univers. Elle saute.",
    options:["Moment Minsky","Malédiction du vainqueur","Extremistan (queues épaisses)","Retour à la moyenne"], correct:2, ref:'fat_tails',
    why:"En Extremistan, la variance peut être infinie : moyenne et écart-type calculés sur le passé calme ne bornent rien. Le « 25-sigma » n'est impossible que dans un monde gaussien qui n'existe pas ici." },

  { id:'t_simpson', dom:'Proba',
    txt:"Un traitement A guérit mieux que B chez les hommes, ET mieux que B chez les femmes. Pourtant, sur l'ensemble des patients, B affiche un meilleur taux de guérison que A.",
    options:["Biais du collisionneur","Paradoxe de Simpson","Sophisme du procureur","Biais du survivant"], correct:1, ref:'simpson',
    why:"L'agrégation avec des tailles de sous-groupes déséquilibrées peut inverser une tendance présente dans tous les sous-groupes. Classique de Simpson." },

  { id:'t_berkson', dom:'Proba',
    txt:"À l'hôpital, les patients fumeurs semblent MOINS touchés par une certaine maladie que les non-fumeurs. Dans la population générale, aucun tel effet protecteur n'existe.",
    options:["Paradoxe de Simpson","Retour à la moyenne","Biais du collisionneur","Loi de Benford"], correct:2, ref:'berkson',
    why:"Conditionner sur un effet commun (être hospitalisé) fabrique une corrélation fictive entre deux causes indépendantes de l'hospitalisation. C'est le collisionneur (Berkson)." },

  { id:'t_prosecutor', dom:'Proba',
    txt:"Un test fiable à 99 % dépiste une maladie qui touche 1 personne sur 1000. Ton test est positif. Le médecin panique. Or tu es probablement en bonne santé.",
    options:["Sophisme du procureur","Loi de Benford","Malédiction du vainqueur","Paradoxe de Simpson"], correct:0, ref:'prosecutor',
    why:"P(malade | test+) n'est pas P(test+ | malade). Avec une maladie rare, les faux positifs écrasent les vrais positifs : inverser la conditionnelle est le sophisme du procureur." },

  { id:'t_path', dom:'Systèmes',
    txt:"La disposition de clavier QWERTY a été conçue pour ralentir les frappes des machines à écrire. Des dispositions plus rapides existent. QWERTY domine toujours.",
    options:["Loi de Goodhart","Dépendance au chemin","La Reine Rouge","Émergence"], correct:1, ref:'path_dependence',
    why:"Un avantage initial (coûts de coordination, habitudes, verrouillage) se renforce lui-même : le meilleur ne gagne pas, le premier arrivé oui. Dépendance au chemin." },

  { id:'t_regcaus', dom:'Proba',
    txt:"Un instructeur remarque : quand il crie sur un élève après une mauvaise performance, l'élève s'améliore ensuite ; quand il félicite après une excellente, l'élève régresse. Il conclut que les critiques marchent mieux que les compliments.",
    options:["Loi de Goodhart","Réflexivité","Retour à la moyenne pris pour une cause","Biais du survivant"], correct:2, ref:'regression_causale',
    why:"Une performance extrême est en partie due au hasard ; la suivante revient naturellement vers la moyenne — sans lien avec cri ou compliment. Le retour à la moyenne se déguise en causalité." },

  { id:'t_goodhart', dom:'Systèmes',
    txt:"Un centre d'appels fixe comme objectif de réduire la durée moyenne des appels. Les agents raccrochent plus vite, bâclent, et la satisfaction client s'effondre.",
    options:["Paradoxe de Braess","Loi de Goodhart","Paradoxe de Jevons","Loi de la variété requise"], correct:1, ref:'goodhart',
    why:"Quand une mesure devient une cible, elle cesse d'être une bonne mesure : on optimise l'indicateur, pas l'objectif réel. Loi de Goodhart." },

  { id:'t_braess', dom:'Systèmes',
    txt:"Une ville ajoute une nouvelle route rapide pour désengorger le trafic. Résultat : le temps de trajet de tout le monde augmente.",
    options:["Loi de Goodhart","Effet coup de fouet","Paradoxe de Braess","Percolation"], correct:2, ref:'braess',
    why:"Ajouter une option dans un réseau d'agents égoïstes peut dégrader l'équilibre global : chacun choisit la nouvelle route, la saturant. Paradoxe de Braess." },

  { id:'t_jevons', dom:'Systèmes',
    txt:"Les moteurs deviennent bien plus économes en carburant. Au niveau du pays, la consommation totale de carburant… augmente.",
    options:["Paradoxe de Jevons","Loi de Goodhart","La Reine Rouge","Effet coup de fouet"], correct:0, ref:'jevons',
    why:"L'efficience baisse le coût d'usage, ce qui augmente la demande : le gain par unité est plus que compensé par le volume. Paradoxe de Jevons (effet rebond)." },

  { id:'t_bullwhip', dom:'Systèmes',
    txt:"La demande des clients d'un magasin varie de ±5 %. En remontant la chaîne — grossiste, puis usine — les variations de commandes deviennent énormes, ±40 %.",
    options:["Criticité auto-organisée","Effet coup de fouet (délais + rétroaction)","Paradoxe de Braess","Seuil de percolation"], correct:1, ref:'bullwhip',
    why:"Des délais dans une boucle de rétroaction amplifient les oscillations à mesure qu'on remonte la chaîne. C'est l'effet coup de fouet (bullwhip)." },

  { id:'t_prefalse', dom:'Humaines',
    txt:"Dans un régime autoritaire, presque tout le monde déteste le pouvoir en privé mais approuve en public. Un incident mineur déclenche soudain un soulèvement massif que personne n'avait vu venir.",
    options:["Cascade informationnelle","Falsification des préférences","Points focaux","Désir mimétique"], correct:1, ref:'preference_falsification',
    why:"Chacun cache sa vraie préférence par peur ; personne ne connaît la taille de l'opposition. Un petit choc révèle les préférences cachées et tout bascule d'un coup." },

  { id:'t_secdil', dom:'Géopolitique',
    txt:"Deux États s'arment uniquement par peur l'un de l'autre. Chaque geste défensif de l'un est vu comme une menace par l'autre, qui s'arme à son tour. La spirale monte — sans qu'aucun ne veuille la guerre.",
    options:["Piège de Thucydide","Dilemme de sécurité","Bandit stationnaire","Donnant-donnant"], correct:1, ref:'security_dilemma',
    why:"Des mesures purement défensives sont indistinguables de préparatifs offensifs : la spirale s'auto-alimente sans agresseur. Dilemme de sécurité." },

  { id:'t_thucydide', dom:'Géopolitique',
    txt:"Une puissance établie voit une puissance rivale monter vite et menacer son rang. La probabilité d'un conflit majeur grimpe fortement.",
    options:["Dilemme de sécurité","Théorie du sélectorat","Piège de Thucydide","Points focaux"], correct:2, ref:'thucydides',
    why:"La peur du déclassement chez l'hégémon et l'ambition du montant créent une dynamique de guerre récurrente dans l'histoire. Piège de Thucydide." },

  { id:'t_schelling', dom:'Géopolitique',
    txt:"Deux inconnus doivent se retrouver à Paris un jour donné, sans aucun moyen de communiquer, sans lieu ni heure convenus. Beaucoup se disent : « midi, sous l'horloge de la gare ».",
    options:["Donnant-donnant","Points focaux","Savoir commun","Action collective"], correct:1, ref:'schelling_points',
    why:"Sans communication, on converge vers un repère saillant et culturellement évident. Point focal (Schelling)." },

  { id:'t_convexite', dom:'Finance',
    txt:"Un investisseur place 50 petits paris risqués. La plupart échouent (perte limitée à la mise), mais un seul rapporte 100× et paie tout le reste largement.",
    options:["Critère de Kelly","Convexité (barbell)","Malédiction du vainqueur","Extremistan"], correct:1, ref:'convexite',
    why:"Perte bornée, gain non borné : la courbe de payoff est convexe, donc la volatilité elle-même ajoute de la valeur (Jensen). Stratégie barbell." },

  { id:'t_winners', dom:'Finance',
    txt:"Tu remportes une enchère très disputée pour un champ pétrolier dont la valeur réelle est incertaine. Le soir même, tu as un doute : as-tu payé trop cher ?",
    options:["Convexité","Malédiction du vainqueur","Marché des tacots","Critère de Kelly"], correct:1, ref:'winners_curse',
    why:"Gagner une enchère à valeur commune incertaine signifie souvent que tu as le plus surestimé le bien : le simple fait de gagner est une mauvaise nouvelle sur ton estimation." },

  { id:'t_lemons', dom:'Finance',
    txt:"Sur un marché de voitures d'occasion, l'acheteur ne peut pas distinguer une bonne d'une mauvaise. Il ne paie que le prix moyen. Les vendeurs de bonnes voitures se retirent, la qualité moyenne chute, le marché se dégrade.",
    options:["Malédiction du vainqueur","Réflexivité","Marché des tacots (info asymétrique)","Loi de Goodhart"], correct:2, ref:'lemons',
    why:"L'asymétrie d'information tire la qualité vers le bas : au prix moyen, seuls les mauvais restent. C'est le marché des « lemons » d'Akerlof." },

  { id:'t_redqueen', dom:'Sciences',
    txt:"Prédateurs et proies (ou entreprises concurrentes) ne cessent d'évoluer et de s'améliorer — mais leur position relative ne change presque pas. Il faut courir juste pour rester à la même place.",
    options:["La Reine Rouge","Stratégie évolutionnairement stable","Dépendance au chemin","Paradoxe de Jevons"], correct:0, ref:'red_queen',
    why:"Quand tous les adversaires s'améliorent en même temps, l'effort maintient la position sans la faire progresser. Course de la Reine Rouge." },

  { id:'t_signaling', dom:'Humaines',
    txt:"La queue immense et coûteuse du paon le handicape. C'est précisément pour ça qu'elle constitue un signal crédible de sa vigueur auprès des femelles.",
    options:["Désir mimétique","Signaux coûteux","Falsification des préférences","La Reine Rouge"], correct:1, ref:'signaling',
    why:"Un signal n'est crédible que s'il est coûteux à truquer : seul un individu réellement vigoureux peut se payer un tel handicap. Signal coûteux (Zahavi/Spence)." },

  { id:'t_minsky', dom:'Finance',
    txt:"Après une longue période de marchés calmes et prospères, les acteurs, rassurés, s'endettent de plus en plus pour doper leurs rendements — jusqu'au krach.",
    options:["Extremistan","Moment Minsky","Réflexivité","Criticité auto-organisée"], correct:1, ref:'minsky',
    why:"La stabilité elle-même engendre l'instabilité : le calme pousse à la prise de risque et au levier, ce qui fragilise le système. Moment Minsky." },

  { id:'t_correlation', dom:'Finance',
    txt:"Un portefeuille bien diversifié repose sur des actifs peu corrélés en temps normal. Survient une panique : tout s'effondre ensemble, exactement quand la diversification devait protéger.",
    options:["Extremistan","La diversification qui s'évapore","Moment Minsky","Malédiction du vainqueur"], correct:1, ref:'correlation_crisis',
    why:"Les corrélations tendent vers 1 en régime de stress : la protection disparaît au pire moment. C'est le risque de corrélation en crise." },
];
