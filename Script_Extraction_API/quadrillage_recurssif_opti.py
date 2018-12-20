from math import *
import copy
import json
import time
from geopy import distance
import matplotlib.pyplot as plt
import numpy as np
#liste en variable globale qui contient les coordonnées et le rayon associé de tout les appels qu'il faut faire pour couvrir la meme zone que l'ancien json donné
l=[]
NB_MAX_RES = 30
#fonction qui lit le json, on obtient une liste qui contient des dictionnaire, une clé ["lat"] ["lng"] ["nom"] pour chaque
def lect_json (nom_fich):	
	with open(nom_fich,"r", encoding="utf8") as f:
		restaurants=json.load(f)
	print(type(restaurants))
	liste=[]
	for resto in restaurants:
		dict = {}
		dict["lat"]=resto["geometry"]["location"]["lat"]
		dict["lng"]=resto["geometry"]["location"]["lng"]
		dict["nom"]=resto["name"]
		liste.append(dict)
	return liste
	
def calc_min_max_2 (liste):
	""" recherche du min et du max pour les points afin de générer le point en haut a gauche,a droite en bas a gauche et droite """
	dict= {}
	
	for resto in liste:
		if "latmax" not in dict:
			dict["lngmax"]=resto.copy()
			dict["lngmin"]=resto.copy()
			dict["latmax"]=resto.copy()
			dict["latmin"]=resto.copy()
			
		if ((float)(resto["lng"])>dict["lngmax"]["lng"]):
			dict["lngmax"]=resto.copy()
			
		if((float)(resto["lng"])<dict["lngmin"]["lng"]):
			dict["lngmin"]=resto.copy()
			
		if ((float)(resto["lat"])>dict["latmax"]["lat"]):
			dict["latmax"]=resto.copy()
			
		if ((float)(resto["lat"])<dict["latmin"]["lat"]):
			dict["latmin"]=resto.copy()
				
	dict_point={}
	dict_point["haut_gauche"]={}
	dict_point["haut_gauche"]["lat"]=dict["latmax"]["lat"] # ATTENTION : lng va du - vers le plus de gauche a droite , et lat va du - vers le + de haut en bas
	dict_point["haut_gauche"]["lng"]=dict["lngmin"]["lng"]
	dict_point["bas_gauche"]={}
	dict_point["bas_gauche"]["lat"]=dict["latmin"]["lat"]
	dict_point["bas_gauche"]["lng"]=dict["lngmin"]["lng"]
	dict_point["haut_droite"]={}
	dict_point["haut_droite"]["lat"]=dict["latmax"]["lat"] 
	dict_point["haut_droite"]["lng"]=dict["lngmax"]["lng"]
	dict_point["bas_droite"]={}
	dict_point["bas_droite"]["lat"]=dict["latmin"]["lat"] 
	dict_point["bas_droite"]["lng"]=dict["lngmax"]["lng"]
	print("haut_gauche: ",dict_point["haut_gauche"]["lat"],dict_point["haut_gauche"]["lng"],"haut_droite : ",dict_point["haut_droite"]["lat"],dict_point["haut_droite"]["lng"],"bas_gauche :" ,dict_point["bas_gauche"]["lat"],dict_point["bas_gauche"]["lng"],"bas_droite :",dict_point["bas_droite"]["lat"],dict_point["bas_droite"]["lng"])

	
	return dict_point
	
#calcul de distance entre deux point : appel a la bibliothèque geopy , les coordonnées données a la fonction sont de type (lng , lat )
def dist(x1,y1,x2,y2) :
	#res=sqrt(pow(y2-y1,2)+pow(x2-x1,2))
	couple1 =(x1,y1)
	couple2 =(x2,y2)
	res=(distance.distance(couple1, couple2).km)
	return res

#fonction qui selon, un point , un radius , une liste de resto, renvoie le nb de point dans le cercle de rayon radius de centre le point donné
def nb_res_appel(x,y,radius,liste):
	compteur=0
	for res in liste:
		resultat=dist(x,y,res["lng"],res["lat"])	
		if resultat<=radius:
			compteur+=1
	
	return compteur


