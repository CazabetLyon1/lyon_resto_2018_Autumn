#
import os
import json
import requests
import io
import codecs
from math import *
import copy
import time

#Mon api key a moi (plus de details dans le fichier texte dans le même repertoire que ce fichier)
#YOUR_API_KEY = 'AIzaSyD4vq_bMskdNlprQ3D1_6g32S6IYNV_iQM'
	
############################################################
# Ces trois fonction permettent de faire un appel a l'api google map 
# en un point donné (lat, lng) avec un rayon donné (radius) 
# une clé API et un Type (TYPE)
############################################################
ERR_POINT=-1
OK=1
liste_erreur_point=[]
	
def fusion (dict_base,dict_suite) :
	""" Cette fonction prend deux dictionnaire, ajoute tout les élément du deuxième a la fin du premier ,utilisé dans les fonctions request_next_page et request, ne gère pas le cas des doublons"""
	for res in dict_suite["results"]:
		dict_base["results"].append(res)
	dict_final=dict_base.copy()
	return dict_final

def request_next_page(next_page_token,YOUR_API_KEY):
	""" Cette fonction est soit appelé soit par la fonction request soit par elle même, elle fait des requètes a l'api google places 
	et renvoie un dictionnaire représentant tout les résultats des appels à l'api tant qu'il y a des résultats disponible (présence du next_page_token)"""
	
	url="https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken="+next_page_token+"&key="+YOUR_API_KEY
	#print("url de la page suivante :\n"+url+"\n")
	
	time.sleep(5) 						#sinon l'api renvoie INVALID_REQUEST
	
	message_erreur="???"
	
	query_result=requests.get(url)		#on fait l'appel a l'api
	x=query_result.json() 				#on place le resultat dans un dictionnaire
	
	if x["status"]!="OK" :				#gestion d'erreur
		print(x["status"]+"\n")
		if (x.get("error_message",None) != None):
			message_erreur=x["error_message"]
			print("Erreur next page: "+x["error_message"]+"\n")
		#METTRE LE POINT DANS LISTE POINT ERREUR 
		return ({},ERR_POINT,message_erreur)
		
	else :								#si on a bien un resultat qui est renvoyé 
		
		new_next_page_token=x.get("next_page_token",None) #renvoie None si "next_page_token" n'est pas trouvé dans le dictionnaire de résultat
		if (new_next_page_token!= None):
			#print("next_page token : "+str(new_next_page_token)+"\n")
			(dict_resultat,statut,erreur)=request_next_page(new_next_page_token,YOUR_API_KEY) #on appel encore la meme fonction afin de récuperer la suite (et peut etre la fin) des resultat de l'appel initial
			#gestion d'erreur:
			#1er cas : l'appel récurssif s'est bien passé on agit normalement
			if statut == OK:
				dict_obtenu=fusion(x,dict_resultat) #pas besoin de gerer le cas des doublons, l'appel avec le next_page_token renvoie la suite des resultats, donc aucun élément en commun avec ce qu'on a déjà
				dict_final=dict_obtenu.copy()
			#2eme cas : un appel récurssif à relevé une erreur : soit d'un appel précédent soit il s'est lui même mal passé on renvoie l'erreur "à la couche supérieur"
			else :
				return ({},ERR_POINT,erreur)
		
		else :
			#print("Pas d'autres resultats a rechercher \n")
			dict_final=x.copy()

	#print("next page done")
	return (dict_final,OK,"")

