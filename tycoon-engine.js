// SAT Vocabulary Web Application - Restaurant Tycoon Incremental Engine

class TycoonEngine {
    constructor(appInstance) {
        this.app = appInstance;
        
        // Base structures & upgrades config
        this.state = {
            cash: 0.00,
            multiplierLevel: 1,  // Level 1: +0% (base), Level 2: +50%, Level 3: +100%
            tablesCount: 4,      // Base 4 tables, max 8 tables per floor
            staffLevel: 0,       // chefs/waiters
            tipJarLevel: 1,      // passive tip level
            currentFloor: 1,     // Floor expansions 1 to 4
            unlockedDishes: ["margherita_pizza"], // Start with 1 iconic entry unlocked
            lastTickTime: Date.now()
        };
        
        // Timer for passive loop ticks
        this.tickInterval = null;
        
        // Active serving state
        this.activeServingQuestion = null;
        
        // Emojis lists
        this.customerEmojis = ["😀", "👨‍💼", "👩‍⚕️", "🧑‍🎨", "👩‍🎓", "🧔", "👵", "👶", "👮", "👩‍🍳"];
        this.staffEmojis = ["👨‍🍳", "👩‍🍳", "🤵", "💁‍♀️", "💁‍♂️"];

        // ═══════════════════════════════════════════════════════════════════════
        // GLOBAL CULINARY DATABASE: 50 Countries, 6 Unique Dishes Each (300 Total)
        // ═══════════════════════════════════════════════════════════════════════
        this.dishDatabase = {
            "🇦🇫 Afghanistan": [
                { id: "kabuli_palaw", name: "Kabuli Palaw" }, { id: "mantu_dumplings", name: "Beef Mantu Dumplings" },
                { id: "ashak", name: "Leek Stuffed Ashak" }, { id: "chapli_kebab", name: "Spicy Chapli Kebab" },
                { id: "bolani", name: "Potato Bolani Flatbread" }, { id: "sheer_khurma", name: "Sweet Sheer Khurma" }
            ],
            "🇦🇱 Albania": [
                { id: "tave_kosi", name: "Tavë Kosi (Baked Lamb)" }, { id: "byrek_feta", name: "Feta Cheese Byrek" },
                { id: "fergese", name: "Fergesë of Tirana" }, { id: "qofte_te_frizura", name: "Fried Qofte Meatballs" },
                { id: "speca_me_glize", name: "Stuffed Peppers with Curd" }, { id: "trilece", name: "Trileçe Caramel Cake" }
            ],
            "🇩🇿 Algeria": [
                { id: "algerian_couscous", name: "Algerian Lamb Couscous" }, { id: "rechta_chicken", name: "Rechta Chicken Noodles" },
                { id: "chakhchoukha", name: "Chakhchoukha de Biskra" }, { id: "chorba_frik", name: "Chorba Frik Soup" },
                { id: "bourek_meat", name: "Crispy Meat Bourek Roll" }, { id: "makroudh", name: "Date Filled Makroudh" }
            ],
            "🇦🇷 Argentina": [
                { id: "argentinian_asado", name: "Asado Ribs Platter" }, { id: "beef_empanadas", name: "Tucumán Beef Empanadas" },
                { id: "milanesa_napolitana", name: "Milanesa Napolitana" }, { id: "locro_stew", name: "Hearty Corn Locro Stew" },
                { id: "choripan", name: "Choripán Chimichurri Roll" }, { id: "alfajores_dulce", name: "Alfajores de Dulce de Leche" }
            ],
            "🇦🇺 Australia": [
                { id: "aussie_meat_pie", name: "Aussie Beef Meat Pie" }, { id: "roast_lamb_mac", name: "Garlic Roast Lamb Leg" },
                { id: "chicken_parma", name: "Pub Style Chicken Parma" }, { id: "barramundi_grilled", name: "Grilled Barramundi Fillet" },
                { id: "sausage_sizzle", name: "Sausage Sizzle on White" }, { id: "pavlova_berry", name: "Pavlova Berry Meringue" }
            ],
            "🇦🇹 Austria": [
                { id: "wiener_schnitzel", name: "Classic Wiener Schnitzel" }, { id: "tafelspitz_beef", name: "Boiled Beef Tafelspitz" },
                { id: "kaiserschmarrn", name: "Shredded Kaiserschmarrn" }, { id: "sachertorte", name: "Viennese Sachertorte" },
                { id: "apfelstrudel", name: "Warm Apple Strudel" }, { id: "goulash_suppe", name: "Austrian Beef Goulash" }
            ],
            "🇧🇪 Belgium": [
                { id: "moules_frites", name: "Moules-Frites (Mussels)" }, { id: "carbonnade_flamande", name: "Carbonnade Flamande Beef" },
                { id: "belgian_waffles", name: "Brussels Pearl Sugar Waffles" }, { id: "sole_meuniere_belg", name: "North Sea Sole Meunière" },
                { id: "chicon_au_gratin", name: "Endives wrapped in Ham au Gratin" }, { id: "chocolate_mousse_belg", name: "Belgian Dark Chocolate Mousse" }
            ],
            "🇧olivian Bolivia": [
                { id: "saltenas_beef", name: "Juicy Beef Salteñas" }, { id: "pique_macho", name: "Pique Macho Platter" },
                { id: "silpancho", name: "Silpancho Beef Cutlet" }, { id: "sopa_de_mani", name: "Creamy Bolivian Peanut Soup" },
                { id: "anticucho_beef", name: "Flame Grilled Beef Heart Anticuchos" }, { id: "cuen_papas", name: "Chairo Paceño Stew" }
            ],
            "🇧🇷 Brazil": [
                { id: "feijoada_completa", name: "Feijoada Pork Black Bean Stew" }, { id: "picanha_steak", name: "Churrasco Picanha Steak" },
                { id: "coxinha_frango", name: "Coxinha Shredded Chicken Croquettes" }, { id: "moqueca_baiana", name: "Moqueca Seafood Stew" },
                { id: "pao_de_queijo", name: "Baked Cheese Pão de Queijo" }, { id: "brigadeiros_chocolate", name: "Sweet Chocolate Brigadeiros" }
            ],
            "🇨🇦 Canada": [
                { id: "classic_poutine", name: "Quebec Curd Cheese Poutine" }, { id: "tourtiere_pie", name: "French Canadian Meat Tourtière" },
                { id: "montreal_smoked_meat", name: "Montreal Smoked Meat Rye" }, { id: "peameal_bacon_roll", name: "Peameal Bacon Roll" },
                { id: "butter_tarts", name: "Flaky Caramel Butter Tarts" }, { id: "nanaimo_bars", name: "Layered Chocolate Nanaimo Bars" }
            ],
            "🇨🇱 Chile": [
                { id: "pastel_de_choclo", name: "Pastel de Choclo (Corn Pie)" }, { id: "empanada_pino", name: "Empanada de Pino" },
                { id: "cazuela_vacuno", name: "Cazuela Beef Bone Stew" }, { id: "completo_italiano", name: "Completo Italiano Hot Dog" },
                { id: "charquican_stew", name: "Charquicán Pumpkin Stew" }, { id: "mote_con_huesillo", name: "Sweet Mote con Huesillo" }
            ],
            "🇨🇳 China": [
                { id: "peking_duck", name: "Peking Roasted Duck" }, { id: "mapo_tofu_sichuan", name: "Sichuan Mapo Tofu" },
                { id: "xiaolongbao_dumplings", name: "Shanghai Xiaolongbao" }, { id: "gongbao_chicken", name: "Kung Pao Chicken" },
                { id: "hongshao_rou", name: "Red Braised Pork Belly" }, { id: "yangzhou_fried_rice", name: "Yangzhou Fried Rice" }
            ],
            "🇨🇴 Colombia": [
                { id: "bandeja_paisa", name: "Bandeja Paisa Mountain Platter" }, { id: "ajiaco_bogotano", name: "Ajiaco Chicken Potato Soup" },
                { id: "arepas_de_queso", name: "Griddled Cheese Stuffed Arepas" }, { id: "sancocho_colombiano", name: "Three-Meat Sancocho Stew" },
                { id: "lechona_tolimense", name: "Lechona Rice Stuffed Pig Roast" }, { id: "postre_de_natas", name: "Sweet Milk Postre de Natas" }
            ],
            "🇨🇺 Cuba": [
                { id: "ropa_vieja_cuba", name: "Shredded Ropa Vieja Beef" }, { id: "lechon_asado_cuba", name: "Mojo Marinated Lechón Asado" },
                { id: "moros_y_cristianos", name: "Moros y Cristianos Black Rice" }, { id: "cuban_sandwich", name: "Pressed Cubano Ham Sandwich" },
                { id: "vaca_fritta", name: "Crispy Pan Fried Vaca Frita Beef" }, { id: "tocanillo_sweet", name: "Cuban Caramel Tocanillo" }
            ],
            "🇩🇰 Denmark": [
                { id: "stegt_flaesk", name: "Stegt Flæsk (Crispy Pork Belly)" }, { id: "smorrebrod_herring", name: "Smørrebrød Pickled Herring Rye" },
                { id: "frikadeller_danish", name: "Pan Fried Danish Frikadeller" }, { id: "flaeskesteg_roast", name: "Crackling Flæskesteg Roast Pork" },
                { id: "rodgrod_med_flode", name: "Rødgrød med Fløde Berry Pudding" }, { id: "wienerbrod_pastry", name: "Danish Pastry Wienerbrød" }
            ],
            "🇪🇬 Egypt": [
                { id: "koshary_classic", name: "Koshary Rice & Lentil Macro-Bowl" }, { id: "ful_medames_fava", name: "Olive Oil Infused Ful Medames" },
                { id: "taameya_falafel", name: "Fava Bean Egyptian Ta'ameya" }, { id: "molokhia_chicken", name: "Garlic Molokhia Corchorus Stew" },
                { id: "fattah_beef", name: "Garlic Vinegar Beef Fattah Platter" }, { id: "ali_basha_basbousa", name: "Syrup Soaked Almond Basbousa" }
            ],
            "🇪thiopia Ethiopia": [
                { id: "doro_wat_injera", name: "Doro Wat Spicy Chicken Stew" }, { id: "kitfo_beef", name: "Spiced Clarified Butter Kitfo Beef" },
                { id: "tibbs_lamb", name: "Searing Hot Lamb Tibs Skillet" }, { id: "misir_wat", name: "Spicy Red Lentil Misir Wat Curry" },
                { id: "shiro_wat_chickpea", name: "Simmered Chickpea Shiro Wat Cream" }, { id: "gomen_wat", name: "Braised Collard Greens Gomen Wat" }
            ],
            "🇫🇮 Finland": [
                { id: "karjalanpiirakka", name: "Karelian Rice Pie (Karjalanpiirakka)" }, { id: "lohikeitto_soup", name: "Creamy Salmon Leek Lohikeitto Soup" },
                { id: "karjalanpaisti", name: "Karelian Hot Pot Meat Stew" }, { id: "poronkaristys", name: "Sautéed Reindeer with Lingonberries" },
                { id: "leipajuusto_cloudberry", name: "Squeaky Leipäjuusto Cheese Grid" }, { id: "korvapuusti", name: "Finnish Cardamom Cinnamon Buns" }
            ],
            "🇫🇷 France": [
                { id: "coq_au_vin", name: "Coq au Vin" }, { id: "boeuf_bourguignon", name: "Boeuf Bourguignon" },
                { id: "ratatouille_provencale", name: "Ratatouille" }, { id: "escargots_persillade", name: "Escargots en Persillade" },
                { id: "french_onion_soup", name: "Soupe à l'Oignon" }, { id: "creme_brulee_vanille", name: "Vanilla Bean Crème Brûlée" }
            ],
            "🇬🇪 Georgia": [
                { id: "adjarian_khachapuri", name: "Adjarian Cheese Boat Khachapuri" }, { id: "khinkali_dumplings", name: "Spiced Soup Dumplings Khinkali" },
                { id: "satsivi_chicken", name: "Walnut Sauce Chicken Satsivi" }, { id: "shashlik_pork", name: "Skewered Garlic Roast Pork Shashlik" },
                { id: "lobio_bean_pot", name: "Clay Pot Spiced Coriander Lobio" }, { id: "churchkhela_walnut", name: "Grape Juice Walnut Churchkhela" }
            ],
            "🇩🇪 Germany": [
                { id: "sauerbraten_beef", name: "Tangy Marinated Beef Sauerbraten" }, { id: "currywurst_berlin", name: "Berlin Fried Currywurst Skewer" },
                { id: "schweinshaxe_pork", name: "Crispy Roasted Pork Schweinshaxe" }, { id: "bratwurst_sauerkraut", name: "Grilled Bratwurst with Sauerkraut" },
                { id: "kasespatzle", name: "Mountain Cheese Spätzle Noodles" }, { id: "schwarzwald_cake", name: "Black Forest Cherry Kirsch Gateau" }
            ],
            "🇬🇭 Ghana": [
                { id: "ghana_jollof_rice", name: "Smoky Ghana Jollof Rice" }, { id: "fufu_light_soup", name: "Pounded Cassava Fufu in Light Soup" },
                { id: "waakye_beans", name: "Waakye Rice and Beans Combo" }, { id: "kelewele_plantain", name: "Spicy Fried Ginger Kelewele" },
                { id: "red_red_stew", name: "Red-Red Black Eyed Pea Plantain Stew" }, { id: "banku_tilapia", name: "Fermented Banku Corn with Grilled Tilapia" }
            ],
            "🇬🇷 Greece": [
                { id: "classic_moussaka", name: "Eggplant Potato Beef Moussaka" }, { id: "pork_souvlaki_pita", name: "Pork Souvlaki Gyro Wrap" },
                { id: "spanakopita_spinach", name: "Crispy Phyllo Dough Spanakopita" }, { id: "horiatiki_salad", name: "Feta Block Authentic Greek Salad" },
                { id: "tzatziki_pita_dip", name: "Garlic Cucumber Yogurt Tzatziki" }, { id: "baklava_walnut", name: "Spiced Honey Syrup Walnut Baklava" }
            ],
            "🇭🇺 Hungary": [
                { id: "hungarian_goulash", name: "Traditional Paprika Beef Gulyás" }, { id: "chicken_paprikash", name: "Creamy Chicken Paprikash Stew" },
                { id: "langos_garlic", name: "Fried Lángos Sour Cream Flatbread" }, { id: "toltott_kaposzta", name: "Stuffed Rice Meat Cabbage Rolls" },
                { id: "halaszle_soup", name: "Fiery Hot River Fisherman's Halászlé" }, { id: "somloi_galuska", name: "Layered Somlói Galuska Sponge Cake" }
            ],
            "🇮🇸 Iceland": [
                { id: "icelandic_lamb_soup", name: "Kjötsúpa (Hearty Lamb Soup)" }, { id: "plokkfiskur_fish", name: "Plokkfiskur White Fish Potato Gratin" },
                { id: "pan_fried_arctic_char", name: "Butter Fried Arctic Charr Fillet" }, { id: "rugbraud_rye", name: "Geothermal Baked Rúgbrauð Rye" },
                { id: "ponnukokur_pancakes", name: "Thin Crêpe Style Pönnukökur Buns" }, { id: "skyr_berry_parfait", name: "Skyr Thick Cream Berry Parfait" }
            ],
            "🇮🇳 India": [
                { id: "butter_chicken", name: "Murgh Makhani (Butter Chicken)" }, { id: "chicken_tikka_masala", name: "Chicken Tikka Masala" },
                { id: "hyderabadi_biryani", name: "Mutton Hyderabadi Biryani" }, { id: "palak_paneer", name: "Spinach & Cheese Palak Paneer" },
                { id: "pani_puri_water", name: "Street Style Crispy Pani Puri" }, { id: "gulab_jamun_syrup", name: "Warm Rose Sugar Gulab Jamun" }
            ],
            "🇮🇩 Indonesia": [
                { id: "nasi_goreng_ind", name: "Nasi Goreng Fried Rice Platter" }, { id: "beef_rendang_padang", name: "Slow Simmered Caramel Beef Rendang" },
                { id: "sate_ayam_peanut", name: "Charcoal Grilled Chicken Sate" }, { id: "gado_gado_salad", name: "Blanched Veg Gado-Gado Salad" },
                { id: "soto_ayam_soup", name: "Turmeric Spiced Rice Noodle Soto Soup" }, { id: "martabak_manis", name: "Thick Sweet Stuffed Martabak Manis" }
            ],
            "🇮🇷 Iran": [
                { id: "ghormeh_sabzi", name: "Ghormeh Sabzi Herb Lamb Stew" }, { id: "chelow_kebab_koobideh", name: "Minced Lamb Skewer Chelow Kebab" },
                { id: "fesenjan_stew", name: "Pomegranate Walnut Duck Fesenjān" }, { id: "tahdig_saffron_rice", name: "Crispy Saffron Crust Rice Tahdig" },
                { id: "ash_reshteh", name: "Noodle Green Bean Ash Reshteh Soup" }, { id: "sholeh_zard", name: "Saffron Rosewater Rice Sholeh Zard" }
            ],
            "🇮🇪 Ireland": [
                { id: "irish_lamb_stew", name: "Traditional Potato Irish Lamb Stew" }, { id: "bacon_and_cabbage", name: "Boiled Irish Bacon and Cabbage" },
                { id: "colcannon_potato", name: "Butter Mashed Kale Colcannon" }, { id: "coddle_dublin", name: "Pork Sausage Dublin Coddle Pot" },
                { id: "soda_bread_irish", name: "Baked Buttermilk Soda Bread Loaf" }, { id: "guinness_beef_pie", name: "Stout Braised Beef Mushroom Pie" }
            ],
            "🇮🇹 Italy": [
                { id: "margherita_pizza", name: "Margherita Pizza" }, { id: "risotto_alla_milanese", name: "Risotto alla Milanese" },
                { id: "lasagna_emiliana", name: "Lasagna Bolognese" }, { id: "spaghetti_carbonara", name: "Spaghetti Carbonara" },
                { id: "cacio_e_pepe", name: "Cacio e Pepe" }, { id: "tiramisu_tradizionale", name: "Classic Tiramisu" }
            ],
            "🇯🇲 Jamaica": [
                { id: "ackee_saltfish", name: "Ackee and Saltfish Breakfast" }, { id: "jerk_chicken_smoke", name: "Pimento Smoked Jerk Chicken Drum" },
                { id: "curry_goat_jamaica", name: "Thick Spiced Jamaican Curry Goat" }, { id: "oxtail_butter_beans", name: "Braised Oxtail with Butter Beans" },
                { id: "jamaican_patties", name: "Turmeric Crust Beef Jamaican Patties" }, { id: "bammy_cakes", name: "Fried Cassava Flour Bammy Cakes" }
            ],
            "🇯🇵 Japan": [
                { id: "tonkotsu_ramen", name: "Tonkotsu Ramen" }, { id: "maguro_sushi", name: "Tuna Nigiri Sushi" },
                { id: "shrimp_tempura", name: "Shrimp Tempura" }, { id: "chicken_katsu_curry", name: "Chicken Katsu Curry" },
                { id: "pork_okonomiyaki", name: "Hiroshima Okonomiyaki" }, { id: "wagyu_sukiyaki", name: "Wagyu Sukiyaki" }
            ],
            "🇰🇿 Kazakhstan": [
                { id: "beshbarmak_beef", name: "Beshbarmak (Meat & Flat Noodles)" }, { id: "kazy_sausage", name: "Traditional Horsemeat Kazy Sausage" },
                { id: "baursak_dough", name: "Puffy Fried Baursak Bread Pockets" }, { id: "manti_central_asia", name: "Steamed Lamb Pumpkin Manti" },
                { id: "shashlik_skewers_kaz", name: "Vinegar Marinated Beef Shashlik" }, { id: "kurt_cheese_balls", name: "Salty Dried Sour Milk Kurt Balls" }
            ],
            "🇰🇪 Kenya": [
                { id: "ugali_nyama_choma", name: "Ugali with Flame Grilled Nyama Choma" }, { id: "sukuma_wiki_greens", name: "Sautéed Spiced Sukuma Wiki Greens" },
                { id: "githeri_stew", name: "Corn and Bean Githeri Succotash" }, { id: "kenyan_chapati", name: "Layered Pan-Fried Kenyan Chapati" },
                { id: "kachumbari_salad", name: "Fresh Diced Onion Tomato Kachumbari" }, { id: "mahamri_cardamom", name: "Coconut Cardamom Mahamri Beignets" }
            ],
            "🇱🇧 Lebanon": [
                { id: "kibbeh_nayyeh", name: "Spiced Bulgur Lamb Kibbeh Nayyeh" }, { id: "chicken_shawarma_wrap", name: "Spit Roasted Chicken Shawarma Wrap" },
                { id: "hummus_bi_tahini", name: "Chickpea Tahini Cream Hummus Dip" }, { id: "tabbouleh_salad", name: "Finely Chopped Parsley Tabbouleh" },
                { id: "falafel_tahini", name: "Deep Fried Fava Bean Falafel Balls" }, { id: "sfouf_turmeric", name: "Almond Baked Turmeric Sfouf Cake" }
            ],
            "🇲🇾 Malaysia": [
                { id: "nasi_lemak_sambal", name: "Nasi Lemak Coconut Rice Combo" }, { id: "beef_rendang_malay", name: "Malay Reduction Beef Rendang" },
                { id: "chicken_laksa_soup", name: "Spicy Creamy Coconut Curry Laksa" }, { id: "char_kway_teow", name: "Wok Hei Seafood Char Kway Teow" },
                { id: "roti_canai_dhal", name: "Flaky Flipped Roti Canai with Dhal" }, { id: "cendol_sweet", name: "Pandan Jelly Coconut Milk Cendol" }
            ],
            "🇲🇽 Mexico": [
                { id: "tacos_al_pastor", name: "Tacos al Pastor" }, { id: "mole_poblano", name: "Chicken Mole Poblano" },
                { id: "chiles_en_nogada", name: "Chiles en Nogada" }, { id: "enchiladas_verdes", name: "Tomatillo Enchiladas Verdes" },
                { id: "pozole_rojo", name: "Pork Pozole Rojo Stew" }, { id: "guacamole_molcajete", name: "Tableside Stone Guacamole" }
            ],
            "🇲🇦 Morocco": [
                { id: "lamb_tagine_prunes", name: "Saffron Lamb Tagine with Prunes" }, { id: "moroccan_couscous_seven", name: "Seven Vegetable Steamed Couscous" },
                { id: "chicken_bastilla", name: "Sweet Savory Cinnamon Chicken Pastilla" }, { id: "harira_soup", name: "Lentil Chickpea Tomato Harira Soup" },
                { id: "zaalouk_eggplant", name: "Roasted Tomato Eggplant Zaalouk Dip" }, { id: "chebakia_honey", name: "Sesame Flower Honey Fried Chebakia" }
            ],
            "🇳🇵 Nepal": [
                { id: "dal_bhat_tarkari", name: "Dal Bhat Tarkari Rice Lentil Platter" }, { id: "buff_momo_nepal", name: "Steamed Buffalo Spiced Momo Dumplings" },
                { id: "thakali_khana_set", name: "Traditional Thakali Feast Set" }, { id: "gundruk_soup", name: "Fermented Leafy Green Gundruk Soup" },
                { id: "choila_spicy", name: "Fiery Charcoal Grilled Newari Choila" }, { id: "sel_roti_rice", name: "Crispy Sweet Ring Shaped Sel Roti" }
            ],
            "🇳🇱 Netherlands": [
                { id: "stamppot_rookworst", name: "Stamppot Mash with Smoked Rookworst" }, { id: "soused_herring_onion", name: "Soused Raw Herring with Sweet Onions" },
                { id: "bitterballen_mustard", name: "Deep Fried Béchamel Meat Bitterballen" }, { id: "erwtensoep_snert", name: "Thick Split Pea Pork Snert Soup" },
                { id: "stroopwafel_caramel", name: "Warm Gooey Cinnamon Stroopwafels" }, { id: "poffertjes_butter", name: "Puffy Mini Poffertjes Pancakes" }
            ],
            "🇳🇿 New Zealand": [
                { id: "hangi_feast_earth", name: "Traditional Earth Oven Hāngī Feast" }, { id: "nz_roast_lamb", name: "Rosemary Roasted New Zealand Lamb" },
                { id: "bacon_egg_pie_nz", name: "Crusted Bacon and Egg Picnic Pie" }, { id: "whitebait_fritter", name: "Delicate Fried West Coast Whitebait Fritter" },
                { id: "bluff_oysters_raw", name: "Fresh Raw Bluff Oysters on Ice" }, { id: "hokey_pokey_ice", name: "Creamy Hokey Pokey Toffee Ice Cream" }
            ],
            "🇳🇬 Nigeria": [
                { id: "nigerian_jollof_rice", name: "Classic Party Fire-Smoked Jollof" }, { id: "pounded_yam_egusi", name: "Pounded Yam with Melon Seed Egusi" },
                { id: "suya_beef_skewers", name: "Yaji Spiced Charcoal Beef Suya" }, { id: "amala_ewedu_gbegiri", name: "Yam Flour Amala with Jute Leaf Soup" },
                { id: "pepper_soup_goat", name: "Fiery Spiced Clarified Goat Pepper Soup" }, { id: "chin_chin_crunch", name: "Sweet Crunchy Fried Chin Chin Cubes" }
            ],
            "🇵🇰 Pakistan": [
                { id: "karachi_beef_biryani", name: "Spicy Saffron Layered Beef Biryani" }, { id: "nihari_slow_shank", name: "Overnight Slow Cooked Beef Shank Nihari" },
                { id: "chicken_karahi_wok", name: "Ginger Tomato Stir-Fried Chicken Karahi" }, { id: "seekh_kebab_minced", name: "Clay Oven Skewered Beef Seekh Kebab" },
                { id: "haleem_lentil_stew", name: "Slow Pounded Wheat Meat Haleem Stew" }, { id: "shahi_tukray_pudding", name: "Saffron Infused Cardamom Shahi Tukray" }
            ],
            "🇵🇪 Peru": [
                { id: "ceviche_clasico_peru", name: "Lime Cured Corvina Ceviche Clasico" }, { id: "lomo_saltado_wok", name: "Wok Seared Beef Strip Lomo Saltado" },
                { id: "causa_rellena_pollo", name: "Layered Yellow Potato Causa Rellena" }, { id: "anticuchos_de_corazon", name: "Aji Panca Spiced Beef Heart Skewers" },
                { id: "aji_de_gallina", name: "Creamy Walnut Yellow Chili Chicken Stew" }, { id: "suspiro_lima", name: "Sweet Dulce de Leche Suspiro a la Limeña" }
            ],
            "🇵🇭 Philippines": [
                { id: "chicken_adobo_soy", name: "Garlic Cane Vinegar Chicken Adobo" }, { id: "lechon_cebu_crispy", name: "Spit Roasted Whole Crispy Pig Lechon" },
                { id: "sinigang_na_baboy", name: "Sour Tamarind Broth Pork Sinigang" }, { id: "sisig_sizzling_pork", name: "Sizzling Calamansi Tossed Pork Sisig" },
                { id: "pancit_canton_seafood", name: "Stir Fried Garlic Seafood Pancit Canton" }, { id: "halo_halo_ice", name: "Layered Shaved Ice Sweet Ube Halo-Halo" }
            ],
            "🇵🇱 Poland": [
                { id: "pierogi_ruskie", name: "Potato Cheese Pan Seared Pierogi" }, { id: "bigos_hunter_stew", name: "Smoked Kielbasa Sauerkraut Bigos Stew" },
                { id: "barszcz_czerwony", name: "Sour Beetroot Red Barszcz with Uszka" }, { id: "kotlet_schabowy", name: "Breaded Pork Cutlet Kotlet Schabowy" },
                { id: "zurek_rye_soup", name: "Sour Rye Fermented Żurek Egg Sausage" }, { id: "sernik_polish", name: "Baked Sweet Tworóg Quark Sernik Cake" }
            ],
            "🇵🇹 Portugal": [
                { id: "bacalhau_bras", name: "Bacalhau à Brás (Shredded Cod)" }, { id: "francesinha_sandwich", name: "Beer Sauce Drenched Francesinha Sandwich" },
                { id: "caldo_verde_soup", name: "Chorizo Potato Shaved Kale Caldo Verde" }, { id: "arroz_de_marisco", name: "Rich Tomato Seafood Rice Cataplana" },
                { id: "papo_de_anjo", name: "Syrup Soaked Egg Yolk Papo de Anjo" }, { id: "pastel_de_nata", name: "Blistered Egg Custard Pastel de Nata" }
            ],
            "🇷🇴 Romania": [
                { id: "sarmale_cabbage", name: "Sarmale Pork Rice Cabbage Rolls" }, { id: "mici_garlic_grill", name: "Skinless Garlic Spiced Mici Roll Grills" },
                { id: "mamaliga_sour_cream", name: "Polenta Mămăligă with Brânză Cheese" }, { id: "ciorba_de_burta", name: "Sour Cream Garlic Beef Tripe Ciorbă" },
                { id: "salata_de_vinete", name: "Smoky Charred Eggplant Vinete Whip" }, { id: "papanasi_sour_cherry", name: "Fried Papanasi Cheese Doughnut Ball" }
            ],
            "🇷🇺 Russia": [
                { id: "beef_stroganoff_cream", name: "Sautéed Beef Strips Beef Stroganoff" }, { id: "russian_borscht_beet", name: "Beef Cabbage Beetroot Borscht Soup" },
                { id: "pelmeni_meat_dumpling", name: "Siberian Pork Beef Stuffed Pelmeni" }, { id: "blini_caviar_sour", name: "Thin Buckwheat Blini with Caviar" },
                { id: "pirozhki_baked_meat", name: "Baked Stuffed Yeast Buns Pirozhki" }, { id: "olivier_salad_mayo", name: "Diced Potato Chicken Olivier Salad" }
            ],
            "🇸🇦 Saudi Arabia": [
                { id: "al_kabsa_chicken", name: "Al Kabsa Basmati Chicken Platter" }, { id: "saleeg_milk_rice", name: "Creamy Milk Boiled Chicken Saleeg" },
                { id: "jareesh_wheat_stew", name: "Crushed Savory Wheat Yogurt Jareesh" }, { id: "mutabbaq_pan_fried", name: "Minced Meat Stuffed Folded Mutabbaq" },
                { id: "mandi_smoky_lamb", name: "Underground Smoked Lamb Mandi Rice" }, { id: "maqshus_honey_bites", name: "Cardamom Baked Ghee Honey Maqshus" }
            ],
            "🇸🇬 Singapore": [
                { id: "chilli_crab_mantou", name: "Savoury Egg Tomato Chilli Mud Crab" }, { id: "hainanese_chicken_rice", name: "Poached Chicken Fat Infused Rice Set" },
                { id: "laksa_katong", name: "Spicy Dried Shrimp Coconut Katong Laksa" }, { id: "char_kway_teow_sg", name: "Wok Fried Broad Dark Soy Kway Teow" },
                { id: "roti_prata_mutton", name: "Crispy Stretched Flat Roti Prata Curry" }, { id: "kaya_toast_eggs", name: "Coconut Egg Jam Kaya Toast Soft Eggs" }
            ],
            "🇿🇦 South Africa": [
                { id: "bobotie_minced_bake", name: "Spiced Minced Beef Egg Custard Bobotie" }, { id: "bunny_chow_curry", name: "Hollowed Bread Loaf Chicken Bunny Chow" },
                { id: "braai_boerewors_sa", name: "Spiced Coriander Spiral Boerewors Braai" }, { id: "biltong_cured_beef", name: "Coriander Spiced Air Dried Beef Biltong" },
                { id: "chakalaka_pap", name: "Spicy Spicy Vegetable Chakalaka with Pap" }, { id: "koeksisters_syrup", name: "Braided Twisted Cold Syrup Koeksisters" }
            ],
            "🇰🇷 South Korea": [
                { id: "classic_bibimbap", name: "Sizzling Hot Stone Bowl Bibimbap" }, { id: "aged_cabbage_kimchi", name: "Fermented Chili Gochugaru Cabbage Kimchi" },
                { id: "bulgogi_ribeye", name: "Sweet Soy Marinated Ribeye Bulgogi" }, { id: "tteokbokki_spicy", name: "Gochujang Simmered Rice Cake Tteokbokki" },
                { id: "samgyeopsal_pork", name: "Tableside Grilled Pork Belly Samgyeopsal" }, { id: "kimchi_jjigae_stew", name: "Sizzling Spicy Pork Tofu Kimchi Jjigae" }
            ],
            "🇪🇸 Spain": [
                { id: "paella_valenciana", name: "Seafood Paella Valenciana" }, { id: "jamon_iberico_bellota", name: "Acorn-Fed Jamón Ibérico Platter" },
                { id: "tortilla_de_patatas", name: "Spanish Potato Tortilla" }, { id: "patatas_bravas", name: "Spicy Tomato Patatas Bravas" },
                { id: "gambas_al_ajillo", name: "Sizzling Garlic Gambas al Ajillo" }, { id: "churros_madrid", name: "Madrid Churros & Dark Chocolate" }
            ],
            "🇱🇰 Sri Lanka": [
                { id: "sri_lankan_rice_curry", name: "Rice & Five Veg-and-Meat Curry Spread" }, { id: "kottu_roti_chicken", name: "Chopped Griddle Flatbread Chicken Kottu" },
                { id: "egg_hoppers_appa", name: "Crispy Bowl Shaped Coconut Rice Hoppers" }, { id: "pol_sambol_coconut", name: "Fresh Ground Chili Onion Coconut Sambol" },
                { id: "ambul_thiyal_fish", name: "Sour Goraka Dried Black Pepper Tuna" }, { id: "watalappan_jaggery", name: "Spiced Coconut Cardamom Jaggery Pudding" }
            ],
            "🇸🇪 Sweden": [
                { id: "swedish_meatballs", name: "Köttbullar Cream Sauce Meatballs" }, { id: "gravlax_dill_mustard", name: "Cured Dill Gravlax Salmon Strips" },
                { id: "stromming_fried", name: "Crispy Battered Baltic Fried Strömming" }, { id: "artsoppa_pancakes", name: "Thursday Yellow Split Pea Ärtsoppa Soup" },
                { id: "smorgastarta_cake", name: "Savory Layered Seafood Smörgåstårta" }, { id: "prinsesstarta_green", name: "Green Marzipan Layered Princess Cake" }
            ],
            "🇨🇭 Switzerland": [
                { id: "fondue_neuchateloise", name: "Gruyère Vacherin Bubbling Cheese Fondue" }, { id: "berner_rosti_potato", name: "Pan Fried Bacon Onion Röstis Patty" },
                { id: "raclette_melted", name: "Scraped Melted Raclette Cheese Potatoes" }, { id: "zurcher_geschnetzeltes", name: "Creamy Mushroom Sliced Veal Zürich" },
                { id: "alplermagronen_mac", name: "Alpine Macaroni Cheese Apple Compote" }, { id: "nusstorte_engadin", name: "Engadin Caramelized Walnut Nusstorte" }
            ],
            "🇹🇼 Taiwan": [
                { id: "niu_rou_mian_beef", name: "Slow Braised Rich Beef Noodle Soup" }, { id: "lu_rou_fan_pork", name: "Minced Pork Belly Gravy Lu Rou Fan" },
                { id: "taiwanese_fried_chicken", name: "Five-Spice Crisp Basil Giant Chop" }, { id: "oyster_omelet_gooey", name: "Starch Bound Garlic Chili Oyster Omelet" },
                { id: "gua_bao_pork_belly", name: "Steamed Lotus Bun Pork Belly Gua Bao" }, { id: "pineapple_cakes_feng", name: "Shortcrust Pastry Sweet Pineapple Cake" }
            ],
            "🇹🇭 Thailand": [
                { id: "pad_thai_shrimp", name: "Classic Pad Thai Noodles" }, { id: "tom_yum_goong", name: "Spicy Lemongrass Tom Yum Soup" },
                { id: "gaeng_kiew_wan", name: "Coconut Thai Green Curry" }, { id: "massaman_curry_beef", name: "Peanut Cardamom Massaman Curry" },
                { id: "som_tum_salad", name: "Green Papaya Som Tum Salad" }, { id: "khao_niao_mamuang", name: "Sweet Coconut Mango Sticky Rice" }
            ],
            "🇹🇳 Tunisia": [
                { id: "tunisian_couscous_fish", name: "Spicy Harissa Grouper Fish Couscous" }, { id: "brik_au_thon", name: "Crispy Phyllo Egg Tuna Brik Pocket" },
                { id: "ojja_shakshuka_merguez", name: "Spicy Merguez Sausage Ojja Egg Stew" }, { id: "lablabi_garlic_chickpea", name: "Garlic Cumin Chickpea Crust Lablabi" },
                { id: "mechouia_salad", name: "Charred Ground Pepper Tomato Mechouia" }, { id: "bambalouni_sugar", name: "Fried Sweet Tunisian Bambalouni Ring" }
            ],
            "🇹🇷 Turkiye": [
                { id: "iskender_kebab_lamb", name: "Searing Butter Shaved Iskender Kebab" }, { id: "kuru_fasulye_pilav", name: "Tomato White Bean Stew with Butter Rice" },
                { id: "manti_turkish_garlic", name: "Mini Spiced Beef Dumpling Garlic Manti" }, { id: "karniyarik_eggplant", name: "Minced Meat Stuffed Karnıyarık Eggplant" },
                { id: "lahmacun_flatbread", name: "Ultra Thin Spiced Lamb Meat Lahmacun" }, { id: "fistikli_baklava", name: "Gaziantep Pistachio Honey Flaky Baklava" }
            ],
            "🇺🇦 Ukraine": [
                { id: "ukrainian_borscht_sour", name: "Pork Rib Beetroot Ukrainian Borscht" }, { id: "varenyky_potato_onion", name: "Boiled Potato Sour Cream Varenyky" },
                { id: "chicken_kiev_butter", name: "Herb Butter Stuffed Breaded Chicken Kiev" }, { id: "holubtsi_cabbage", name: "Tomato Smothered Rice Meat Holubtsi" },
                { id: "deruny_potato_pancakes", name: "Grated Crispy Onion Garlic Deruny Cakes" }, { id: "syrnyki_sweet_quark", name: "Pan Fried Sweet Quark Cheese Syrnyki" }
            ],
            "🇬🇧 United Kingdom": [
                { id: "fish_chips_haddock", name: "Beer Battered Haddock Fish and Chips" }, { id: "chicken_tikka_masala_uk", name: "Pub Style Creamy Chicken Tikka Masala" },
                { id: "beef_wellington_crust", name: "Mushroom Duxelles Beef Wellington" }, { id: "traditional_haggis_neeps", name: "Scottish Spiced Oats Haggis Platter" },
                { id: "sunday_roast_yorkshire", name: "Roast Beef Gravy Yorkshire Pudding" }, { id: "sticky_toffee_pud", name: "Warm Rich Toffee Sponge Pudding Date" }
            ],
            "🇺🇸 USA": [
                { id: "classic_cheeseburger", name: "Gourmet Aged Beef Smash Cheeseburger" }, { id: "texas_brisket_bbq", name: "Hickory Smoked Texas Beef Brisket" },
                { id: "maine_lobster_roll", name: "Butter Poached Maine Lobster Roll" }, { id: "buffalo_wings_blue", name: "Spicy Cayenne Buffalo Chicken Wings" },
                { id: "new_england_clam_chowder", name: "Creamy Bacon New England Chowder" }, { id: "apple_pie_ala_mode", name: "Cinnamon Lattice Apple Pie à la Mode" }
            ],
            "🇺🇿 Uzbekistan": [
                { id: "uzbek_plov_osh", name: "Tashkent Wedding Plov (O'sh Pilaf)" }, { id: "shurpa_lamb_soup", name: "Clear Thick Broth Lamb Veg Shurpa Soup" },
                { id: "obon_flatbread", name: "Clay Oven Stamped Round Uzbek Bread" }, { id: "lagman_hand_pulled", name: "Spicy Hand Pulled Noodle Lamb Lagman" },
                { id: "somsa_lamb_pastry", name: "Flaky Tandoor Baked Meat Somsa Pocket" }, { id: "shashlik_beef_fat", name: "Alternating Beef Onion Skewer Shashlik" }
            ],
            "🇻🇪 Venezuela": [
                { id: "pabellon_criollo_stew", name: "Shredded Beef Pabellón Criollo" }, { id: "reina_pepiada_arepa", name: "Avocado Chicken Salad Reina Arepa" },
                { id: "cachapa_queso_mano", name: "Sweet Sweet Corn Cheese Slap Cachapas" }, { id: "hallaca_christmas_wrap", name: "Plantain Leaf Corn Meal Stuffed Hallaca" },
                { id: "asado_negro_caramel", name: "Sugarcane Eye Round Roast Asado Negro" }, { id: "bienmesabe_coconut", name: "Liquor Soaked Layered Coconut Bienmesabe" }
            ],
            "🇻🇳 Vietnam": [
                { id: "beef_pho_bo_hanoi", name: "Hanoi Bone Broth Beef Ribbon Phở" }, { id: "banh_mi_thit_pate", name: "Crispy Baguette Pork Pâté Bánh Mì" },
                { id: "bun_cha_hanoi_pork", name: "Charcoal Grilled Meatball Bún Chả" }, { id: "goi_cuon_shrimp", name: "Translucent Rice Sheet Shrimp Gỏi Cuốn" },
                { id: "banh_xeo_crispy", name: "Turmeric Rice Batter Pork Bánh Xèo" }, { id: "ca_phe_trung_egg", name: "Sweet Frothy Condensed Milk Egg Coffee" }
            ]
        };
    }

