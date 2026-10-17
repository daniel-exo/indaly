"""Gera guias.json: Gorjetas e preços, Comida e Deuses e símbolos.
Conteúdo público (sem datas nem endereços da viagem); os vínculos com o roteiro são feitos no app,
procurando o texto de "busca" nas atividades e notas do roteiro decifrado."""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from emblemas import E

# ---------------------------------------------------------------- gorjetas e preços
GORJETAS = [
  {"pais": "IN", "nome": "Índia", "moeda": "INR",
   "regras": [
     "Todo produto embalado traz o MRP, o preço máximo impresso. Ninguém pode cobrar mais que isso, nem por água gelada.",
     "Tenha notas de ₹10 a ₹100 à mão: gorjetas e tuk-tuks quase nunca têm troco para ₹500.",
     "Tuk-tuk raramente liga o taxímetro: combine o preço antes de entrar, ou use Uber, Ola ou Rapido.",
     "Em mercados, pechinchar é normal: comece oferecendo perto da metade do primeiro preço e suba com calma.",
   ],
   "gorjetas": [
     {"n": "Restaurante", "v": "5–10% se a conta não tiver “service charge”. Se tiver, é opcional deixar mais ₹50–100."},
     {"n": "Motorista particular (vários dias)", "v": "Cerca de ₹500 por dia, em dinheiro, entregue no fim do último dia."},
     {"n": "Guia", "v": "₹300–500 por meio dia · ₹500–1.000 pelo dia inteiro, além do valor do passeio."},
     {"n": "Carregador de malas", "v": "₹50–100 por mala."},
     {"n": "Camareira", "v": "₹100–200 no último dia (ou ₹50–100 por dia)."},
     {"n": "Tuk-tuk e táxi", "v": "Não se espera gorjeta: arredonde para cima."},
     {"n": "Barqueiro em Varanasi", "v": "₹100–200 se o passeio foi bom."},
     {"n": "Sapatos no templo", "v": "Nos gurdwaras sikhs o guarda-sapatos é voluntário e gratuito. Em templos hindus, ₹10–20."},
   ],
   "precos": [
     {"n": "Chai na rua", "min": 10, "max": 30},
     {"n": "Água mineral 1 L", "min": 20, "max": 20, "obs": "o MRP impresso"},
     {"n": "Samosa (unidade)", "min": 15, "max": 30},
     {"n": "Lassi", "min": 50, "max": 120},
     {"n": "Thali em restaurante simples", "min": 150, "max": 350},
     {"n": "Jantar em restaurante bom", "min": 800, "max": 1800, "obs": "por pessoa"},
     {"n": "Cerveja Kingfisher no bar", "min": 300, "max": 500},
     {"n": "Tuk-tuk curto (2 a 4 km)", "min": 50, "max": 120, "obs": "em Delhi, a tabela oficial é ₹30 até 1,5 km + ₹11/km"},
     {"n": "Uber atravessando Delhi", "min": 250, "max": 600},
     {"n": "Barco particular em Varanasi (1 h)", "min": 400, "max": 1000, "obs": "negocie; no horário do aarti e em festas sobe"},
     {"n": "Taj Mahal (estrangeiro)", "min": 1500, "max": 1500, "obs": "₹1.300 + ₹200 do mausoléu"},
   ]},
  {"pais": "NP", "nome": "Nepal", "moeda": "NPR",
   "regras": [
     "Nos restaurantes para turistas a conta costuma vir com 10% de serviço e mais 13% de imposto (VAT): confira antes de dar gorjeta.",
     "Táxi em Kathmandu não usa taxímetro: combine antes ou use Pathao ou inDrive, que mostram o preço no app.",
     "Cartão às vezes tem taxa de 3 a 4%. Leve rúpias nepalesas em espécie para o dia a dia.",
     "Em Thamel, pechinchar é esperado, sempre com bom humor.",
   ],
   "gorjetas": [
     {"n": "Restaurante", "v": "Se já veio a taxa de serviço, um extra de 5% é gentileza. Sem a taxa, 5–10% ou arredonde."},
     {"n": "Táxi e app", "v": "Arredonde para cima."},
     {"n": "Guia de cidade", "v": "Cerca de NPR 500–1.000 pelo dia (metade em meio dia)."},
     {"n": "Carregador de malas", "v": "Cerca de NPR 100 por mala."},
     {"n": "Camareira", "v": "Cerca de NPR 100 por dia."},
   ],
   "precos": [
     {"n": "Chiya (chá com leite)", "min": 30, "max": 80},
     {"n": "Água mineral 1 L", "min": 30, "max": 60},
     {"n": "Momo (prato com 10)", "min": 150, "max": 350},
     {"n": "Dal bhat (com refil)", "min": 300, "max": 700},
     {"n": "Cerveja grande em Thamel", "min": 500, "max": 800},
     {"n": "Aeroporto → Thamel no Pathao", "min": 300, "max": 500},
     {"n": "Aeroporto → Thamel, táxi pré-pago", "min": 800, "max": 1200},
     {"n": "Thamel → Patan de app", "min": 400, "max": 600},
     {"n": "Pashupatinath (estrangeiro)", "min": 1000, "max": 1500},
     {"n": "Durbar Square de Kathmandu ou de Patan", "min": 1000, "max": 1000, "obs": "cada"},
     {"n": "Boudhanath", "min": 400, "max": 400},
     {"n": "Swayambhunath", "min": 200, "max": 200},
   ]},
  {"pais": "IT", "nome": "Itália", "moeda": "EUR",
   "regras": [
     "O coperto (pão e serviço de mesa) é cobrado por pessoa e vem na conta. Não é gorjeta.",
     "Café em pé no balcão (al banco) custa bem menos do que sentado à mesa.",
     "Em Roma, os nasoni, as fontinhas de rua, dão água potável de graça: leve uma garrafinha.",
     "Táxi só no ponto oficial ou pelo app (itTaxi, FreeNow): carro branco com placa de táxi.",
   ],
   "gorjetas": [
     {"n": "Restaurante", "v": "Não é obrigatória. Arredonde ou deixe €1–2 por pessoa; 5–10% se o serviço foi ótimo."},
     {"n": "Café e bar", "v": "Umas moedinhas no pires, se quiser."},
     {"n": "Táxi", "v": "Arredonde para cima."},
     {"n": "Hotel", "v": "€1–2 por mala ao carregador; camareira é opcional."},
   ],
   "precos": [
     {"n": "Espresso no balcão", "min": 1.2, "max": 1.5},
     {"n": "Cappuccino no balcão", "min": 1.5, "max": 2.2},
     {"n": "Cornetto", "min": 1.2, "max": 2},
     {"n": "Gelato (copinho ou casquinha)", "min": 3, "max": 4.5},
     {"n": "Pizza al taglio (pedaço)", "min": 2.5, "max": 5},
     {"n": "Supplì", "min": 2, "max": 3},
     {"n": "Prato de massa em trattoria", "min": 12, "max": 18},
     {"n": "Coperto", "min": 1.5, "max": 3, "obs": "por pessoa"},
     {"n": "Taça de vinho da casa", "min": 5, "max": 8},
     {"n": "Táxi Fiumicino ↔ centro", "min": 55, "max": 55, "obs": "tarifa fixa por corrida, dentro das muralhas"},
     {"n": "Táxi curto no centro", "min": 10, "max": 15},
   ]},
]

