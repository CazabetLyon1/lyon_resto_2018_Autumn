from math import *
import copy
import json
import time
from geopy import distance

#PROGRAMME USELESS
# UTILISER "quadrillage_recurssif.py" A LA PLACE



#fonction qui lit le json on obtient une liste qui contient des dictionnaire, une clé ["lat"] ["lng"] ["nom"] pour chaque
def lect_json (nom_fich):	
	with open(nom_fich,"r", encoding="utf8") as f:
		restaurants=json.load(f)
	
	liste=[]
	for resto in restaurants:
		dict = {}
		dict["lat"]=resto["geometry"]["location"]["lat"]
		dict["lng"]=resto["geometry"]["location"]["lng"]
		dict["nom"]=resto["name"]
		liste.append(dict)
	return liste

#fonction qui pour chaque restaurant fait une projection orthographique pour obtenir x et y , après calcul de lat_moy et lng_moy
def proj_ortho (liste):
	new_liste=liste[:]
	lat_moy=0
	lng_moy=0
	for x in new_liste :
		lng_moy+=(float)(x["lng"])
		lat_moy+=(float)(x["lat"])
		
	lng_moy= lng_moy / len(liste)
	lat_moy= lat_moy / len(liste)
	for x in new_liste :
		x["x"]=6371000*cos((float)(x["lat"]))*sin((float)(x["lng"])-lng_moy)
		x["y"]=6371000*(cos(lat_moy)*sin((float)(x["lng"]))-sin(lat_moy)*cos((float)(x["lat"]))*cos((float)(x["lng"])-lng_moy))
	return new_liste	
	
# fonction qui selon la liste renvoie le dictionnaire avec xmax , xmin , ymax , ymin et le nom du resto pour chacun de ces 4 points =x
def calc_min_max (liste):
	dict= {}
	
	for resto in liste:
		if "xmax" not in dict:
			dict["xmax"]=resto.copy()
			dict["xmin"]=resto.copy()
			dict["ymax"]=resto.copy()
			dict["ymin"]=resto.copy()
			
		if ((float) (resto["x"])>dict["xmax"]["x"]):
			dict["xmax"]=resto.copy()
		else :
			if((float)(resto["x"])<dict["xmin"]["x"]):
				dict["xmin"]=resto.copy()
		if ((float)(resto["y"])>dict["ymax"]["y"]):
			dict["ymax"]=resto.copy()
		else :
			if ((float)(resto["y"])<dict["ymin"]["y"]):
				dict["ymin"]=resto.copy()
	print("xmin: ",dict["xmin"]["lat"],dict["xmin"]["lng"],"xmax : ",dict["xmax"]["lat"],dict["xmax"]["lng"],"ymin :" ,dict["ymin"]["lat"],dict["ymin"]["lng"],"ymax :",dict["ymax"]["lat"],dict["ymax"]["lng"])
	#print(dict["xmin"]["lng"]-dict["xmax"]["lng"],dict["ymin"]["lat"]-dict["ymax"]["lat"])
	#print(dict["xmax"]["x"]-dict["xmin"]["x"],dict["ymax"]["y"]-dict["ymin"]["y"])
	return dict

def calc_min_max_2 (liste):
	""" recherche du min et du max pour les points afin de générer le point en haut a gauche,a droite en bas a gauche et droite """
	dict= {}
	
	for resto in liste:
		if "latmax" not in dict:
			dict["lngmax"]=resto.copy()
			dict["lngmin"]=resto.copy()
			dict["latmax"]=resto.copy()
			dict["latmin"]=resto.copy()
			
		if ((resto["lng"])>dict["lngmax"]["lng"]):
			dict["lngmax"]=resto.copy()
		else :
			if((float)(resto["lng"])<dict["lngmin"]["lng"]):
				dict["lngmin"]=resto.copy()
		if ((float)(resto["lat"])>dict["latmax"]["lat"]):
			dict["latmax"]=resto.copy()
		else :
			if ((float)(resto["lat"])<dict["latmin"]["lat"]):
				dict["latmin"]=resto.copy()
				
	dict_point={}
	dict_point["haut_gauche"]={}
	dict_point["haut_gauche"]["lat"]=dict["latmin"]["lat"] # ATTENTION : je sais pas pq mais pour lng de la gauche vers la droite ca va du + vers le moins , donc ici bien latmax et pas latmin
	dict_point["haut_gauche"]["lng"]=dict["lngmax"]["lng"]
	dict_point["bas_gauche"]={}
	dict_point["bas_gauche"]["lat"]=dict["latmax"]["lat"]
	dict_point["bas_gauche"]["lng"]=dict["lngmax"]["lng"]
	dict_point["haut_droite"]={}
	dict_point["haut_droite"]["lat"]=dict["latmin"]["lat"] 
	dict_point["haut_droite"]["lng"]=dict["lngmin"]["lng"]
	dict_point["bas_droite"]={}
	dict_point["bas_droite"]["lat"]=dict["latmax"]["lat"] 
	dict_point["bas_droite"]["lng"]=dict["lngmin"]["lng"]
	print("haut_gauche: ",dict_point["haut_gauche"]["lat"],dict_point["haut_gauche"]["lng"],"haut_droite : ",dict_point["haut_droite"]["lat"],dict_point["haut_droite"]["lng"],"bas_gauche :" ,dict_point["bas_gauche"]["lat"],dict_point["bas_droite"]["lng"],"bas_droite :",dict_point["bas_droite"]["lat"],dict_point["bas_droite"]["lng"])
	#print(dict["xmin"]["lng"]-dict["xmax"]["lng"],dict["ymin"]["lat"]-dict["ymax"]["lat"])
	#print(dict["xmax"]["x"]-dict["xmin"]["x"],dict["ymax"]["y"]-dict["ymin"]["y"])
	
	return dict_point

	