    init() {
        this.loadState();
        this.startPassiveEarnings();
        this.renderVisuals();
        this.updateUI();
        this.bindEvents();
    }

    loadState() {
        const saved = localStorage.getItem('sat_vocab_tycoon_state');
        if (saved) {
            try {
                this.state = { ...this.state, ...JSON.parse(saved) };
                if (!this.state.unlockedDishes || this.state.unlockedDishes.length === 0) {
                    this.state.unlockedDishes = ["margherita_pizza"];
                }
                this.state.lastTickTime = Date.now();
            } catch(e) {
                console.error("Failed to parse tycoon state:", e);
            }
        }
    }

    saveState() {
        localStorage.setItem('sat_vocab_tycoon_state', JSON.stringify(this.state));
        this.app.syncSidebarTycoon();
    }

    getUnlockedDishesCount() {
        return Array.isArray(this.state.unlockedDishes) ? this.state.unlockedDishes.length : 1;
    }

    getRestaurantReviewStars() {
        const unlockedCount = this.getUnlockedDishesCount();
        
        // Logarithmic star calculation scales linearly up to 5.0 stars across the full 300 item catalog database base.
        let calculation = 1.5 + (Math.log(unlockedCount) / Math.log(300)) * 3.5;
        
        const targetTables = this.state.currentFloor * 4;
        if (this.state.tablesCount < targetTables) calculation -= 0.3;
        if (this.state.staffLevel < this.state.currentFloor * 2) calculation -= 0.2;

        return Math.min(5.0, Math.max(1.0, parseFloat(calculation.toFixed(1))));
    }

