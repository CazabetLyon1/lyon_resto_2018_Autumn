import os
import json
import requests
import io
#Mon api key a moi
#YOUR_API_KEY = 'AIzaSyD4vq_bMskdNlprQ3D1_6g32S6IYNV_iQM'
	

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
	import time
	time.sleep(5) 						#sinon l'api renvoie INVALID_REQUEST
	
	query_result=requests.get(url)		#on fait l'appel a l'api
	x=query_result.json() 				#on place le resultat dans un dictionnaire
	
	if x["status"]!="OK" :				#gestion d'erreur
		print(x["status"]+"\n")
		if (x.get("error_message",None) != None):
			print("Erreur next page: "+x["error_message"]+"\n")
		
		return dict()
		
	else :								#si on a bien un resultat qui est renvoyé 
		
		new_next_page_token=x.get("next_page_token",None) #renvoie None si "next_page_token" n'est pas trouvé dans le dictionnaire de résultat
		if (new_next_page_token!= None):
			#print("next_page token : "+str(new_next_page_token)+"\n")
			dict_resultat=request_next_page(new_next_page_token,YOUR_API_KEY) #on appel encore la meme fonction afin de récuperer la suite (et peut etre la fin) des resultat de l'appel initial
			dict_obtenu=fusion(x,dict_resultat) #pas besoin de gerer le cas des doublons, l'appel avec le next_page_token renvoie la suite des resultats, donc aucun élément en commun avec ce qu'on a déjà
			dict_final=dict_obtenu.copy()
		
		else :
			#print("Pas d'autres resultats a rechercher \n")
			dict_final=x.copy()

	print("next page done")
	return dict_final

def request(lat=45.75,lng=4.83,radius=200,TYPE='restaurant',YOUR_API_KEY='AIzaSyD4vq_bMskdNlprQ3D1_6g32S6IYNV_iQM',nom_fichier='fichier_json.json'):
	"""Cette fonction renvoie un dictionnaire correspondant a tout les résultats associé a l'appel de l'api google places
	avec le paramètres par défault ou bien des paramètre précisés, /!\ un seul appel ne peut renvoyer plus de 60 résultat , faire plusieurs appels si besoin /!\ """
	url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+str(lat)+","+str(lng)+"&radius="+str(radius)+"&type="+TYPE+"&key="+YOUR_API_KEY
	#print("url de la page:\n" +url+"\n")


	query_result=requests.get(url)
	dict_de_base=query_result.json() #c'est un dictionnaire


	if dict_de_base["status"]!="OK" : 				#appel incorrect
		print(dict_de_base["status"])
		if (dict_de_base.get("error_message",None) != None):
			print("Erreur : "+dict_de_base["error_message"] +"\n End")
			sys.exit(-1)
	else :											#l'appel est correcte !
	
		
		next_page_token=dict_de_base.get("next_page_token",None) #renvoie None s'il n'y a pas de next_page_token
		
		with io.open(nom_fichier, 'w',encoding='utf8') as f:
			if  next_page_token!= None :
				#print("next_page token : "+dict_de_base["next_page_token"]+"\n")
				dict_suite=request_next_page(next_page_token,YOUR_API_KEY)		#on fait la requete pour avoir la suite des résultats
				dict_obtenu={}
				dict_obtenu=fusion(dict_de_base,dict_suite)					#on creer un dictionnaire qui contient nos deux 
				dict_final={}
				dict_final=dict_obtenu.copy()
				#print(len(dict_final["results"]))
			else :
				#print("Pas d'autres resultats a rechercher \n")
				dict_final=dict_de_base.copy()
			#f.write("\n\n\n")
			#print(type(dict_final["results"]))
			json.dump(dict_final["results"],f, indent=2,ensure_ascii=False) 					#ecrit le contenu de dict_final dans un .json donné en paramètre
	print("Requests done")
	
	#for res in dict_final["results"] :
	#	print(res["name"]+"\n")


#NPO changer de nom de fichier	
request(lat=45.75,lng=4.83,radius=200,TYPE='restaurant',YOUR_API_KEY='AIzaSyD4vq_bMskdNlprQ3D1_6g32S6IYNV_iQM',nom_fichier='resultat_appels.json')