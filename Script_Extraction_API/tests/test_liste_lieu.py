import os
import json
import requests

#api key du prof : attention à ne pas faire n'importe quoi 
#YOUR_API_KEY = 'AIzaSyBcUAGLDPHjQ5V9CLZMBRXcnwZdtHfeVA0'
#YOUR_API_KEY = 'AIzaSyBbPT41zlClP0rcKbP3JYS26W3PvR-feXA'

#Mon api key a moi
#YOUR_API_KEY = 'AIzaSyD4vq_bMskdNlprQ3D1_6g32S6IYNV_iQM'

nb_appel_rec_max = 5
nb_appel_rec_fait=0
	

def fusion (dict_base,dict_suite) :
	""" Cette fonction prend deux dictionnaire, ajoute tout les élément du deuxième a la fin du premier sauf si l'élément est déjà présent """
	for res in dict_suite["results"]:
		dict_base["results"].append(res)
	dict_final=dict_base.copy()
	return dict_final

def request_next_page(next_page_token,YOUR_API_KEY):
	""" Cette fonction est soit appelé soit par la fonction request soit par elle même, elle fait des requètes a l'api google places 
	et renvoie un dictionnaire représentant tout les résultats des appels à l'api tant qu'il y a des résultats disponble (présence du next_page_token)"""
	
	url="https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken="+next_page_token+"&key="+YOUR_API_KEY
	import time
	time.sleep(5) 						#sinon l'api renvoie INVALID_REQUEST
	
	query_result=requests.get(url)
	x=query_result.json() 				#on place le resultat dans un dictionnaire
	
	if x["status"]!="OK" :				#gestion d'erreur
		print(x["status"]+"\n")
		if (x.get("error_message",None) != None):
			print("Erreur next page: "+x["error_message"]+"\n")
		
		return dict()
		
	else :
		
		del x["status"] 				#ne sert plus
		del x["html_attributions"] 		#ne sert pas
		global nb_appel_rec_fait
		global nb_appel_rec_max
		
		new_next_page_token=x.get("next_page_token",None)
		if( (new_next_page_token!= None) & ((nb_appel_rec_fait)< (nb_appel_rec_max))) :
			nb_appel_rec_fait+=1
			del x["next_page_token"] # on vient de le récupérer
			
			
			dict_resultat=request_next_page(new_next_page_token,YOUR_API_KEY)
			dict_obtenu=fusion(x,dict_resultat)
			dict_final=dict_obtenu.copy()
		elif (nb_appel_rec_fait>=nb_appel_rec_max) :
			print("Nb appel reccurssif depasse\n")
			dict_final=x.copy()
		elif (new_next_page_token== None) :
			print("Pas de next_pasge_token\n")
			dict_final=x.copy()
		else :
			print("Pas d'autres resultats a rechercher \n")
			dict_final=x.copy()

	print("next page done")
	return dict_final


def request(lat,lng,radius,TYPE,YOUR_API_KEY='AIzaSyD4vq_bMskdNlprQ3D1_6g32S6IYNV_iQM'):
	"""Cette fonction renvoie un dictionnaire correspondant a tout les résultats associé a l'appel de l'api google places
	avec le paramètres par défault ou bien des paramètre précisés"""
	url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+str(lat)+","+str(lng)+"&radius="+str(radius)+"&type="+TYPE+"&key="+YOUR_API_KEY


	query_result=requests.get(url)
	dict_de_base=query_result.json() #c'est un dictionnaire


	if dict_de_base["status"]!="OK" : 				#appel incorrect
		print(dict_de_base["status"])
		if (dict_de_base.get("error_message",None) != None):
			print("Erreur : "+dict_de_base["error_message"] +"\n End")
			sys.exit(-1)
	else :											#l'appel est correcte !
	
		del dict_de_base["status"] 					#ne sert plus
		del dict_de_base["html_attributions"] 		#ne sert pas
		next_page_token=dict_de_base.get("next_page_token",None)
		
		#with open('test_09_11_1_bar.json', 'w') as f:
		if  next_page_token!= None :
			del dict_de_base["next_page_token"] 										# on vient de le stocker donc plus besoin
			dict_suite=request_next_page(next_page_token,YOUR_API_KEY)		#on fait la requete pour avoir la suite des résultats
			dict_obtenu={}
			dict_obtenu=fusion(dict_de_base,dict_suite)					#on creer un dictionnaire qui contient nos deux 
			dict_final={}
			dict_final=dict_obtenu.copy()
												#on verifie qu'il y plus de 20 elements 
		else :
			print("Pas d'autres resultats a rechercher \n")
			dict_final=dict_de_base.copy()
	
	print("Requests done")
	print(len(dict_final["results"])) 
	return dict_final
	
def test_trobi1():
	""" test """
		dict1=dict()
		dict2=dict()
		dict3=dict()
		dict4=dict()
		dict1=request(45.763398, 4.834184,100,'restaurant')
		dict2=request(45.763497, 4.835840,100,'restaurant')
		dict3=request(45.762052, 4.834097,100,'restaurant')
		dict4=request(45.762141, 4.835782,100,'restaurant')
		
		dict_1=fusion(dict1,dict2)
		dict_2=fusion(dict3,dict4)
		dict_fin=fusion(dict_1,dict_2)
		
		for res in dict_fin["results"] :
			print(res["name"]+"\n")
			
		with open('test_boucle.json', 'w') as f:
			json.dump(dict_fin,f, indent=2)
			
test_trobi1()