    getUpgradeCost(type) {
        switch(type) {
            case 'multiplier':
                return Math.round(50 * Math.pow(1.5, this.state.multiplierLevel - 1));
            case 'tables':
                const maxTablesForTotalFloors = this.state.currentFloor * 8;
                if (this.state.tablesCount >= maxTablesForTotalFloors || this.state.tablesCount >= 32) return Infinity;
                return Math.round(150 * Math.pow(2.0, this.state.tablesCount - 4));
            case 'staff':
                return Math.round(300 * Math.pow(1.8, this.state.staffLevel));
            case 'tipjar':
                return Math.round(100 * Math.pow(1.6, this.state.tipJarLevel - 1));
            case 'floor':
                if (this.state.currentFloor >= 4) return Infinity;
                const floorCosts = [0, 1000, 5000, 25000];
                return floorCosts[this.state.currentFloor];
            case 'dish':
                const currentUnlocked = this.getUnlockedDishesCount();
                if (currentUnlocked >= 300) return Infinity;
                return Math.round(75 * Math.pow(1.045, currentUnlocked - 1));
            default:
                return 0;
        }
    }

    getPassiveIncomeRate() {
        const tipRate = 0.25 * this.state.tipJarLevel;
        const staffEfficiency = 1.0 + (this.state.staffLevel * 0.15);
        const floorMultiplier = Math.pow(2.5, this.state.currentFloor - 1);
        const reviewMultiplier = this.getRestaurantReviewStars() / 3.0; 
        
        return this.state.tablesCount * tipRate * staffEfficiency * floorMultiplier * reviewMultiplier;
    }

