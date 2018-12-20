from math import *
import copy
import json
import time
from geopy import distance
import codecs
import io
import matplotlib.pyplot as plt
import numpy as np
nb_del=0


def dist(x1,y1,x2,y2) :
	couple1 =(x1,y1)
	couple2 =(x2,y2)
	res=(distance.distance(couple1, couple2).km)
	return res

#fonction qui selon, un point , un radius , une liste de resto, renvoie le nb de point dans le cercle de rayon radius de centre le point donné
def res_appel(x,y,radius,liste):
	liste_res =[]
	for res in liste:
		resultat=dist(x,y,res["geometry"]["location"]["lng"],res["geometry"]["location"]["lat"])	
		if resultat<=radius:
			liste_res.append(res)
	return liste_res

def decoupage(x,y,radius,radius_reel,liste_resto):
	new_x=x
	new_y=y+radius
	liste_res_du_decoupage=[]
	liste_res=res_appel(new_x,new_y,radius_reel/4,liste_resto)
	if len(liste_res) > 50 :
		liste_res=decoupage(new_x,new_y,radius/4,radius_reel/4,liste_resto)
	else :
		if len(liste_res) != 0:
			liste_res_du_decoupage.extend(liste_res)
	#################################################################	
	new_x=x
	new_y=y-radius
	liste_res=res_appel(new_x,new_y,radius_reel/4,liste_resto)
	if len(liste_res) > 50 :
		decoupage(new_x,new_y,radius,radius_reel/4,liste_resto)
	else :
		if len(liste_res) != 0:
			liste_res_du_decoupage.extend(liste_res)
	#################################################################
	new_x=x+radius
	new_y=y
	liste_res=res_appel(new_x,new_y,radius_reel/4,liste_resto)
	if len(liste_res) > 50 :
		decoupage(new_x,new_y,radius,radius_reel/4,liste_resto)
	else :
		if len(liste_res) != 0:
			liste_res_du_decoupage.extend(liste_res)
	#################################################################
	new_x=x-radius
	new_y=y
	liste_res=res_appel(new_x,new_y,radius_reel/4,liste_resto)
	if len(liste_res) > 50 :
		decoupage(new_x,new_y,radius,radius_reel/4,liste_resto)
	else :
		if len(liste_res) != 0:
			liste_res_du_decoupage.extend(liste_res)
	#################################################################
	new_x=x
	new_y=y
	liste_res=res_appel(new_x,new_y,radius_reel/2,liste_resto)
	if len(liste_res) > 50 :
		decoupage(new_x,new_y,radius,radius_reel/2,liste_resto)
	else :
		if len(liste_res) != 0:
			liste_res_du_decoupage.extend(liste_res)
	#################################################################
	new_x=x-radius/2
	new_y=y-radius/2
	liste_res=res_appel(new_x,new_y,radius_reel/2,liste_resto)
	if len(liste_res) > 50 :
		decoupage(new_x,new_y,radius,radius_reel/2,liste_resto)
	else :
		if len(liste_res) != 0:
			liste_res_du_decoupage.extend(liste_res)
	#################################################################
	new_x=x+radius/2
	new_y=y-radius/2
	liste_res=res_appel(new_x,new_y,radius_reel/2,liste_resto)
	if len(liste_res) > 50 :
		decoupage(new_x,new_y,radius,radius_reel/2,liste_resto)
	else :
		if len(liste_res) != 0:
			liste_res_du_decoupage.extend(liste_res)
	#################################################################
	new_x=x-radius/2
	new_y=y+radius/2
	liste_res=res_appel(new_x,new_y,radius_reel/2,liste_resto)
	if len(liste_res) > 50 :
		decoupage(new_x,new_y,radius,radius_reel/2,liste_resto)
	else :
		if len(liste_res) != 0:
			liste_res_du_decoupage.extend(liste_res)
	#################################################################
	new_x=x+radius/2
	new_y=y+radius/2
	liste_res=res_appel(new_x,new_y,radius_reel/2,liste_resto)
	if len(liste_res) > 50 :
		decoupage(new_x,new_y,radius/2,radius_reel/2,liste_resto)
	else :
		if len(liste_res) != 0:
			for restaurant in liste_res:
				liste_res_du_decoupage.append( restaurant)
	
	return	liste_res_du_decoupage
	
def enleve_doublon(liste):
	for x in range(len(liste)-1):
		for y in range(len(liste)-x-1):
			y = y+x
			if x != y :	
				if liste[x] == liste [y]:
					liste.remove(liste[y])
	
	return liste
	
	#liste des restaurant de reference
with codecs.open("C:/Users/franc/OneDrive/Documents/FAC/LIFPROJET/LIFPROJET/JSON/bars.json","r",encoding='utf8') as f:
	restaurants=json.load(f)


liste_point =[]
	#liste des points ou faire des appels,avec le radius correspondant
with codecs.open("C:/Users/franc/liste_point_pour_bars.txt","r",encoding='utf8') as g:
	liste_point=json.load(g)

#on met dedans tout les restaurants trouvé avec les appels
liste_restaurant_genere =[]

for restaurant in liste_point :
	liste_resultat_appel=[]
	liste_resultat_appel=res_appel(restaurant["lng"],restaurant["lat"],restaurant["rr"],restaurants)
	if len(liste_resultat_appel) > 50 :
		#on decoupe en plusieurs petit appels :
		liste_resultat_appel=decoupage(restaurant["lng"],restaurant["lat"],restaurant["r"],restaurant["rr"],restaurants)
		#maintnant on a une liste contenant le resultat des appels fait après decoupage
		#on enleve les doublons de la liste des restaurants
	for x in liste_resultat_appel:
		if not(x in liste_restaurant_genere ):
			liste_restaurant_genere.append(x)
			print("un element a ete accepté")
		else :
			print("un element a ete refusé car doublon")
			nb_del+=1

print("nb element supprimé car doublon : ",nb_del)

	
with io.open('bars_genere_apres_quadrillage.json', 'w',encoding='utf8') as f:
	json.dump(liste_restaurant_genere,f, indent=4,ensure_ascii=False)


compteur=0
#on test si le fichier de référence et ce que l'on toruve avec les appels sont pareils
for resto in liste_restaurant_genere:
	trouve=False
	#print(resto["name"])
	for resto_ref in restaurants:
		if(resto_ref["name"]==resto["name"]) :
			trouve=True
			break
	if trouve == False :
		print("un restaurant n'a pas été trouvé")
		print(resto["name"])
		compteur+=1
print(compteur)

compteur=0

for resto in restaurants:
	trouve=False
	#print(resto["name"])
	for resto_ref in liste_restaurant_genere:
		if(resto_ref["name"]==resto["name"]) :
			trouve=True
			break
	if trouve == False :
		print("un restaurant n'a pas été trouvé")
		print(resto["name"])
		compteur+=1
print(compteur)