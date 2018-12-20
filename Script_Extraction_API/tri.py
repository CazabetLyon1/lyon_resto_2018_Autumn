#ajoute le champ maintype #
import os
import json
import requests
import io
import codecs
import copy
import time

with io.open("restaurantsdetails.json", 'r',encoding='utf8') as f:
		liste_resto=json.load(f)
with io.open("barsdetails.json", 'r',encoding='utf8') as f:
		liste_bar=json.load(f)	

for r in liste_resto :
	bar_trouve=False
	resto_trouve=False
	for i in range(len(r["types"])):
		if r["types"][i] == "bar":	
			bar_trouve=True
		if r["types"][i] == "restaurant":	
			resto_trouve=True
	if resto_trouve and bar_trouve == True :
		r["mainType"]="Bar-restaurant"
	elif bar_trouve == True:
		r["mainType"]="Bar"
	elif resto_trouve == True:
		r["mainType"]="Restaurant"
		
for r in liste_bar :
	bar_trouve=False
	resto_trouve=False
	for i in range(len(r["types"])):
		if r["types"][i] == "bar":	
			bar_trouve=True
		if r["types"][i] == "restaurant":	
			resto_trouve=True
	if (resto_trouve and bar_trouve) == True :
		r["mainType"]="Bar-restaurant"
	elif bar_trouve == True:
		r["mainType"]="Bar"
	elif resto_trouve == True:
		r["mainType"]="Restaurant"
		
list_b=[]
list_r=[]
list_br=[]
for r in liste_resto :
	if r["mainType"]=="Restaurant":
		list_r.append(r)
	elif r["mainType"]=="Bar":
		list_b.append(r)
	else :
		list_br.append(r)
		
for r in liste_bar :
	if r["mainType"]=="Restaurant":
		list_r.append(r)
	elif r["mainType"]=="Bar":
		list_b.append(r)
	else :
		list_br.append(r)
	
with io.open("restaurants.json", 'w',encoding='utf8') as f:
		json.dump(list_r,f, indent=4,ensure_ascii=False)	
with io.open("bars.json", 'w',encoding='utf8') as f:
		json.dump(list_b,f, indent=4,ensure_ascii=False)	
with io.open("barsRestaurants.json", 'w',encoding='utf8') as f:
		json.dump(list_br,f, indent=4,ensure_ascii=False)	
		#653 + 2557 = 3210