def decoupage(x,y,radius,radius_reel,liste_resto):
	""" Focntion appelé au cas ou il y aurait plus de 60 restaurant (contenue dans lite_resto) dans le cercle de centre (x,y) de rayon radius, découpe ce cercle en plusieurs cercle plus petit sur lesquels on va faire des appels, le but étant que dans chaque cercle il y ai moins de 60 restaurants""" 
	#code pas propre : faire une fonction pour le contenue qui se repete
	new_x=x+radius /2
	new_y=y+radius /(2)
	nb_res=nb_res_appel(new_x,new_y,radius_reel/2,liste_resto)
	if nb_res > NB_MAX_RES :
		#print("appel rec en plus")
		decoupage(new_x,new_y,radius/2,radius_reel/2,liste_resto)
	else :
		if nb_res != 0:
			dict={}
			dict["lng"]=new_x
			dict["lat"]=new_y
			dict["rr"]=radius_reel/2
			dict["r"]=radius/2
			l.append(dict)
		
	new_x=x-radius /2
	new_y=y+radius /(2)
	nb_res=nb_res_appel(new_x,new_y,radius_reel/2,liste_resto)
	if nb_res > NB_MAX_RES :
		#print("appel rec en plus")
		decoupage(new_x,new_y,radius/2,radius_reel/2,liste_resto)
	else :
		if nb_res != 0:
			dict={}
			dict["lng"]=new_x
			dict["lat"]=new_y
			dict["rr"]=radius_reel/2
			dict["r"]=radius/2
			l.append(dict)
	new_x=x+radius /2
	new_y=y-radius /(2)
	nb_res=nb_res_appel(new_x,new_y,radius_reel/2,liste_resto)
	if nb_res > NB_MAX_RES :
		#print("appel rec en plus")
		decoupage(new_x,new_y,radius/2,radius_reel/2,liste_resto)
	else :
		if nb_res != 0:
			dict={}
			dict["lng"]=new_x
			dict["lat"]=new_y
			dict["rr"]=radius_reel/2
			dict["r"]=radius/2
			l.append(dict)
	
	new_x=x-radius /2
	new_y=y-radius /(2)
	nb_res=nb_res_appel(new_x,new_y,radius_reel/2,liste_resto)
	if nb_res > NB_MAX_RES :
		#print("appel rec en plus")
		decoupage(new_x,new_y,radius/2,radius_reel/2,liste_resto)
	else :
		if nb_res != 0:
			dict={}
			dict["lng"]=new_x
			dict["lat"]=new_y
			dict["rr"]=radius_reel/2
			dict["r"]=radius/2
			l.append(dict)
			
	new_x=x
	new_y=y
	nb_res=nb_res_appel(new_x,new_y,radius_reel/2,liste_resto)
	if nb_res > NB_MAX_RES :
		#print("appel rec en plus")
		decoupage(new_x,new_y,radius/2,radius_reel/2,liste_resto)
	else :
		if nb_res != 0:
			dict={}
			dict["lng"]=new_x
			dict["lat"]=new_y
			dict["rr"]=radius_reel/2
			dict["r"]=radius/2
			l.append(dict)
			
	new_x=x+radius
	new_y=y
	nb_res=nb_res_appel(new_x,new_y,radius_reel/3,liste_resto)
	if nb_res > NB_MAX_RES :
		#print("appel rec en plus")
		decoupage(new_x,new_y,radius/3,radius_reel/3,liste_resto)
	else :
		if nb_res != 0:
			dict={}
			dict["lng"]=new_x
			dict["lat"]=new_y
			dict["rr"]=radius_reel/3
			dict["r"]=radius/3
			l.append(dict)
	new_x=x
	new_y=y+radius
	nb_res=nb_res_appel(new_x,new_y,radius_reel/3,liste_resto)
	if nb_res > NB_MAX_RES :
		#print("appel rec en plus")
		decoupage(new_x,new_y,radius/3,radius_reel/3,liste_resto)
	else :
		if nb_res != 0:
			dict={}
			dict["lng"]=new_x
			dict["lat"]=new_y
			dict["rr"]=radius_reel/3
			dict["r"]=radius/3
			l.append(dict)
			
	new_x=x-radius 
	new_y=y
	nb_res=nb_res_appel(new_x,new_y,radius_reel/3,liste_resto)
	if nb_res > NB_MAX_RES :
		#print("appel rec en plus")
		decoupage(new_x,new_y,radius/3,radius_reel/3,liste_resto)
	else :
		if nb_res != 0:
			dict={}
			dict["lng"]=new_x
			dict["lat"]=new_y
			dict["rr"]=radius_reel/3
			dict["r"]=radius/3
			l.append(dict)
			
	new_x=x
	new_y=y-radius
	nb_res=nb_res_appel(new_x,new_y,radius_reel/3,liste_resto)
	if nb_res > NB_MAX_RES :
		#print("appel rec en plus")
		decoupage(new_x,new_y,radius/3,radius_reel/3,liste_resto)
	else :
		if nb_res != 0:
			dict={}
			dict["lng"]=new_x
			dict["lat"]=new_y
			dict["rr"]=radius_reel/3
			dict["r"]=radius/3
			l.append(dict)
	return
	
	