# ---------------------------------------------------------------- comida
# p = picância (0 a 3) · v = vegetariano
COMIDA = {
  "intro": "Pratos típicos que valem procurar em cada parada. Pimenta: 🌶 a 🌶🌶🌶.",
  "pedir": [
    {"pais": "IN", "local": "कम मिर्च, प्लीज़", "lido": "kam mirch, please", "pt": "pouca pimenta, por favor"},
    {"pais": "NP", "local": "पिरो कम", "lido": "piro kam", "pt": "pouca pimenta"},
  ],
  "cuidados": [
    "Água só engarrafada e lacrada, inclusive para escovar os dentes.",
    "Gelo e salada crua só em lugares de confiança; frutas, prefira as que você mesmo descasca.",
    "Comida de rua: escolha barracas cheias, com fritura e fervura na hora.",
    "Pani puri (golgappa) leva água temperada fria: melhor deixar para lugares bem movimentados.",
  ],
  "cidades": [
    {"cidade": "Delhi", "pais": "IN", "texto": "Capital da comida de rua e da cozinha mughlai, com a Velha Delhi como epicentro.", "pratos": [
      {"n": "Chole bhature", "l": "छोले भटूरे", "o": "Grão-de-bico apimentado com um pão frito que estufa como balão. Café da manhã reforçado.", "p": 2, "v": True},
      {"n": "Paratha recheado", "l": "पराठा", "o": "Pão folhado na chapa, recheado de batata, couve-flor ou paneer, com iogurte e picles.", "p": 1, "v": True},
      {"n": "Butter chicken", "l": "बटर चिकन", "o": "Frango tandoori num molho cremoso de tomate e manteiga. Nasceu em Delhi.", "p": 1, "v": False},
      {"n": "Dal makhani", "l": "दाल मखनी", "o": "Lentilha preta cozida por horas com manteiga e creme.", "p": 1, "v": True},
      {"n": "Kebabs mughlai", "l": "कबाब", "o": "Seekh kebab no espeto e kebabs macios de carneiro, típicos da Velha Delhi.", "p": 2, "v": False},
      {"n": "Chaat", "l": "चाट", "o": "Petiscos de rua crocantes com iogurte, chutneys e especiarias: aloo tikki, papdi chaat.", "p": 2, "v": True},
      {"n": "Daulat ki chaat", "l": "दौलत की चाट", "o": "Espuma de leite doce e aerada, com açafrão e pistache. Só existe no inverno.", "p": 0, "v": True},
      {"n": "Jalebi e kulfi", "l": "जलेबी · कुल्फ़ी", "o": "Espirais fritas na calda e o sorvete denso de leite com cardamomo.", "p": 0, "v": True},
    ]},
    {"cidade": "Agra", "pais": "IN", "texto": "Herança mughal e um doce que é símbolo da cidade.", "pratos": [
      {"n": "Petha", "l": "पेठा", "o": "Doce translúcido de abóbora-cinza cristalizada, em dezenas de sabores. É a lembrancinha de Agra.", "p": 0, "v": True},
      {"n": "Bedai com aloo sabzi", "l": "बेड़ई", "o": "Pão frito recheado de lentilha com curry de batata: o café da manhã local.", "p": 2, "v": True},
      {"n": "Biryani e korma", "l": "बिरयानी · क़ोरमा", "o": "Arroz perfumado com carne e o curry suave de castanhas, da cozinha da corte mughal.", "p": 1, "v": False},
    ]},
    {"cidade": "Jaipur", "pais": "IN", "texto": "Cozinha do deserto do Rajastão: ghee, leguminosas e pimenta vermelha.", "pratos": [
      {"n": "Dal baati churma", "l": "दाल बाटी चूरमा", "o": "Bolinhas de trigo assadas e banhadas em ghee, com dal e um farelo doce. O prato do Rajastão.", "p": 1, "v": True},
      {"n": "Laal maas", "l": "लाल मांस", "o": "Carneiro num molho vermelho de pimenta mathania. Bem picante: peça com cuidado.", "p": 3, "v": False},
      {"n": "Gatte ki sabzi", "l": "गट्टे की सब्ज़ी", "o": "Bolinhos de farinha de grão-de-bico num curry de iogurte.", "p": 2, "v": True},
      {"n": "Pyaaz kachori", "l": "प्याज़ कचौरी", "o": "Salgado frito e crocante recheado de cebola temperada.", "p": 2, "v": True},
      {"n": "Mirchi vada", "l": "मिर्ची वड़ा", "o": "Pimentão grande recheado de batata e frito na massa de grão-de-bico.", "p": 2, "v": True},
      {"n": "Ghevar", "l": "घेवर", "o": "Disco doce rendado, frito e embebido em calda, coberto de creme.", "p": 0, "v": True},
      {"n": "Lassi no copo de barro", "l": "लस्सी", "o": "Iogurte batido grosso, servido no kulhad, o copinho de barro.", "p": 0, "v": True},
    ]},
    {"cidade": "Kathmandu", "pais": "NP", "texto": "Cozinha nepalesa e newar, com influência tibetana.", "pratos": [
      {"n": "Momo", "l": "मःम", "o": "Pastéis no vapor (ou fritos) de búfalo, frango ou legumes, com achar de tomate e gergelim.", "p": 2, "v": False},
      {"n": "Dal bhat tarkari", "l": "दाल भात तरकारी", "o": "O prato nacional: arroz, lentilha, curry de legumes e picles, com refil à vontade.", "p": 1, "v": True},
      {"n": "Samay baji", "l": "समय बजी", "o": "Prato ritual newar: arroz batido, carne de búfalo temperada, soja, ovo e gengibre.", "p": 2, "v": False},
      {"n": "Sel roti", "l": "सेल रोटी", "o": "Rosca frita de farinha de arroz, levemente doce. É o lanche do Tihar.", "p": 0, "v": True},
      {"n": "Chatamari", "l": "चटामरी", "o": "A “pizza newar”: crepe fino de arroz com carne moída e ovo por cima.", "p": 1, "v": False},
      {"n": "Thukpa", "l": "थुक्पा", "o": "Sopa tibetana de macarrão com legumes ou carne. Conforto em noite fria.", "p": 1, "v": False},
      {"n": "Yomari", "l": "योमरी", "o": "Bolinho newar de massa de arroz recheado de melaço e gergelim.", "p": 0, "v": True},
      {"n": "Juju dhau", "l": "जुजु धौ", "o": "O “rei dos iogurtes”: coalhada doce e cremosa, servida no pote de barro.", "p": 0, "v": True},
    ]},
    {"cidade": "Varanasi", "pais": "IN", "texto": "Comida de Banaras: café da manhã frito, chaat e doces de leite.", "pratos": [
      {"n": "Kachori sabzi", "l": "कचौड़ी सब्ज़ी", "o": "Kachori frita com curry de batata picante, seguida de jalebi. O café da manhã da cidade.", "p": 2, "v": True},
      {"n": "Tamatar chaat", "l": "टमाटर चाट", "o": "Chaat quente de tomate, batata e especiarias, servido em cumbuca de folha. Só de Banaras.", "p": 2, "v": True},
      {"n": "Malaiyo", "l": "मलइयो", "o": "Espuma de leite com açafrão e pistache feita ao relento da madrugada. Só no inverno.", "p": 0, "v": True},
      {"n": "Baati chokha", "l": "बाटी चोखा", "o": "Bolinhas de trigo assadas com purê de berinjela defumada e batata.", "p": 2, "v": True},
      {"n": "Lassi de Banaras", "l": "लस्सी", "o": "Lassi grosso com uma camada de nata (malai) por cima, no copinho de barro.", "p": 0, "v": True},
      {"n": "Paan banarasi", "l": "बनारसी पान", "o": "Folha de bétel dobrada com recheios doces. Peça o meetha paan, sem tabaco.", "p": 0, "v": True},
    ]},
    {"cidade": "Roma", "pais": "IT", "texto": "As quatro massas romanas, fritura de rua e os pratos da estação.", "pratos": [
      {"n": "Cacio e pepe", "l": "Cacio e pepe", "o": "Massa com pecorino romano e pimenta-do-reino. Simples e perfeita.", "p": 0, "v": True},
      {"n": "Carbonara", "l": "Carbonara", "o": "Guanciale, gema, pecorino e pimenta. Sem creme de leite.", "p": 0, "v": False},
      {"n": "Amatriciana e gricia", "l": "Amatriciana · Gricia", "o": "Guanciale com tomate e pecorino; a gricia é a mesma ideia sem tomate.", "p": 0, "v": False},
      {"n": "Supplì", "l": "Supplì", "o": "Bolinho de arroz ao sugo frito com muçarela derretida no meio.", "p": 0, "v": True},
      {"n": "Pizza al taglio e pizza romana", "l": "Pizza al taglio", "o": "Pedaços vendidos a peso, ou a redonda de massa fina e crocante.", "p": 0, "v": True},
      {"n": "Saltimbocca alla romana", "l": "Saltimbocca", "o": "Escalope de vitela com presunto cru e sálvia, no vinho branco.", "p": 0, "v": False},
      {"n": "Puntarelle", "l": "Puntarelle", "o": "Brotos crocantes de chicória com molho de anchova e alho. Salada de inverno.", "p": 0, "v": False},
      {"n": "Maritozzo con la panna", "l": "Maritozzo", "o": "Brioche recheado de chantilly, para o café da manhã.", "p": 0, "v": True},
      {"n": "Peixes do lago de Bracciano", "l": "Coregone · lattarini", "o": "Coregone grelhado e lattarini, peixinhos fritos, nos restaurantes à beira do lago.", "p": 0, "v": False},
    ]},
  ],
}

