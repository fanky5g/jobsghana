package indexer

var (
	cityToRegion = map[string]string{
		"Ababio":                          "greater accra",
		"Abeka":                           "greater accra",
		"Abetinso":                        "greater accra",
		"Ablajei":                         "greater accra",
		"Ablefu":                          "greater accra",
		"Ablekuma":                        "greater accra",
		"Ablemkpe":                        "greater accra",
		"Ablenkpe":                        "greater accra",
		"Aboansa":                         "greater accra",
		"Aboansa Number 2":                "greater accra",
		"Abochiman":                       "greater accra",
		"Abofu":                           "greater accra",
		"Abokobi":                         "greater accra",
		"Aboman":                          "greater accra",
		"Abossey Okai":                    "greater accra",
		"Abosumba":                        "greater accra",
		"Abrekuma":                        "greater accra",
		"Abura":                           "greater accra",
		"Accra":                           "greater accra",
		"Accra Centra":                    "greater accra",
		"Accra New Town":                  "greater accra",
		"Achiaman":                        "greater accra",
		"Achimota":                        "greater accra",
		"Achimota Forest":                 "greater accra",
		"Achimota Village":                "greater accra",
		"Adabraka":                        "greater accra",
		"Adaiso":                          "greater accra",
		"Addogonno":                       "greater accra",
		"Adembra":                         "greater accra",
		"Adenkrebi":                       "greater accra",
		"Adentan":                         "greater accra",
		"Adiembra":                        "greater accra",
		"Adofin":                          "greater accra",
		"Adusa":                           "greater accra",
		"Adzenkotoku":                     "greater accra",
		"Afiaman":                         "greater accra",
		"Afianya":                         "greater accra",
		"Afuaman":                         "greater accra",
		"Agblesia":                        "greater accra",
		"Agbogba":                         "greater accra",
		"Agbogbloshie":                    "greater accra",
		"Agboogba":                        "greater accra",
		"Ahinkro":                         "greater accra",
		"Ahireso":                         "greater accra",
		"Ahunju":                          "greater accra",
		"Aidan":                           "greater accra",
		"Aikaidoboro":                     "greater accra",
		"Airport Hills Residential Area":  "greater accra",
		"Airport Residential Area":        "greater accra",
		"Aiyim":                           "greater accra",
		"Aiyimensa":                       "greater accra",
		"Ajenkotoku":                      "greater accra",
		"Ajerkotuku":                      "greater accra",
		"Ajimenti":                        "greater accra",
		"Ajiringano":                      "greater accra",
		"Akkr":                            "greater accra",
		"Akkra":                           "greater accra",
		"Akokome":                         "greater accra",
		"Akomato":                         "greater accra",
		"Akotoshi":                        "greater accra",
		"Akotuaku":                        "greater accra",
		"Akpoman":                         "greater accra",
		"Akra":                            "greater accra",
		"Akra, Gana":                      "greater accra",
		"Akrabon":                         "greater accra",
		"Akrabon Ahentsia":                "greater accra",
		"Akrabon Kwa Tete":                "greater accra",
		"Akrabong":                        "greater accra",
		"Akrabong Joma":                   "greater accra",
		"Akramaman":                       "greater accra",
		"Akraman":                         "greater accra",
		"Akramang":                        "greater accra",
		"Akramoman":                       "greater accra",
		"Akrao":                           "greater accra",
		"Akropon":                         "greater accra",
		"Akropong":                        "greater accra",
		"Akubrefa":                        "greater accra",
		"Akutase Medie":                   "greater accra",
		"Akwaman":                         "greater accra",
		"Akwechi":                         "greater accra",
		"Akweiman":                        "greater accra",
		"Akwetema":                        "greater accra",
		"Akweteyman":                      "greater accra",
		"Akweti":                          "greater accra",
		"Akwetsi":                         "greater accra",
		"Aladzo":                          "greater accra",
		"Alajo":                           "greater accra",
		"Algoboshie":                      "greater accra",
		"Amamole":                         "greater accra",
		"Amamoli":                         "greater accra",
		"Amamorley":                       "greater accra",
		"Amanfro":                         "greater accra",
		"Amasaman":                        "greater accra",
		"Amedua":                          "greater accra",
		"Amontidom":                       "greater accra",
		"Amrahia":                         "greater accra",
		"Amuanda":                         "greater accra",
		"Anafro":                          "greater accra",
		"Ankwadoboro":                     "greater accra",
		"Anoti":                           "greater accra",
		"Anumle":                          "greater accra",
		"Anunmle":                         "greater accra",
		"Anyino":                          "greater accra",
		"Apapa":                           "greater accra",
		"Apenkwa":                         "greater accra",
		"Aplaku":                          "greater accra",
		"Apoloni":                         "greater accra",
		"Apomasi":                         "greater accra",
		"Aprachiri":                       "greater accra",
		"Aprachiri Awuna Kwame":           "greater accra",
		"Aprakyir":                        "greater accra",
		"Apreweti":                        "greater accra",
		"Asabaham":                        "greater accra",
		"Asamoa":                          "greater accra",
		"Asebu":                           "greater accra",
		"Ashaaladza":                      "greater accra",
		"Ashaiman":                        "greater accra",
		"Ashaladza Botchway":              "greater accra",
		"Ashalaja":                        "greater accra",
		"Ashale Anan":                     "greater accra",
		"Ashalebotwe":                     "greater accra",
		"Ashalianan":                      "greater accra",
		"Ashieye":                         "greater accra",
		"Ashonman":                        "greater accra",
		"Ashouman":                        "greater accra",
		"Ashwenanmo":                      "greater accra",
		"Ashwenanyo":                      "greater accra",
		"Asikaisu":                        "greater accra",
		"Asikasu":                         "greater accra",
		"Asofa":                           "greater accra",
		"Asokrochona":                     "greater accra",
		"Asuaba":                          "greater accra",
		"Asuaba Number 2":                 "greater accra",
		"Asuaba Number 3":                 "greater accra",
		"Asumen":                          "greater accra",
		"Asuobonta":                       "greater accra",
		"Asuokyene":                       "greater accra",
		"Asuom":                           "greater accra",
		"Asuom Number 1":                  "greater accra",
		"Asylum Down":                     "greater accra",
		"Atakwa":                          "greater accra",
		"Atoman":                          "greater accra",
		"Augustinesbor":                   "greater accra",
		"Awchioma":                        "greater accra",
		"Awoshie":                         "greater accra",
		"Awudome Estate":                  "greater accra",
		"Awuku":                           "greater accra",
		"Awutu":                           "greater accra",
		"Ayaso":                           "greater accra",
		"Ayido":                           "greater accra",
		"Ayikai Doblo":                    "greater accra",
		"Ayim":                            "greater accra",
		"Baafa Number 1":                  "greater accra",
		"Babafa":                          "greater accra",
		"Babafa Number 1":                 "greater accra",
		"Badija":                          "greater accra",
		"Banana Inn":                      "greater accra",
		"Bantama":                         "greater accra",
		"Bawaleshi":                       "greater accra",
		"Bawjiasi":                        "greater accra",
		"Bebianeha":                       "greater accra",
		"Bebianiha":                       "greater accra",
		"Berekuso":                        "greater accra",
		"Birekuso":                        "greater accra",
		"Biuasi":                          "greater accra",
		"Biwadze":                         "greater accra",
		"Bleman":                          "greater accra",
		"Bodomasi":                        "greater accra",
		"Bodwoase":                        "greater accra",
		"Boedum":                          "greater accra",
		"Boi":                             "greater accra",
		"Bontrase":                        "greater accra",
		"Bontrasi":                        "greater accra",
		"Bortianor":                       "greater accra",
		"Botamfa":                         "greater accra",
		"Botiana":                         "greater accra",
		"Botianaw":                        "greater accra",
		"Botokura":                        "greater accra",
		"Bowenum":                         "greater accra",
		"Brayenda":                        "greater accra",
		"Bruburam":                        "greater accra",
		"Buade":                           "greater accra",
		"Bubiashie":                       "greater accra",
		"Buduatta":                        "greater accra",
		"Buduburam":                       "greater accra",
		"Bunmu":                           "greater accra",
		"Burma Camp":                      "greater accra",
		"Buruata":                         "greater accra",
		"Busomabina":                      "greater accra",
		"Cantonments":                     "greater accra",
		"Chantan":                         "greater accra",
		"Chinankama":                      "greater accra",
		"Chokome":                         "greater accra",
		"Chorkor":                         "greater accra",
		"Christian Village":               "greater accra",
		"Christians Village":              "greater accra",
		"Christiansborg":                  "greater accra",
		"Chwerebuana":                     "greater accra",
		"Chwinto":                         "greater accra",
		"Dabanyin":                        "greater accra",
		"Dabeyin":                         "greater accra",
		"Dadija":                          "greater accra",
		"Dakuyau":                         "greater accra",
		"Dakuyau Number1":                 "greater accra",
		"Dam":                             "greater accra",
		"Damfa":                           "greater accra",
		"Danchira":                        "greater accra",
		"Danfa":                           "greater accra",
		"Dankwakroa":                      "greater accra",
		"Dankwakrom":                      "greater accra",
		"Danso":                           "greater accra",
		"Dansoman Estate":                 "greater accra",
		"Dantsera":                        "greater accra",
		"Darkuman":                        "greater accra",
		"Dedeman":                         "greater accra",
		"Djankrom":                        "greater accra",
		"Doboro":                          "greater accra",
		"Doboro Dakokurom":                "greater accra",
		"Doborogonno":                     "greater accra",
		"Dom":                             "greater accra",
		"Dome":                            "greater accra",
		"Domeabra":                        "greater accra",
		"Domenase":                        "greater accra",
		"Domfaase":                        "greater accra",
		"Domfase":                         "greater accra",
		"Domiabra":                        "greater accra",
		"Duayeden":                        "greater accra",
		"Dukayaw":                         "greater accra",
		"Dzorwulu":                        "greater accra",
		"Dzorwulu Residential Area":       "greater accra",
		"East Dzorwulu Residential Area":  "greater accra",
		"East Legon Residential Area":     "greater accra",
		"East Ridge":                      "greater accra",
		"Ebron":                           "greater accra",
		"Esiwukroa":                       "greater accra",
		"Esuochwi":                        "greater accra",
		"Ewurukwa":                        "greater accra",
		"Fadziemohe":                      "greater accra",
		"Fajiemohe":                       "greater accra",
		"Fanchiniko":                      "greater accra",
		"Fete Gwa":                        "greater accra",
		"Fianko":                          "greater accra",
		"Fise":                            "greater accra",
		"Gbawe":                           "greater accra",
		"Gbegbe":                          "greater accra",
		"Gbegbeyise":                      "greater accra",
		"Giffard Camp":                    "greater accra",
		"Gonse":                           "greater accra",
		"Greda Estates":                   "greater accra",
		"Grefi":                           "greater accra",
		"Gwantenang":                      "greater accra",
		"Gyantomfo Kurom":                 "greater accra",
		"Gyeikrodua":                      "greater accra",
		"Honi":                            "greater accra",
		"Honi Adawroma":                   "greater accra",
		"Honi Seh":                        "greater accra",
		"Honiachim":                       "greater accra",
		"Honiatsim":                       "greater accra",
		"Honise":                          "greater accra",
		"Honiuchim":                       "greater accra",
		"Huni":                            "greater accra",
		"Industrial Area":                 "greater accra",
		"Jamestown":                       "greater accra",
		"Janman":                          "greater accra",
		"Jeikrodrua":                      "greater accra",
		"Jeikrodua":                       "greater accra",
		"Joma":                            "greater accra",
		"Juabin":                          "greater accra",
		"La":                              "greater accra",
		"La Bawalshie":                    "greater accra",
		"Labadi":                          "greater accra",
		"Labardi":                         "greater accra",
		"Lapaz":                           "greater accra",
		"Lartebiokorshi":                  "greater accra",
		"Lateman":                         "greater accra",
		"Legion":                          "greater accra",
		"Legon":                           "greater accra",
		"Loye":                            "greater accra",
		"Loye Bortey":                     "greater accra",
		"Maamobi":                         "greater accra",
		"Madina":                          "greater accra",
		"Maijaw":                          "greater accra",
		"Maiyera":                         "greater accra",
		"Malijaw":                         "greater accra",
		"Mamfam":                          "greater accra",
		"Mamobi":                          "greater accra",
		"Mamomom":                         "greater accra",
		"Mampehia":                        "greater accra",
		"Mampoase":                        "greater accra",
		"Mamprobi":                        "greater accra",
		"Manchiman":                       "greater accra",
		"Manhean":                         "greater accra",
		"Manhia":                          "greater accra",
		"Manokwa":                         "greater accra",
		"Mataheko":                        "greater accra",
		"Mayera":                          "greater accra",
		"Medina Estates":                  "greater accra",
		"Mensakwa":                        "greater accra",
		"Mensakwaa":                       "greater accra",
		"Mepeasm":                         "greater accra",
		"Mepom":                           "greater accra",
		"Meponi":                          "greater accra",
		"Mfojoboating":                    "greater accra",
		"Midie":                           "greater accra",
		"Milichakpo":                      "greater accra",
		"Ministries":                      "greater accra",
		"Minkumidie":                      "greater accra",
		"Mlichakpo":                       "greater accra",
		"Mpehuasem":                       "greater accra",
		"Mpekadam":                        "greater accra",
		"Mpuase":                          "greater accra",
		"Nankanso":                        "greater accra",
		"Nchechireche":                    "greater accra",
		"New Achimota":                    "greater accra",
		"New Fadema":                      "greater accra",
		"New Mamprobi":                    "greater accra",
		"New Russia":                      "greater accra",
		"Nianyano":                        "greater accra",
		"Niayano":                         "greater accra",
		"Niiboye Town":                    "greater accra",
		"Nima":                            "greater accra",
		"Ninyano":                         "greater accra",
		"Nkotunse":                        "greater accra",
		"Nkotunsi":                        "greater accra",
		"Nkwantanan":                      "greater accra",
		"Nkwantanang":                     "greater accra",
		"Nopendaw":                        "greater accra",
		"North Dzorwulu":                  "greater accra",
		"North Dzorwulu Residential Area": "greater accra",
		"North Industrial Area":           "greater accra",
		"North Kaneshie":                  "greater accra",
		"North Labone Estate":             "greater accra",
		"North Ordokor":                   "greater accra",
		"North Ridge":                     "greater accra",
		"Nsaki":                           "greater accra",
		"Nsakina":                         "greater accra",
		"Nsumia":                          "greater accra",
		"Nsuobri":                         "greater accra",
		"Nungoa":                          "greater accra",
		"Nungua":                          "greater accra",
		"Nungua Old Town":                 "greater accra",
		"Nungua Salem":                    "greater accra",
		"Nungwa":                          "greater accra",
		"Nyanawase":                       "greater accra",
		"Nyanawasi":                       "greater accra",
		"Nyaniba Estates":                 "greater accra",
		"Nyanyano":                        "greater accra",
		"Nyanyanu":                        "greater accra",
		"Obakrowa":                        "greater accra",
		"Obeye":                           "greater accra",
		"Obeyie":                          "greater accra",
		"Obiliakua":                       "greater accra",
		"Oblogo":                          "greater accra",
		"Oboasi":                          "greater accra",
		"Obodakawa":                       "greater accra",
		"Obokwashi":                       "greater accra",
		"Obologo":                         "greater accra",
		"Obome":                           "greater accra",
		"Obotumfa":                        "greater accra",
		"Obotumfo":                        "greater accra",
		"Obrachere":                       "greater accra",
		"Obrakrawa":                       "greater accra",
		"Obrakyere":                       "greater accra",
		"Obuasi":                          "greater accra",
		"Obutu":                           "greater accra",
		"Ochirekumfo":                     "greater accra",
		"Odawmo":                          "greater accra",
		"Odenki":                          "greater accra",
		"Odominadzi":                      "greater accra",
		"Odomponiasi":                     "greater accra",
		"Odotom":                          "greater accra",
		"Odotum":                          "greater accra",
		"Odumase":                         "greater accra",
		"Odumase Number 1":                "greater accra",
		"Odumasi":                         "greater accra",
		"Oduntia":                         "greater accra",
		"Odupon":                          "greater accra",
		"Oduponkpehe":                     "greater accra",
		"Odwobi":                          "greater accra",
		"Ofada":                           "greater accra",
		"Ofagyato Nyamebedzi":             "greater accra",
		"Ofako":                           "greater accra",
		"Ofakor":                          "greater accra",
		"Ofankor":                         "greater accra",
		"Ofaso":                           "greater accra",
		"Official Town":                   "greater accra",
		"Ofrajato":                        "greater accra",
		"Ofrajato Number 1":               "greater accra",
		"Ogbodzo":                         "greater accra",
		"Ogbojo":                          "greater accra",
		"Ojubi":                           "greater accra",
		"Okawso":                          "greater accra",
		"Oklu":                            "greater accra",
		"Oko":                             "greater accra",
		"Okoman":                          "greater accra",
		"Okorase":                         "greater accra",
		"Okorasi":                         "greater accra",
		"Okponglo":                        "greater accra",
		"Okushibiade":                     "greater accra",
		"Okushibiadi":                     "greater accra",
		"Okusubiri":                       "greater accra",
		"Okwabinabetinso":                 "greater accra",
		"Okwompa":                         "greater accra",
		"Old Damsoman":                    "greater accra",
		"Old Fadama":                      "greater accra",
		"Omenanokwaa":                     "greater accra",
		"Onibi":                           "greater accra",
		"Onibie":                          "greater accra",
		"Onyachia":                        "greater accra",
		"Onyansana":                       "greater accra",
		"Onyansanaa":                      "greater accra",
		"Opa":                             "greater accra",
		"Opeikuma":                        "greater accra",
		"Opeman":                          "greater accra",
		"Osabo":                           "greater accra",
		"Oshien":                          "greater accra",
		"Oshiuman":                        "greater accra",
		"Oshiyie":                         "greater accra",
		"Osimpo":                          "greater accra",
		"Osu":                             "greater accra",
		"Otinibi":                         "greater accra",
		"Otinshi":                         "greater accra",
		"Otuaplem":                        "greater accra",
		"Owiawosro":                       "greater accra",
		"Oworatia":                        "greater accra",
		"Owulabu":                         "greater accra",
		"Owuraman":                        "greater accra",
		"Oyamfa":                          "greater accra",
		"Oyarifa":                         "greater accra",
		"Oyauifa":                         "greater accra",
		"Oyinso":                          "greater accra",
		"Pambros Salt Ponds":              "greater accra",
		"Pantampa":                        "greater accra",
		"Pantampo":                        "greater accra",
		"Pantan":                          "greater accra",
		"Papao":                           "greater accra",
		"Papase":                          "greater accra",
		"Papase Kwabina Atta":             "greater accra",
		"Papasi":                          "greater accra",
		"Papasi Number 3":                 "greater accra",
		"Parakuo Estates":                 "greater accra",
		"Penim":                           "greater accra",
		"Pig Farm":                        "greater accra",
		"Pobiman":                         "greater accra",
		"Pokoase":                         "greater accra",
		"Pokoasi":                         "greater accra",
		"Pokuase":                         "greater accra",
		"Poukuase":                        "greater accra",
		"Ringway Estate":                  "greater accra",
		"Roman Bridge":                    "greater accra",
		"Sabon Zongo":                     "greater accra",
		"Sachikrom":                       "greater accra",
		"Sakumona":                        "greater accra",
		"Sakumono Estates":                "greater accra",
		"Salam":                           "greater accra",
		"Samsam":                          "greater accra",
		"Samsamso":                        "greater accra",
		"Sansame":                         "greater accra",
		"Santa Maria":                     "greater accra",
		"Santeo":                          "greater accra",
		"Sapeman":                         "greater accra",
		"Sempene":                         "greater accra",
		"Serehu":                          "greater accra",
		"Sesemi":                          "greater accra",
		"Shiayena":                        "greater accra",
		"Silehu":                          "greater accra",
		"Sodom and Gomorah":               "greater accra",
		"Sodom and Gomorrah":              "greater accra",
		"South Industrial Area":           "greater accra",
		"South La Estate":                 "greater accra",
		"South Ordokor":                   "greater accra",
		"Spintex Road":                    "greater accra",
		"Tassi":                           "greater accra",
		"Tebu":                            "greater accra",
		"Teiman":                          "greater accra",
		"Tema":                            "greater accra",
		"Temma":                           "greater accra",
		"Tenbibian":                       "greater accra",
		"Tesa":                            "greater accra",
		"Tesano":                          "greater accra",
		"Teshi Old Town":                  "greater accra",
		"Teshie":                          "greater accra",
		"Teshie Manheam":                  "greater accra",
		"Teshie Nungua Estates":           "greater accra",
		"Tete Ogbu":                       "greater accra",
		"Tetegbu":                         "greater accra",
		"Tipai":                           "greater accra",
		"Toboase":                         "greater accra",
		"Toboasi":                         "greater accra",
		"Tokuse":                          "greater accra",
		"Tokusee":                         "greater accra",
		"Toma":                            "greater accra",
		"Topiase":                         "greater accra",
		"Topiasi":                         "greater accra",
		"Trade Center":                    "greater accra",
		"Tsabaa":                          "greater accra",
		"Tsokome":                         "greater accra",
		"Tudu":                            "greater accra",
		"Tunga":                           "greater accra",
		"University of Ghana":             "greater accra",
		"Ussher Town":                     "greater accra",
		"Victoriaborg":                    "greater accra",
		"Weija":                           "greater accra",
		"West Legon Residential":          "greater accra",
		"West Ridge":                      "greater accra",
		"Wiaboman":                        "greater accra",
		"Wiriman":                         "greater accra",
		"Yahoman":                         "greater accra",
		"Yakagbomokpehe":                  "greater accra",
		"Zenu":                            "greater accra",
	}
)