def shrek(nb=5,fichier_res='liste_point_genere.txt',ancien_fichier="C:/Users/franc/OneDrive/Documents/FAC/LIFPROJET/LIFPROJET/JSON/restaurants.json"):
	""" fonction ultime qui genère un fichier contenant les points ou faire nos appels """
	liste_resto=[]
	liste_resto=copy.deepcopy(lect_json(ancien_fichier)) #fichier json de reference dans lequel sont contenus tout les anciens restaurants
	dict= calc_min_max_2(liste_resto)

	
	radius=((dict["haut_droite"]["lng"]-dict["haut_gauche"]["lng"])) #on a besoin du radius en terme distance entre des points de type (lng , lat) afin de faire evoluer i et j , qui seront utiliser comme coordonnées de type (lng , lat) pour faire nos appels fictifs,décoper en cercle plus petit ect
	radius=radius/(nb*2)
	print(radius)
	nb_ligne=(int)((dict["haut_gauche"]["lat"]-dict["bas_gauche"]["lat"])/radius) #on adapte le nombre de ligne sur lesquels on fait nos appels afin de quadriller toute la zone correctement (cf potentielle image fournies pour mieux voir)
	nb_ligne=(nb_ligne+1)*2
	#calcul du radius en distance réelle :
	radius_reel=dist(dict["haut_gauche"]["lng"],dict["haut_gauche"]["lat"],dict["haut_gauche"]["lng"]+radius,dict["haut_gauche"]["lat"])# on en a besoin pour evaluer si un restaurant est dans le cercle ou non, comme la distance entre le restaurant et le centre du cercle sera dans cette unité
	print(radius_reel)
	
	for i in range(nb_ligne+1):
		for j in range(nb+2) :
			if i%2==0 :
				x=dict["haut_gauche"]["lng"]+ 2*j*radius - radius
				y=dict["haut_gauche"]["lat"]- i * radius
				print("----")
				
			if i%2==1 :
				x=dict["haut_gauche"]["lng"]+ j*radius*2 + radius -radius
				y=y=dict["haut_gauche"]["lat"]- i * radius
				print("--")
			nb_res=nb_res_appel(x,y,radius_reel,liste_resto)
		
			
			if nb_res>NB_MAX_RES:
				decoupage(x,y,radius,radius_reel,liste_resto)
			else :
				if nb_res != 0:
					dict_res={}
					dict_res["lng"]=x
					dict_res["lat"]=y
					dict_res["rr"]=radius_reel
					dict_res["r"]=radius
					l.append(dict_res)
				
	print ("fini :)\n")
	with open(fichier_res, 'w') as f:
		f.write(json.dumps(l, indent=4))
		
	print("Fini : nb points = ",len(l))
	fig, ax=plt.subplots()
	for d in l :
		C=plt.Circle((d["lng"],d["lat"]),d["r"])
		ax.add_artist(C)
		print(d["lng"])
		print(d["lat"])
		print(d["r"])
	ax.set_xlim((dict["haut_gauche"]["lng"]-0.01,dict["haut_droite"]["lng"]+0.01))
	ax.set_ylim((dict["bas_gauche"]["lat"]-0.01,dict["haut_gauche"]["lat"]+0.01))
	plt.show()	
	
	
shrek(10,'liste_point_pour_bars.txt',"C:/Users/franc/OneDrive/Documents/FAC/LIFPROJET/LIFPROJET/JSON/bars.json")




