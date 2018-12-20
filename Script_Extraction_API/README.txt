#################################################################
# Ecrit par ROBERT Fran�ois dans le cadre de l'UE LIFPROJET 	#
# semestre d'automne 2018 / 2019 				#
#################################################################

Dans les grandes lignes : l'API google maps est un outils qui permet de r�cup�rer des informations 
depuis les donn�es que d�tient google, ces scripts permettent �tapes par �tape de r�cup�rer toutes les informations
sur les restaurants
Toutefois attention : depuis juillet 2018 nous avons a disposition 200$ "gratuit" chaque mois,
chaque appels fait � l'API ayant un certain coup selon la qualit� et le nombre d'informations demand�
Il y a donc du travail � faire sur la g�n�ration de la liste des points ou faire les vrais appels, afin d'avoir le moins
de r�p�titions possible (d�tail dans le code) qui n'est pas optimale, mais qui fonctionne tr�s bien.
Il faut aussi se munir d'une cl� API, c'est ce qui dit � l'API que vous �tes autoris� a faire vos appels, elle est facile � obtenir

##################################################################################################################################
# /!\ certains programmes sont suceptibles de touner assez longtemps, ne pas les interompre /!\			 		 #
##################################################################################################################################
dans le dossier test : les scripts sont innutiles, pas al peine de perdre du temps dessus suaf si vous voulez 
voir certaines tentatives qui n'ont pas �t� concluantes, SAUF test_requests.py qui permet de prendre en main l'api et permet de comprendre comment fonctionnent les appels

quadrillage_recurssif_opti : il faut donner le fichier que l'on veut mettre � jour (exemple : restaurants.json et bars.json) et va g�n�rer une liste de point (lat ,lng ,radius ,radius(km))
qui correspondent � ou il faut faire els nouveaux appels
image_decoupage.png montre en gros comment est fait l'appel r�curssif

quadrillage_recurssif_correct : compare un r�sultat potentiel des appels fait dans la liste de point donn� (donc le r�sultat du script pr�c�dent) par rapport au fichier de d�part (restaurants.json ou bars.json)
affiche le nombre de doublons ect

requete_api_googlemap.py : donner la liste de point g�n�r�, donner le nom du fichier de r�sultat,un nom de fichier pout stocker les erreurs,un type (voir comment fonctionne l'api),et une cl� api
va g�n�rer un fichier json contenant le r�sultat de tout les appels repr�sent� dans la liste de point donn�e

request_details_bars.py/request_details_restaurants.py : sont identique cela permet juste de lancer les deux en m�me temps comme cela dure longtemps, on donne le fichier json g�n�r� par le script pr�c�dent
ces scripts vont faire la demande des details sur chaque �l�ment du fichier json (�l�ment compl�mentaire d'adresse, num�ro de t�l�phone, heures d'ouvertures ...)
/!\ ils vont g�n�r� de nombreux fichier de back ups au cas ou le programme seraient interompu, en soit les back ups ne servent � rien, si le programme se termine d'une traite, vous pouvez les supprimer /!\
/!\ si le programme ne se termine pas en un coup, utiliser "fin_requete_details.py" pour reprendre les appels la ou on c'�tait arr�t� (au lieu de recommencer, ca coute cher) /!\

tri.py : d�finit le "maintype" de chaque etablissement, puis tri les resultats en trois fichiers : restaurants.json , bars.json, barsRestaurants.json