    getActiveServeBonus() {
        const baseBonus = 100.00;
        const multiplier = 1.0 + (this.state.multiplierLevel - 1) * 0.5;
        const floorMultiplier = Math.pow(3.0, this.state.currentFloor - 1);
        const reviewMultiplier = this.getRestaurantReviewStars() / 3.0;
        
        return baseBonus * multiplier * floorMultiplier * reviewMultiplier;
    }

    startPassiveEarnings() {
        if (this.tickInterval) clearInterval(this.tickInterval);
        this.state.lastTickTime = Date.now();
        
        this.tickInterval = setInterval(() => {
            const now = Date.now();
            const elapsedSeconds = (now - this.state.lastTickTime) / 1000;
            this.state.lastTickTime = now;
            
            const incomeRate = this.getPassiveIncomeRate();
            const earned = incomeRate * elapsedSeconds;
            
            if (earned > 0) {
                this.state.cash += earned;
                this.updateUI();
                
                if (Math.random() < 0.08) {
                    this.seatRandomCustomers();
                }
            }
        }, 200);
    }

    updateUI() {
        document.getElementById('tycoon-cash').textContent = this.state.cash.toFixed(2);
        document.getElementById('tycoon-income-rate').textContent = this.getPassiveIncomeRate().toFixed(2);
        document.getElementById('tycoon-floor-display').textContent = `Floor ${this.state.currentFloor}`;
        document.getElementById('tycoon-seating-ratio').textContent = `Capacity: ${this.state.tablesCount * 4} / ${this.state.currentFloor * 32} seats`;
        document.getElementById('serve-bonus-val').textContent = this.getActiveServeBonus().toFixed(2);

        const reviewStars = this.getRestaurantReviewStars();
        const starsContainer = document.getElementById('tycoon-review-stars');
        if (starsContainer) {
            let starString = "";
            for (let s = 1; s <= 5; s++) {
                if (s <= Math.round(reviewStars)) starString += "★";
                else starString += "☆";
            }
            starsContainer.textContent = `${starString} (${reviewStars} / 5.0 Stars)`;
        }

        this.updateShopItem('multiplier', this.state.multiplierLevel);
        this.updateShopItem('tables', this.state.tablesCount);
        this.updateShopItem('staff', this.state.staffLevel);
        this.updateShopItem('tipjar', this.state.tipJarLevel);
        this.updateShopItem('floor', this.state.currentFloor);
        this.updateShopItem('dish', this.getUnlockedDishesCount());
        
        this.renderMenuPanelList();
    }