# ---------------------------------------------------------------- deuses e símbolos
# busca: textos procurados no roteiro (títulos, lugares e notas) para mostrar "onde vocês vão ver"
DEUSES = [
  {"id": "ganesha", "n": "Ganesha", "l": "गणेश", "cor": "#EE8A24", "papel": "O removedor de obstáculos",
   "reconhecer": ["Cabeça de elefante, com uma presa quebrada", "Barriga grande e um doce (modak) na mão", "O ratinho Mushaka aos pés, sua montaria"],
   "texto": "É invocado antes de qualquer começo: viagem, casamento, loja nova. Por isso está na porta de casas e lojas e no painel de caminhões e tuk-tuks.",
   "ver": [{"busca": "Amber", "o": "o Ganesh Pol, portão pintado com Ganesha"}, {"busca": "Kathmandu Durbar", "o": "o templo de Ashok Binayak, ao lado"}]},
  {"id": "shiva", "n": "Shiva", "l": "शिव", "cor": "#14224F", "papel": "O destruidor e transformador",
   "reconhecer": ["Tridente (trishula) com um tamborzinho (damaru)", "Lua crescente e o rio Ganges no cabelo; serpente no pescoço", "Terceiro olho na testa, corpo coberto de cinzas"],
   "texto": "Parte da trindade com Brahma e Vishnu: destrói para que o mundo se renove. Nos templos costuma aparecer como lingam, uma pedra arredondada. Varanasi é a cidade dele.",
   "ver": [{"busca": "Pashupatinath", "o": "o maior templo de Shiva do Nepal"}, {"busca": "Kashi Vishwanath", "o": "um dos 12 jyotirlingas, os lingams mais sagrados"}, {"busca": "Kathmandu Durbar", "o": "o Kal Bhairav, sua forma feroz"}]},
  {"id": "brahma", "n": "Brahma", "l": "ब्रह्मा", "cor": "#A3560A", "papel": "O criador",
   "reconhecer": ["Quatro cabeças, uma para cada direção, quase sempre com barba", "Nas mãos, os Vedas, um pote de água e um colar de contas", "Sentado num lótus; o cisne (hamsa) é sua montaria"],
   "texto": "Completa a trindade com Vishnu e Shiva: é quem cria o universo, e das suas quatro bocas teriam saído os quatro Vedas. Saraswati é sua esposa. Curiosamente, quase não tem templos próprios; o mais famoso fica em Pushkar, no Rajastão.",
   "ver": []},
  {"id": "vishnu", "n": "Vishnu", "l": "विष्णु", "cor": "#2D4BA0", "papel": "O preservador",
   "reconhecer": ["Pele azul e quatro braços", "Concha (shankha), disco (chakra), maça e lótus nas mãos", "A águia Garuda, sua montaria, muitas vezes ajoelhada na frente do templo"],
   "texto": "Desce à Terra em avatares quando o mundo sai do eixo. Os mais famosos são Rama, herói do Ramayana, e Krishna.",
   "ver": [{"busca": "Patan", "o": "o Garuda ajoelhado diante do templo de Krishna"}]},
  {"id": "krishna", "n": "Krishna", "l": "कृष्ण", "cor": "#0D7A48", "papel": "Avatar de Vishnu, deus do amor",
   "reconhecer": ["Pele azul", "Flauta e uma pena de pavão na coroa", "Muitas vezes com vacas ou com Radha"],
   "texto": "O pastor brincalhão das histórias de infância e o conselheiro da Bhagavad Gita. Um dos deuses mais queridos da Índia.",
   "ver": [{"busca": "Patan", "o": "o Krishna Mandir, templo de pedra do século XVII"}]},
  {"id": "hanuman", "n": "Hanuman", "l": "हनुमान", "cor": "#C3122F", "papel": "O deus-macaco, símbolo de força e devoção",
   "reconhecer": ["Rosto de macaco, rabo comprido", "Maça (gada) no ombro", "Coberto de pasta laranja ou vermelha (sindoor)"],
   "texto": "Fiel escudeiro de Rama no Ramayana, voou até o Sri Lanka para resgatar Sita. Às vezes aparece abrindo o peito, com Rama e Sita no coração.",
   "ver": [{"busca": "Kathmandu Durbar", "o": "a estátua de Hanuman sob um guarda-sol, que dá nome ao palácio Hanuman Dhoka"}]},
  {"id": "lakshmi", "n": "Lakshmi", "l": "लक्ष्मी", "cor": "#A3560A", "papel": "A deusa da prosperidade",
   "reconhecer": ["Sentada ou de pé sobre um lótus rosa", "Moedas de ouro caindo das mãos", "Elefantes jogando água; a coruja é sua montaria"],
   "texto": "Esposa de Vishnu. Na grande noite do Diwali as casas acendem lamparinas e pintam pegadas na entrada para guiá-la para dentro.",
   "ver": [{"busca": "Laxmi", "o": "a noite da Laxmi Puja"}]},
  {"id": "saraswati", "n": "Saraswati", "l": "सरस्वती", "cor": "#8C1D40", "papel": "A deusa do conhecimento e da música",
   "reconhecer": ["Vestida de branco", "Toca a veena, instrumento de cordas", "Livro nas mãos e um cisne ao lado"],
   "texto": "Padroeira de estudantes, artistas e músicos, que levam cadernos e instrumentos para serem abençoados.",
   "ver": [{"busca": "Swayambhunath", "o": "o santuário de Saraswati no alto da colina"}]},
  {"id": "durga", "n": "Durga", "l": "दुर्गा", "cor": "#D6457A", "papel": "A deusa guerreira",
   "reconhecer": ["Muitos braços, cada um com uma arma", "Montada num leão ou num tigre", "Vencendo o demônio-búfalo Mahishasura"],
   "texto": "A força feminina que vence o mal. O Dashain, maior festa do Nepal, é dela e acontece pouco antes do Tihar.",
   "ver": [{"busca": "Kathmandu Durbar", "o": "o templo de Taleju, uma forma de Durga"}]},
  {"id": "kali", "n": "Kali", "l": "काली", "cor": "#14224F", "papel": "A forma mais feroz da Deusa",
   "reconhecer": ["Pele negra ou azul-escura", "Língua vermelha para fora", "Colar de cabeças e uma espada"],
   "texto": "Parece assustadora, mas é protetora: destrói o ego e o mal. Na lenda mais conhecida, a língua de fora é a vergonha de ter pisado em Shiva no meio da fúria.",
   "ver": []},
  {"id": "buda", "n": "Buda", "l": "बुद्ध", "cor": "#EE8A24", "papel": "Siddhartha Gautama, o Desperto",
   "reconhecer": ["Sentado em meditação, com o coque no alto da cabeça", "Orelhas compridas (era um príncipe com brincos pesados)", "A posição das mãos, as mudras, conta a cena"],
   "texto": "Nasceu em Lumbini, no Nepal. Depois de se iluminar, fez o primeiro sermão em Sarnath, bem pertinho de Varanasi.",
   "ver": [{"busca": "Boudhanath", "o": "a maior stupa do Nepal"}, {"busca": "Swayambhunath", "o": "a stupa no alto da colina"}, {"busca": "Mulagandha", "o": "Sarnath, onde ele fez o primeiro sermão"}]},
  {"id": "kumari", "n": "Kumari", "l": "कुमारी", "cor": "#C3122F", "papel": "A deusa viva",
   "reconhecer": ["Uma menina vestida de vermelho", "O “olho de fogo” pintado na testa", "Aparece só às vezes, na janela do palácio"],
   "texto": "Uma menina newar escolhida como encarnação da deusa Taleju, que reina até a adolescência. Fotografá-la é proibido.",
   "ver": [{"busca": "Kathmandu Durbar", "o": "o Kumari Ghar, a casa da Kumari"}]},
  {"id": "nandi", "n": "Nandi", "l": "नन्दी", "cor": "#0D7A48", "papel": "O touro de Shiva",
   "reconhecer": ["Touro deitado, sempre olhando para o santuário de Shiva", "Muitas vezes com guirlandas e marcas de tika"],
   "texto": "É o guardião da porta. Devotos sussurram desejos no ouvido dele para que os leve a Shiva.",
   "ver": [{"busca": "Pashupatinath", "o": "o enorme Nandi dourado, visível do portão"}]},
  {"id": "swaminarayan", "n": "Swaminarayan", "l": "स्वामिनारायण", "cor": "#2D4BA0", "papel": "Mestre e santo do século XIX",
   "reconhecer": ["Estátua dourada, sentado em posição de lótus", "Templos de arenito rosa e mármore esculpido"],
   "texto": "Fundou um movimento hindu do Gujarat cujos seguidores o veneram como manifestação de Deus. O Akshardham é o grande templo deles em Delhi.",
   "ver": [{"busca": "Akshardham", "o": "o templo inteiro é dedicado a ele"}]},
  {"id": "khanda", "n": "Sikhismo", "l": "ੴ", "cor": "#A3560A", "papel": "Uma religião de um só Deus",
   "reconhecer": ["Khanda: espada de dois gumes, um círculo e duas adagas", "Ik Onkar (ੴ): “Deus é um”", "Homens de turbante e os cinco Ks, como o bracelete de aço"],
   "texto": "Fundado por Guru Nanak no Punjab, no século XV. Todo gurdwara tem cozinha comunitária (langar) que serve refeição grátis a qualquer pessoa.",
   "ver": [{"busca": "Bangla Sahib", "o": "cubra a cabeça e tire os sapatos; o lenço é emprestado na entrada"}]},
]

