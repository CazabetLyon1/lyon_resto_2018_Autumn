#
import os
import json
import requests
import io
import codecs
import copy
import time

nom_backup=""

def request_detail(nom_fichier_entree="a.json",nom_fichier_resultat="b.json",nom_fichier_erreur="c.json",API_KEY='AIzaSyD4vq_bMskdNlprQ3D1_6g32S6IYNV_iQM'):
	liste_erreur_details=[]	#afin de stocker les éventuels endroits ou ca plante, n'est pas sensé arriver
	l=[]
	compteur=0
	with io.open(nom_fichier_entree, 'r',encoding='utf8') as f:
		liste_resto=json.load(f)

	for resto in liste_resto:
		compteur+=1
		placeid=resto["place_id"]
		url="https://maps.googleapis.com/maps/api/place/details/json?placeid="+placeid+"&fields=address_components,adr_address,formatted_address,formatted_phone_number,international_phone_number,opening_hours,reviews,url,utc_offset&key="+API_KEY
		#print(url+"\n")
		query_result=requests.get(url)
		dict_resultat=query_result.json() #c'est un dictionnaire
		
		#gestion d'erreur :
		if dict_resultat["status"]!="OK" : 				#appel incorrect
			message_erreur="???"
			print(dict_resultat["status"])
			if (dict_resultat.get("error_message",None) != None):
				message_erreur=dict_de_base["error_message"]
				print("Erreur : "+dict_de_base["error_message"] +"\n End")
			dict_point={}
			dict_point["placeid"]=placeid
			dict_point["err_mess"]=message_erreur
			liste_erreur_details.append(dict_point)
		
		else :											#appel  correct 
			#on récupère la valeur des nouveaux champs ( nota bene : ils ne sont pas toujours tous disponible pour chaque restaurants : on peut pas savoir mais en aucun cas cela ne peut generer d'erreur )
			for key in dict_resultat["result"]:
				resto[key]=dict_resultat["result"][key]
			l.append(resto)
			
		time.sleep(2) #pour que l'api ne nous plante pas
		
		#comme le programme tourne très longtemps (quelque heures) je fais une save tout les 50 appels ( ~60 au total) 
		#au cas ou le programme s'arrete en cours d'execution (cf : le chat qui marche sur le clavier pdt la nuit par exemple o/ )
		if compteur % 50 == 0 :
			print("BACK UP ",compteur)
			lim=len(str(nom_fichier_entree))-4
			nom_backup=nom_fichier_entree[0:lim]+"_"+str(compteur/50)+".txt"
			with io.open(nom_backup, 'w',encoding='utf8') as b:
				json.dump(l,b, indent=4,ensure_ascii=False)
		
		
	#on ecrit les résultat :)
	with io.open(nom_fichier_resultat, 'w',encoding='utf8') as f:
			json.dump(l,f, indent=4,ensure_ascii=False)
	#au cas ou :
	with io.open(nom_fichier_erreur, 'a',encoding='utf8') as f:
		json.dump(liste_erreur_details,f, indent=4,ensure_ascii=False)

		
request_detail(nom_fichier_entree="C:/Users/franc/restaurants.json",nom_fichier_resultat="restaurantsdetails.json",nom_fichier_erreur="erreurrestaurantdetails.json",API_KEY='AIzaSyD4vq_bMskdNlprQ3D1_6g32S6IYNV_iQM')