    updateShopItem(type, level) {
        const itemEl = document.getElementById(`upgrade-${type}`);
        if (!itemEl) return;
        
        const cost = this.getUpgradeCost(type);
        const buyBtn = itemEl.querySelector('.upgrade-buy-btn');
        const levelVal = itemEl.querySelector('.level-val');
        if (levelVal) levelVal.textContent = level;
        
        if (type === 'tables') {
            const countVal = itemEl.querySelector('.count-val');
            if (countVal) countVal.textContent = level;
        }
        
        if (cost === Infinity) {
            buyBtn.innerHTML = "MAXED";
            buyBtn.disabled = true;
            buyBtn.className = "btn upgrade-buy-btn disabled";
        } else {
            buyBtn.querySelector('.price-val').textContent = cost.toFixed(0);
            if (this.state.cash >= cost) {
                buyBtn.disabled = false;
                buyBtn.className = "btn btn-indigo upgrade-buy-btn";
                if (type === 'floor') buyBtn.className = "btn btn-gold upgrade-buy-btn";
                if (type === 'dish') buyBtn.className = "btn btn-emerald upgrade-buy-btn";
            } else {
                buyBtn.disabled = true;
                buyBtn.className = "btn upgrade-buy-btn disabled";
            }
        }
    }

    bindEvents() {
        const upgradeItems = ['multiplier', 'tables', 'staff', 'tipjar', 'floor', 'dish'];
        upgradeItems.forEach(type => {
            const itemEl = document.getElementById(`upgrade-${type}`);
            if (!itemEl) return;
            const btn = itemEl.querySelector('.upgrade-buy-btn');
            btn.onclick = null;
            btn.onclick = () => this.buyUpgrade(type);
        });

        const serveBtn = document.getElementById('serve-customer-btn');
        serveBtn.onclick = () => this.launchServeQuestion();
    }