SIMBOLOS = [
  {"id": "om", "n": "Om", "l": "ॐ", "cor": "#8C1D40", "texto": "O som sagrado que contém o universo. Abre e fecha mantras e aparece em portas, pingentes e muros de templo.", "ver": []},
  {"id": "tika", "n": "Tika", "l": "टीका", "cor": "#C3122F", "texto": "A marca na testa, sobre o terceiro olho: bênção recebida no templo ou numa festa. No Bhai Tika as irmãs pintam nos irmãos uma tika de sete cores.", "ver": [{"busca": "Bhai", "o": "o Bhai Dooj, a versão indiana do Bhai Tika"}]},
  {"id": "tripundra", "n": "Tripundra", "l": "त्रिपुण्ड्र", "cor": "#0D7A48", "texto": "Três faixas horizontais de cinza na testa, às vezes com um ponto vermelho: a marca dos devotos de Shiva. Faixas verticais em U indicam devotos de Vishnu.", "ver": [{"busca": "Pashupatinath", "o": "nos sadhus do templo"}]},
  {"id": "olhos", "n": "Olhos de Buda", "l": "बुद्ध आँखा", "cor": "#C3122F", "texto": "Os olhos que tudo veem, pintados nos quatro lados das stupas. O “nariz” em forma de ponto de interrogação é o número 1 em nepalês (१): a unidade de tudo.", "ver": [{"busca": "Boudhanath", "o": ""}, {"busca": "Swayambhunath", "o": ""}]},
  {"id": "bandeiras", "n": "Bandeiras de oração", "l": "लुङ्दार", "cor": "#14224F", "texto": "Sempre na mesma ordem: azul (céu), branco (ar), vermelho (fogo), verde (água) e amarelo (terra). O vento leva as orações impressas nelas. Não pise nas que caírem.", "ver": [{"busca": "Boudhanath", "o": ""}, {"busca": "Swayambhunath", "o": ""}]},
  {"id": "roda", "n": "Rodas de oração", "l": "माने", "cor": "#2D4BA0", "texto": "Cilindros com o mantra Om mani padme hum. Gire com a mão direita, sempre no sentido horário, caminhando em volta da stupa no mesmo sentido.", "ver": [{"busca": "Boudhanath", "o": ""}, {"busca": "Swayambhunath", "o": ""}]},
  {"id": "vajra", "n": "Vajra (dorje)", "l": "वज्र", "cor": "#A3560A", "texto": "O raio-diamante do budismo tibetano: indestrutível como o diamante, poderoso como o raio. Costuma vir acompanhado de um sino.", "ver": [{"busca": "Swayambhunath", "o": "o vajra gigante no topo da escadaria"}]},
  {"id": "lingam", "n": "Lingam", "l": "लिङ्ग", "cor": "#14224F", "texto": "Pedra arredondada sobre uma base, a yoni: Shiva e a energia feminina unidos. Devotos derramam água, leite e flores sobre ele.", "ver": [{"busca": "Pashupatinath", "o": ""}, {"busca": "Kashi Vishwanath", "o": ""}]},
  {"id": "aarti", "n": "Aarti", "l": "आरती", "cor": "#C3122F", "texto": "Ritual de luz: lamparinas de muitos pavios giradas diante da divindade, com sinos, conchas e cânticos. No fim, passe as mãos sobre a chama e leve-as aos olhos.", "ver": [{"busca": "Aarti", "o": "o Ganga Aarti à beira do rio"}, {"busca": "Pashupatinath", "o": "o aarti do fim de tarde"}]},
  {"id": "ganga", "n": "Mãe Ganga", "l": "गंगा", "cor": "#2D4BA0", "texto": "O rio é uma deusa. Banhar-se nele purifica, e morrer ou ser cremado em Varanasi liberta do ciclo de renascimentos. Por isso os ghats de cremação nunca apagam o fogo.", "ver": [{"busca": "Cremaç", "o": "os ghats de cremação: nada de fotos"}]},
  {"id": "diya", "n": "Diya", "l": "दीया", "cor": "#8C1D40", "texto": "A lamparina de barro com óleo e pavio de algodão. No Diwali e no Tihar elas cobrem parapeitos, janelas e templos: a luz que vence a escuridão.", "ver": [{"busca": "Laxmi", "o": "a noite principal do Diwali e do Tihar"}]},
  {"id": "rangoli", "n": "Rangoli", "l": "रंगोली", "cor": "#D6457A", "texto": "Desenhos de pó colorido, arroz ou pétalas no chão da entrada, feitos para dar boas-vindas aos deuses e às visitas. Cuidado para não pisar.", "ver": [{"busca": "Diwali", "o": "nas portas durante o Diwali"}]},
  {"id": "guirlanda", "n": "Guirlanda de cravo-de-defunto", "l": "सयपत्री", "cor": "#14224F", "texto": "O cravo-de-defunto laranja (sayapatri no Nepal) é a flor das oferendas. No Tihar enfeita portas, vacas, cachorros e irmãos.", "ver": [{"busca": "Kukur", "o": "no dia dos cachorros"}]},
  {"id": "vaca", "n": "Vaca sagrada", "l": "गाई", "cor": "#A3560A", "texto": "A vaca é a mãe que alimenta e não se mata nem se come na tradição hindu. Por isso andam soltas pelas ruas. No Gai Tihar ganham guirlandas e tika.", "ver": [{"busca": "Gai Tihar", "o": "o dia das vacas"}]},
  {"id": "suastica", "n": "Suástica hindu", "l": "स्वस्तिक", "cor": "#EE8A24", "texto": "Sinal milenar de boa sorte e bem-estar (svasti), muito anterior ao nazismo e sem relação com ele. Aparece em portas, cadernos de contas e oferendas.", "ver": []},
  {"id": "lotus", "n": "Lótus", "l": "कमल", "cor": "#14224F", "texto": "Nasce na lama e floresce limpo: pureza e despertar. Trono de deuses e de Buda, e flor nacional da Índia.", "ver": [{"busca": "Lotus", "o": "o Templo de Lótus, casa de oração bahá'í aberta a todas as religiões"}]},
  {"id": "mudra", "n": "Mudras", "l": "मुद्रा", "cor": "#0D7A48", "texto": "Gestos das mãos nas estátuas. Mão erguida com a palma para fora: “não tema”. Dedos tocando a terra: a iluminação. Mãos formando rodas: o primeiro sermão, a mudra de Sarnath.", "ver": [{"busca": "Mulagandha", "o": ""}]},
  {"id": "namaste", "n": "Namaste", "l": "नमस्ते", "cor": "#2D4BA0", "texto": "Palmas juntas na altura do peito e uma leve inclinação: “o divino em mim saúda o divino em você”. Serve para olá, obrigado e tchau.", "ver": []},
]