def request(lat=45.75,lng=4.83,radius=200,TYPE='restaurant',YOUR_API_KEY='AIzaSyD4vq_bMskdNlprQ3D1_6g32S6IYNV_iQM'):
	"""Cette fonction renvoie un dictionnaire correspondant a tout les résultats associé a l'appel de l'api google places
	avec le paramètres par défault ou bien des paramètre précisés,
	/!\ un seul appel ne peut renvoyer plus de 60 résultat , faire plusieurs appels si besoin /!\ """
	url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+str(lat)+","+str(lng)+"&radius="+str(radius)+"&type="+TYPE+"&key="+YOUR_API_KEY
	print("url de la page:\n" +url+"\n")
	
	message_erreur="???"

	query_result=requests.get(url)
	dict_de_base=query_result.json() #c'est un dictionnaire

	#gestion d'erreur :
	if dict_de_base["status"]!="OK" : 				#appel incorrect
		print(dict_de_base["status"])
		if (dict_de_base.get("error_message",None) != None):
			message_erreur=dict_de_base["error_message"]
			print("Erreur : "+dict_de_base["error_message"] +"\n End")
		dict_point={}
		dict_point["lat"]=lat
		dict_point["lng"]=lng
		dict_point["rr"]=radius
		dict_point["Type"]=TYPE
		dict_point["err_mess"]=message_erreur
		liste_erreur_point.append(dict_point)
		liste_renvoie=[]
		return liste_renvoie
			
	else :											#l'appel est correct
		next_page_token=dict_de_base.get("next_page_token",None) #renvoie None s'il n'y a pas de next_page_token
		
		if  next_page_token!= None :
			#print("next_page token : "+dict_de_base["next_page_token"]+"\n")
			(dict_suite,statut,err_mess)=request_next_page(next_page_token,YOUR_API_KEY)		#on fait la requete pour avoir la suite des résultats
			#gestion d'erreur :
			#1er cas tout s'est bien passé on agit normalement 
			if statut == OK:
				dict_obtenu={}
				dict_obtenu=fusion(dict_de_base,dict_suite)					#on creer un dictionnaire qui contient nos deux 
				dict_final={}
				dict_final=dict_obtenu.copy()
				#2eme cas : un des appels récurssif s'est mal passé on ajoute le point ou l'on fait notre appel à la liste de point erreur
			else :
				dict_point={}
				dict_point["lat"]=lat
				dict_point["lng"]=lng
				dict_point["rr"]=radius
				dict_point["Type"]=TYPE
				dict_point["err_mess"]=message_erreur
				liste_erreur_point.append(dict_point)
				sys.exit(-1)
			
		else :
			#print("Pas d'autres resultats a rechercher \n")
			dict_final=dict_de_base.copy()
			
	#On verifie que le resultat final contient moins de 60 éléments, car cela pourrait dire qu'il en manque dans cette zone 
	#(rappel : l'api renvoie maximum 60 resultt par appel )
	
	print(len(dict_final["results"]))
	if len(dict_final["results"])>= 60:
		print("Appel INCOMPLET, ajout du point à la liste de point")
		dict_point={}
		Lat=lat
		Lng=lng
		Radius=radius
		Type=TYPE
		dict_point["lat"]=Lat
		dict_point["lng"]=Lng
		dict_point["rr"]=Radius
		dict_point["Type"]=Type
		dict_point["err_mess"]="appel incomplet (à atteint les 60 resultats)"
		liste_erreur_point.append(dict_point)
	print("Requests done")
	return dict_final["results"]
	
############################################################
	
def request_all_points(nom_fichier_points='liste_points.txt',nom_fichier_resultats='new_restaurants.json',nom_fichier_erreurs='liste_points_erreurs.txt',type='restaurants',API_KEY='AIzaSyD4vq_bMskdNlprQ3D1_6g32S6IYNV_iQM') :
	#lecture de la liste de points:
	with codecs.open(nom_fichier_points,"r",encoding='utf8') as f:
		liste_point=json.load(f)
	#initialisation de la liste des restaurants obtenu lors de nos prochains appel à l'api
	liste_restaurant=[]
	
	#parcours de la liste de point :
	for point in liste_point :
		liste_de_resultat=[]		#on initialise à vide au cas ou il y est une erreur pendant les requetes : retour avec sys.exit(-1)
		print (point["lat"],"   ",point["lng"],"   ",point["rr"]*1000,"   ",type,"   ",API_KEY)
		#time.sleep(45)
		liste_de_resultat=request(point["lat"],point["lng"],point["rr"]*1000,type,API_KEY)
		#on ajoute tout les résultats de nos appel (hors doublons) dans notre liste de restaurants (ne marche pas à priori : faire un script qui eneleve les doubles 
		for resto in liste_de_resultat:
			if not(resto in liste_restaurant ):
				liste_restaurant.append(resto)
		#à ce stade toute les erreurs par rapport aux appels sont géré dans la fonction request
	
	#on ecrit maintenant la liste des points ou il y a eu des erreurs:
	with io.open(nom_fichier_erreurs, 'a',encoding='utf8') as f:
		f.write("###########\n")
		json.dump(liste_erreur_point,f, indent=4,ensure_ascii=False)
	#puis la liste des restaurants obtenue :)
	with io.open(nom_fichier_resultats, 'w',encoding='utf8') as f:
		json.dump(liste_restaurant,f, indent=4,ensure_ascii=False)

	#etre heureux
	print("Appels finis :)")
	
############################################################

request_all_points("C:/Users/franc/liste_point_pour_bars.txt","bars.json","points_erreur_bar.txt",'bar','AIzaSyD4vq_bMskdNlprQ3D1_6g32S6IYNV_iQM')