    findNextAvailableDishToUnlock() {
        const countries = Object.keys(this.dishDatabase);
        
        // Scan sequential layers across all country structures horizontally to keep unlocks evenly distributed
        for (let i = 0; i < 6; i++) { 
            for (let c = 0; c < countries.length; c++) {
                const countryList = this.dishDatabase[countries[c]];
                const targetDish = countryList[i];
                if (targetDish && !this.state.unlockedDishes.includes(targetDish.id)) {
                    return { ...targetDish, country: countries[c] };
                }
            }
        }
        return null;
    }

    buyUpgrade(type) {
        const cost = this.getUpgradeCost(type);
        if (this.state.cash >= cost) {
            this.state.cash -= cost;
            
            if (type === 'multiplier') this.state.multiplierLevel++;
            else if (type === 'tables') {
                const maxTablesForTotalFloors = this.state.currentFloor * 8;
                this.state.tablesCount = Math.min(maxTablesForTotalFloors, this.state.tablesCount + 1);
            }
            else if (type === 'staff') this.state.staffLevel++;
            else if (type === 'tipjar') this.state.tipJarLevel++;
            else if (type === 'floor') this.state.currentFloor = Math.min(4, this.state.currentFloor + 1);
            else if (type === 'dish') {
                const nextDish = this.findNextAvailableDishToUnlock();
                if (nextDish) {
                    this.state.unlockedDishes.push(nextDish.id);
                    this.app.showNotification("Dish Unlocked! 🍳", `Added "${nextDish.name}" from ${nextDish.country} directly to your menu pool list.`, "success");
                }
            }
            
            this.saveState();
            this.renderVisuals();
            this.updateUI();
        }
    }