#calcul de distance entre deux point : renvoie la racine carré de la norme
def dist(x1,y1,x2,y2) :
	#res=sqrt(pow(y2-y1,2)+pow(x2-x1,2))
	couple1 =(x1,y1)
	couple2 =(x2,y2)
	res=(distance.distance(couple1, couple2).km)
	#print(res)
	return res

#fonction qui selon, un point , un radius , une liste de resto, renvoie le nb de point dans le cercle de rayon radius de centre le point donné
def nb_res_appel(x,y,radius,liste):
	compteur=0
	for res in liste:
		resultat=dist(x,y,res["lng"],res["lat"])	
		if resultat<=radius:
			compteur+=1
	
	return compteur
#fonction qui part d'un radius = 1000, et:
# faire une double boucle , calculer le centre du cercle selon : indice i, indice j, radius actuelle, xmin, ymax
#faire calcule distance avec ce centre ce radius et la liste des restos
#si d>60 : ancien radius = radius, radius = radius/2 , afficher radius et dire qu'on a diminué
#si d<10 : si ancien radius = 0 afficher erreur , radius donné de base trop petit , sinon ancien radius = radius ,radius= radius+ ((ancien radius - radius) /2) , afficher radius et dire qu'on a augmenté
#a la fin de la double boucle , on est bon donc on affiche le radius calculé (peut aussi faire quelque tests pour dire les zones ou il y a le plus de res par appel)
def shrek(nb,ancien_nb):
	liste_resto=[]
	liste_resto=copy.deepcopy(lect_json("C:/Users/franc/OneDrive/Documents/FAC/projet L3/LIFPROJET/JSON/restaurants.json"))
	dict= calc_min_max_2(liste_resto)

	#nb_appel_ligne=((int)(dist(dict["xmin"]["x"], dict["ymax"]["y"],dict["xmax"]["x"], dict["ymax"]["y"]))/radius) +2 #+1 ?
	#nb_appel_colonne=((int)(dist(dict["xmin"]["x"], dict["ymax"]["y"],dict["xmin"]["x"], dict["ymin"]["y"]))/radius) +2 #+1 ?
	#nb_appel_ligne=(int)(nb_appel_ligne) +1
	#nb_appel_colonne=((int)(nb_appel_colonne) +1)*2
	radius=((dict["haut_gauche"]["lng"]-dict["haut_droite"]["lng"]))
	radius=radius/nb
	nb_ligne=(int)((dict["bas_gauche"]["lat"]-dict["haut_gauche"]["lat"])/radius)
	nb_ligne=(nb_ligne+1)*2
	#calcul du radius en distance réelle :
	radius_reel=dist(dict["haut_gauche"]["lng"],dict["haut_gauche"]["lat"],dict["haut_gauche"]["lng"]+radius,dict["haut_gauche"]["lat"])
	nb_res_max_occ=0
	nb_res_min_occ=0
	nb_res_min=10000
	nb_res_max=0
	#a changer selon feuille
	for i in range(nb_ligne):
		for j in range(nb) :
			if i%2==0 :
				x=dict["haut_gauche"]["lng"]- j*radius*2
				y=dict["haut_gauche"]["lat"]+ i * radius
				print("----")
			if i%2==1 :
				x=dict["haut_gauche"]["lng"]- j*radius*2 - radius
				y=y=dict["haut_gauche"]["lat"]+ i * radius
				print("--")
			nb_res=nb_res_appel(x,y,radius_reel,liste_resto)
			
			#compteur pour affichage
			if(nb_res<nb_res_min):
				nb_res_min=nb_res
				nb_res_min_occ=1
			if(nb_res>nb_res_max):
				nb_res_max=nb_res
				nb_res_max_occ=1
			if(nb_res==nb_res_max):
				nb_res_max_occ+=1
			if(nb_res==nb_res_min):
				nb_res_min_occ+=1
				
				
			
			if nb_res>50:
				print(" nb_res :" ,nb_res ," radius :",radius,"  nb_appels: ",nb, "On va augmenter ... \n")
				if ancien_nb>0:
					#new_nb=(int)((int)(ancien_nb-nb)/2)+nb
					new_nb=nb+20
					new_ancien_nb=ancien_nb
				else :
					print("erreur : ancien nb = 0 on peut pas augmenter \n")
					new_ancien_nb=ancien_nb
				shrek(new_nb,new_ancien_nb)
				return
	print ("fini :) radius ok \n")
	print("nb a garder :",nb)
	print("radius a garder :",radius)
	print("nb resultat minimum :",nb_res_min," --- occurence : ",nb_res_min_occ)
	print("nb resultat maximum :",nb_res_max," --- occurence : ",nb_res_max_occ)
	#print("nb appels : ",nb_appel_ligne*nb_appel_colonne," (",nb_appel_ligne," , ",nb_appel_colonne," )")
# si ca tourne en boucle : on improvise o/
#if nb_res<10:
#				print(" nb_res :" ,nb_res ,"  radius :",radius, "  nb_appels: ",nb,"  On va diminuer ... \n")
#				new_ancien_nb=nb
#				new_nb=((int)(nb/2))+1
#				shrek(new_nb,new_ancien_nb)
			#	return

shrek(5,500)