ICONES = os.path.join(os.path.dirname(__file__), "..", "icons", "guia")


def com_svg(lista):
    """Ilustração própria em SVG; quando há ícone baixado (icons/guia/<id>.png e <id>-cor.webp), usa ele."""
    saida = []
    for x in lista:
        y = {**x, "svg": E[x["id"]]}
        if os.path.exists(os.path.join(ICONES, x["id"] + ".png")):
            y["img"] = f"icons/guia/{x['id']}.png"
        if os.path.exists(os.path.join(ICONES, x["id"] + "-cor.webp")):
            y["imgCor"] = f"icons/guia/{x['id']}-cor.webp"
        saida.append(y)
    return saida


QUIZ_PISTAS = {  # pistas curtas para o jogo "Quem é?"
  "ganesha": "Cabeça de elefante e um ratinho como montaria",
  "shiva": "Tridente, lua no cabelo e serpente no pescoço",
  "brahma": "Quatro cabeças e os Vedas nas mãos",
  "vishnu": "Pele azul, concha e disco nas mãos",
  "krishna": "Flauta e pena de pavão",
  "hanuman": "Macaco com uma maça, coberto de laranja",
  "lakshmi": "Sobre um lótus, com moedas de ouro caindo",
  "saraswati": "De branco, tocando a veena, com um cisne",
  "durga": "Muitos braços armados, montada num leão",
  "kali": "Pele escura e a língua vermelha para fora",
  "buda": "Sentado em meditação, olhos semicerrados",
  "kumari": "Uma menina com o olho de fogo na testa",
  "nandi": "Touro deitado olhando para o santuário",
}

guias = {
  "versao": 1,
  "gorjetas": GORJETAS,
  "comida": COMIDA,
  "deuses": com_svg(DEUSES),
  "simbolos": com_svg(SIMBOLOS),
  "quiz": QUIZ_PISTAS,
}

if __name__ == "__main__":
    destino = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "..", "guias.json")
    with open(destino, "w") as f:
        json.dump(guias, f, ensure_ascii=False, separators=(",", ":"))
    print(destino, os.path.getsize(destino), "bytes")