    renderVisuals() {
        const visualGrid = document.getElementById('floor-visualizer');
        if (!visualGrid) return;
        
        visualGrid.innerHTML = '';
        const totalVisualSlots = this.state.currentFloor * 8;
        
        for (let i = 0; i < totalVisualSlots; i++) {
            const tableSlot = document.createElement('div');
            tableSlot.className = 'table-slot';
            
            const tableIndex = i + 1;
            const isPurchased = tableIndex <= this.state.tablesCount;
            
            if (isPurchased) {
                tableSlot.classList.add('active');
                tableSlot.innerHTML = `
                    <i class="fa-solid fa-utensils table-icon"></i>
                    <span style="font-size:0.65rem;font-weight:700;">Table ${tableIndex}</span>
                    <div class="slot-customers" id="table-customers-${tableIndex}"></div>
                `;
            } else {
                tableSlot.innerHTML = `
                    <i class="fa-solid fa-lock table-icon" style="opacity:0.2;"></i>
                    <span style="font-size:0.65rem;color:var(--text-muted);">Locked ($)</span>
                `;
            }
            visualGrid.appendChild(tableSlot);
        }
        
        for (let s = 0; s < this.state.staffLevel; s++) {
            const staffEmoji = this.staffEmojis[s % this.staffEmojis.length];
            const staffEl = document.createElement('div');
            staffEl.className = 'visual-staff-member';
            staffEl.textContent = staffEmoji;
            staffEl.style.left = `${10 + Math.random() * 80}%`;
            staffEl.style.top = `${20 + Math.random() * 60}%`;
            visualGrid.appendChild(staffEl);
        }
        this.seatRandomCustomers();
    }

