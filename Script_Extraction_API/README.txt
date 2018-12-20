#################################################################
# Ecrit par ROBERT François dans le cadre de l'UE LIFPROJET 	#
# semestre d'automne 2018 / 2019 				#
#################################################################

Dans les grandes lignes : l'API google maps est un outils qui permet de récupérer des informations 
depuis les données que détient google, ces scripts permettent étapes par étape de récupérer toutes les informations
sur les restaurants
Toutefois attention : depuis juillet 2018 nous avons a disposition 200$ "gratuit" chaque mois,
chaque appels fait à l'API ayant un certain coup selon la qualité et le nombre d'informations demandé
Il y a donc du travail à faire sur la génération de la liste des points ou faire les vrais appels, afin d'avoir le moins
de répétitions possible (détail dans le code) qui n'est pas optimale, mais qui fonctionne très bien.
Il faut aussi se munir d'une clé API, c'est ce qui dit à l'API que vous êtes autorisé a faire vos appels, elle est facile à obtenir

##################################################################################################################################
# /!\ certains programmes sont suceptibles de touner assez longtemps, ne pas les interompre /!\			 		 #
##################################################################################################################################
dans le dossier test : les scripts sont innutiles, pas al peine de perdre du temps dessus suaf si vous voulez 
voir certaines tentatives qui n'ont pas été concluantes, SAUF test_requests.py qui permet de prendre en main l'api et permet de comprendre comment fonctionnent les appels

quadrillage_recurssif_opti : il faut donner le fichier que l'on veut mettre à jour (exemple : restaurants.json et bars.json) et va générer une liste de point (lat ,lng ,radius ,radius(km))
qui correspondent à ou il faut faire els nouveaux appels
image_decoupage.png montre en gros comment est fait l'appel récurssif

quadrillage_recurssif_correct : compare un résultat potentiel des appels fait dans la liste de point donné (donc le résultat du script précédent) par rapport au fichier de départ (restaurants.json ou bars.json)
affiche le nombre de doublons ect

requete_api_googlemap.py : donner la liste de point généré, donner le nom du fichier de résultat,un nom de fichier pout stocker les erreurs,un type (voir comment fonctionne l'api),et une clé api
va générer un fichier json contenant le résultat de tout les appels représenté dans la liste de point donnée

request_details_bars.py/request_details_restaurants.py : sont identique cela permet juste de lancer les deux en même temps comme cela dure longtemps, on donne le fichier json généré par le script précédent
ces scripts vont faire la demande des details sur chaque élément du fichier json (élément complémentaire d'adresse, numéro de téléphone, heures d'ouvertures ...)
/!\ ils vont généré de nombreux fichier de back ups au cas ou le programme seraient interompu, en soit les back ups ne servent à rien, si le programme se termine d'une traite, vous pouvez les supprimer /!\
/!\ si le programme ne se termine pas en un coup, utiliser "fin_requete_details.py" pour reprendre les appels la ou on c'était arrêté (au lieu de recommencer, ca coute cher) /!\

tri.py : définit le "maintype" de chaque etablissement, puis tri les resultats en trois fichiers : restaurants.json , bars.json, barsRestaurants.json