    seatRandomCustomers() {
        for (let t = 1; t <= this.state.tablesCount; t++) {
            const tableCustContainer = document.getElementById(`table-customers-${t}`);
            if (!tableCustContainer) continue;
            
            tableCustContainer.innerHTML = '';
            if (Math.random() < 0.7) {
                const dinersCount = Math.floor(Math.random() * 4) + 1;
                for (let c = 0; c < dinersCount; c++) {
                    const cEmoji = this.customerEmojis[Math.floor(Math.random() * this.customerEmojis.length)];
                    const diner = document.createElement('span');
                    diner.className = 'customer-emoji';
                    diner.textContent = cEmoji;
                    tableCustContainer.appendChild(diner);
                }
            }
        }
    }

    renderMenuPanelList() {
        const menuContainer = document.getElementById('tycoon-menu-list');
        if (!menuContainer) return;
        
        menuContainer.innerHTML = '';
        const countries = Object.keys(this.dishDatabase);

        countries.forEach(country => {
            const countryDishes = this.dishDatabase[country];
            const unlockedInCountry = countryDishes.filter(d => this.state.unlockedDishes.includes(d.id));
            
            if (unlockedInCountry.length > 0) {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'menu-country-group';
                groupDiv.style.marginBottom = "10px";
                
                groupDiv.innerHTML = `
                    <h5 style="color:var(--color-indigo); font-size:0.8rem; margin-bottom:4px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:2px;">
                        ${country} (${unlockedInCountry.length}/${countryDishes.length})
                    </h5>
                    <div style="display:flex; flex-wrap:wrap; gap:4px; font-size:0.7rem; color:var(--text-secondary);">
                        ${unlockedInCountry.map(d => `<span class="badge" style="background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px;">🍲 ${d.name}</span>`).join('')}
                    </div>
                `;
                menuContainer.appendChild(groupDiv);
            }
        });
    }

    launchServeQuestion() {
        const pool = this.app.getVocabularyPool();
        if (pool.length === 0) {
            alert("No words available in the vocabulary pool. Please import some or reload defaults first!");
            return;
        }

        const modal = document.getElementById('serving-modal');
        modal.style.display = 'flex';
        document.getElementById('serve-modal-feedback').style.display = 'none';
        document.getElementById('serve-modal-footer').style.display = 'none';
        
        const q = this.app.studyEngine.generateRandomQuestionFromPool();
        this.activeServingQuestion = q;
        
        document.getElementById('serve-modal-word').textContent = q.word.word;
        document.getElementById('serve-modal-prompt').innerHTML = q.prompt;
        document.getElementById('serve-modal-word').style.display = (q.type === 'synonym') ? 'block' : 'none';
        
        const sentenceEl = document.getElementById('serve-modal-sentence');
        if (q.sentence) {
            sentenceEl.innerHTML = q.sentence;
            sentenceEl.style.display = 'block';
        } else {
            sentenceEl.style.display = 'none';
        }
        
        const optionsContainer = document.getElementById('serve-modal-options');
        optionsContainer.innerHTML = '';
        
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn-option';
            btn.textContent = opt;
            btn.onclick = () => this.submitServeAnswer(btn, opt);
            optionsContainer.appendChild(btn);
        });

        document.getElementById('close-serving-modal-btn').onclick = () => {
            modal.style.display = 'none';
        };
    }

    submitServeAnswer(buttonEl, selectedOption) {
        const container = document.getElementById('serve-modal-options');
        container.querySelectorAll('button').forEach(btn => btn.disabled = true);
        
        const correct = selectedOption === this.activeServingQuestion.answer;
        const feedback = document.getElementById('serve-modal-feedback');
        const footer = document.getElementById('serve-modal-footer');
        
        feedback.style.display = 'block';
        footer.style.display = 'flex';
        
        if (correct) {
            buttonEl.classList.add('correct');
            feedback.className = "serving-feedback success";
            
            const bonus = this.getActiveServeBonus();
            this.state.cash += bonus;
            this.saveState();
            this.updateUI();
            
            document.getElementById('serve-modal-feedback-title').innerHTML = `<i class="fa-solid fa-circle-check"></i> Order Served Successfully!`;
            document.getElementById('serve-modal-feedback-text').textContent = `The customer was pleased! You earned a massive cash tip of $${bonus.toFixed(2)}.`;
            this.seatRandomCustomers();
        } else {
            buttonEl.classList.add('incorrect');
            feedback.className = "serving-feedback error";
            
            container.querySelectorAll('button').forEach(btn => {
                if (btn.textContent === this.activeServingQuestion.answer) {
                    btn.classList.add('correct');
                }
            });
            document.getElementById('serve-modal-feedback-title').innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Wrong Dish Served!`;
            document.getElementById('serve-modal-feedback-text').textContent = `Incorrect definition. The customer left without tipping. The correct answer was: "${this.activeServingQuestion.answer}".`;
        }
        
        document.getElementById('serve-modal-continue-btn').onclick = () => {
            document.getElementById('serving-modal').style.display = 'none';
        };
    }

    stop() {
        if (this.tickInterval) clearInterval(this.tickInterval);
    }
}