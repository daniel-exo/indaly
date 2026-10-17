"""Emblemas (ilustrações) do guia de deuses e símbolos. viewBox 0 0 64 64, traço em currentColor (branco no app)."""

S = 'fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"'
F = 'fill="currentColor"'
LARANJA, AZUL, VERMELHO, VERDE, AMARELO, BRANCO = "#EE8A24", "#14224F", "#E0283E", "#2E9E5B", "#F5C431", "#FFFFFF"


def g(*partes):
    return "".join(partes)


E = {}

# Ganesha: cabeça de elefante de frente, orelhas grandes, tromba curvada, uma presa, coroa
E["ganesha"] = g(
    f'<path d="M24 14 L28 8 L32 12 L36 8 L40 14 Z" {F}/>',
    f'<path d="M22 18 C22 15 26 14 32 14 C38 14 42 15 42 18 L42 30 C42 34 39 37 36 38 L36 46 C36 50 39 53 43 52 C45 51.5 46 50 45.5 48" {S}/>',
    f'<path d="M22 18 L22 30 C22 34 25 37 28 38 L28 44" {S}/>',
    f'<path d="M22 20 C14 16 7 20 8 29 C9 36 15 39 22 34" {S}/>',
    f'<path d="M42 20 C50 16 57 20 56 29 C55 36 49 39 42 34" {S}/>',
    f'<circle cx="27.5" cy="25" r="1.8" {F}/><circle cx="36.5" cy="25" r="1.8" {F}/>',
    f'<path d="M28.5 38.5 L25 43" {S}/>',
    f'<path d="M32 18 L32 21" stroke="{VERMELHO}" stroke-width="2.6" stroke-linecap="round"/>',
)

# Brahma: três das quatro cabeças à vista, sobre um lótus
E["brahma"] = g(
    f'<circle cx="32" cy="22" r="8" {F}/>', f'<circle cx="19" cy="26" r="6.5" {S}/>', f'<circle cx="45" cy="26" r="6.5" {S}/>',
    f'<path d="M26 14 L29 8 L32 12 L35 8 L38 14 Z" {F}/>',
    f'<path d="M18 40 C22 34 42 34 46 40 L44 46 L20 46 Z" {F}/>',
    f'<path d="M32 58 C26 54 26 48 32 46 C38 48 38 54 32 58 Z M32 58 C22 58 14 54 12 48 C20 47 26 50 32 58 Z M32 58 C42 58 50 54 52 48 C44 47 38 50 32 58 Z" {S}/>',
)

# Shiva: tridente com tamborzinho (damaru) e a lua crescente
E["shiva"] = g(
    f'<path d="M32 10 L32 56" {S}/>',
    f'<path d="M22 14 C22 22 26 26 32 26 C38 26 42 22 42 14" {S}/>',
    f'<path d="M32 10 L29.5 15 M32 10 L34.5 15" {S}/>',
    f'<path d="M26 32 L38 40 L38 32 L26 40 Z" {S}/>',
    f'<path d="M50 9 A7 7 0 1 0 55 19 A5.5 5.5 0 1 1 50 9 Z" {F}/>',
)

# Vishnu: concha (shankha) e disco (chakra)
E["vishnu"] = g(
    f'<circle cx="21" cy="24" r="10" {S}/><circle cx="21" cy="24" r="3" {F}/>',
    *[f'<path d="M{21 + 10 * c:.1f} {24 + 10 * s:.1f} L{21 + 13.5 * c:.1f} {24 + 13.5 * s:.1f}" {S}/>'
      for c, s in [(1, 0), (0.707, 0.707), (0, 1), (-0.707, 0.707), (-1, 0), (-0.707, -0.707), (0, -1), (0.707, -0.707)]],
    f'<path d="M44 30 C52 30 56 37 54 45 C52 52 45 55 39 52 C35 50 34 45 37 42 C40 39 44 41 43 44" {S}/>',
    f'<path d="M44 30 C41 33 38 35 34 35" {S}/>',
    f'<path d="M50 52 L53 57 M45 54 L46 58" {S}/>',
)

# Krishna: flauta (bansuri) com pena de pavão
E["krishna"] = g(
    f'<path d="M10 50 L46 18" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
    *[f'<circle cx="{18 + 6 * k:.1f}" cy="{43 - 5.33 * k:.1f}" r="1.1" fill="{AZUL}"/>' for k in range(4)],
    f'<path d="M44 20 C40 10 44 4 50 4 C58 4 60 14 54 22 C51 26 47 25 44 20 Z" {S}/>',
    f'<ellipse cx="51" cy="13" rx="4.2" ry="5.2" fill="{VERDE}"/>',
    f'<ellipse cx="51" cy="13.5" rx="2.3" ry="3" fill="{AZUL}"/>',
    f'<circle cx="51" cy="14" r="1.1" fill="{AMARELO}"/>',
)

# Hanuman: maça (gada) e o rabo enrolado
E["hanuman"] = g(
    f'<path d="M20 56 L36 26" {S}/>',
    f'<circle cx="40" cy="18" r="10" {S}/>',
    f'<path d="M31 18 L49 18 M40 9 L40 27" stroke="currentColor" stroke-width="1.6"/>',
    f'<path d="M40 6 L40 3" {S}/>',
    f'<path d="M17 54 C8 50 6 40 12 34 C17 29 24 32 22 38 C21 41 17 41 17 38" {S}/>',
)

# Lakshmi: lótus com moedas de ouro caindo
E["lakshmi"] = g(
    f'<path d="M32 48 C24 40 24 28 32 20 C40 28 40 40 32 48 Z" {S}/>',
    f'<path d="M32 48 C22 46 15 38 14 28 C22 30 28 36 32 48 Z" {S}/>',
    f'<path d="M32 48 C42 46 49 38 50 28 C42 30 36 36 32 48 Z" {S}/>',
    f'<path d="M14 52 C24 49 40 49 50 52" {S}/>',
    f'<circle cx="16" cy="12" r="3.6" fill="{AMARELO}"/><circle cx="48" cy="9" r="3.6" fill="{AMARELO}"/><circle cx="54" cy="19" r="3" fill="{AMARELO}"/><circle cx="10" cy="21" r="3" fill="{AMARELO}"/>',
)

# Saraswati: veena (instrumento de cordas com duas cabaças)
E["saraswati"] = g(
    f'<circle cx="16" cy="46" r="9" {S}/>',
    f'<circle cx="49" cy="17" r="6" {S}/>',
    f'<path d="M22 40 L44 21" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>',
    f'<path d="M12 47 L52 13" stroke="{AZUL}" stroke-width="0.9"/>',
    f'<path d="M23 38 L19 34 M29 33 L25 29 M35 28 L31 24" {S}/>',
    f'<path d="M51 12 L56 7" {S}/>',
)

# Durga: muitos braços em leque e o tridente
E["durga"] = g(
    *[f'<path d="M32 36 L{32 + 22 * c:.1f} {36 - 22 * s:.1f}" {S}/>'
      for c, s in [(-0.97, 0.26), (-0.82, 0.57), (-0.57, 0.82), (-0.26, 0.97), (0.26, 0.97), (0.57, 0.82), (0.82, 0.57), (0.97, 0.26)]],
    *[f'<circle cx="{32 + 23.5 * c:.1f}" cy="{36 - 23.5 * s:.1f}" r="2.4" {F}/>'
      for c, s in [(-0.97, 0.26), (-0.82, 0.57), (-0.57, 0.82), (0.57, 0.82), (0.82, 0.57), (0.97, 0.26)]],
    f'<path d="M26 12 C26 16 28 18 32 18 C36 18 38 16 38 12 M32 6 L32 32" {S}/>',
    f'<circle cx="32" cy="40" r="8" fill="currentColor"/>',
    f'<path d="M24 48 L22 58 M40 48 L42 58 M24 48 L40 48" {S}/>',
)

# Kali: rosto com terceiro olho e a língua vermelha para fora
E["kali"] = g(
    f'<path d="M14 26 C14 14 22 8 32 8 C42 8 50 14 50 26 C50 38 42 46 32 46 C22 46 14 38 14 26 Z" fill="#070B1C" stroke="currentColor" stroke-width="2.6"/>',
    f'<path d="M12 22 C6 34 8 48 16 56 M52 22 C58 34 56 48 48 56" {S}/>',
    f'<ellipse cx="25" cy="25" rx="3.2" ry="2.4" fill="{BRANCO}"/><ellipse cx="39" cy="25" rx="3.2" ry="2.4" fill="{BRANCO}"/>',
    f'<circle cx="25" cy="25" r="1.2" fill="{AZUL}"/><circle cx="39" cy="25" r="1.2" fill="{AZUL}"/>',
    f'<ellipse cx="32" cy="17" rx="1.6" ry="2.8" fill="{VERMELHO}"/>',
    f'<path d="M27 35 L37 35 L35.5 47 C35 51 29 51 28.5 47 Z" fill="{VERMELHO}"/>',
    f'<path d="M26 35 L38 35" stroke="{BRANCO}" stroke-width="2" stroke-linecap="round"/>',
)

# Buda: sentado em meditação, com auréola
E["buda"] = g(
    f'<circle cx="32" cy="16" r="12" {S} stroke-dasharray="2 4"/>',
    f'<circle cx="32" cy="17" r="6.5" {F}/>',
    f'<circle cx="32" cy="9.5" r="2.6" {F}/>',
    f'<path d="M24 28 C26 25 38 25 40 28 L43 42 L21 42 Z" {F}/>',
    f'<path d="M12 50 C12 43 20 40 32 40 C44 40 52 43 52 50 C52 53 44 55 32 55 C20 55 12 53 12 50 Z" {F}/>',
    f'<ellipse cx="32" cy="45" rx="5" ry="2.2" fill="{AZUL}" opacity="0.35"/>',
)

# Kumari: rosto de menina com o olho de fogo pintado na testa e coroa
E["kumari"] = g(
    f'<path d="M20 16 L24 8 L28 13 L32 6 L36 13 L40 8 L44 16 Z" {F}/>',
    f'<path d="M18 30 C18 21 24 16 32 16 C40 16 46 21 46 30 C46 41 40 48 32 48 C24 48 18 41 18 30 Z" {S}/>',
    f'<path d="M24 32 C26 30 28 30 29.5 32 M34.5 32 C36 30 38 30 40 32" {S}/>',
    f'<path d="M26.5 32 C24 31 22 30 20.5 28 M37.5 32 C40 31 42 30 43.5 28" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" fill="none"/>',
    f'<path d="M27 22.5 C29 19.5 35 19.5 37 22.5 C35 25.5 29 25.5 27 22.5 Z" fill="{VERMELHO}"/>',
    f'<circle cx="32" cy="22.5" r="1.5" fill="{AMARELO}"/>',
    f'<path d="M29 40 C31 41.5 33 41.5 35 40" {S}/>',
    f'<path d="M18 50 C22 54 42 54 46 50" {S}/>',
)

# Nandi: o touro de Shiva, deitado e de perfil
E["nandi"] = g(
    f'<path d="M6 52 C6 44 12 38 22 37 C25 30 32 27 37 30 C40 32 43 32 45 29 L46 23 C46 19 49 17 52 18 L57 21 C59 23 58.5 26 55.5 27 L52.5 28 C51.5 33 49 37 45.5 40 C49 43 51 47 51 52 Z" {F}/>',
    f'<path d="M47.5 20 C45 15 46 11.5 49.5 10.5 M53 18.5 C54 14 57 12.5 59.5 14.5" {S}/>',
    f'<circle cx="51.5" cy="22.5" r="1.3" fill="{AZUL}"/>',
    f'<path d="M45 30 C46 33 48 35 50 35" stroke="{LARANJA}" stroke-width="2.4" stroke-linecap="round" fill="none"/>',
    f'<path d="M4 55 L60 55" {S}/>',
)

# Swaminarayan (Akshardham): cúpulas do templo
E["swaminarayan"] = g(
    f'<path d="M10 54 L54 54 M14 54 L14 36 M50 54 L50 36 M14 36 L50 36" {S}/>',
    f'<path d="M22 36 C22 26 26 20 32 16 C38 20 42 26 42 36" {S}/>',
    f'<path d="M32 16 L32 9 M30 11 L34 11" {S}/>',
    f'<path d="M11 36 C11 31 13 28 16 26 C19 28 21 31 21 36 M43 36 C43 31 45 28 48 26 C51 28 53 31 53 36" {S}/>',
    f'<path d="M24 54 L24 44 M32 54 L32 44 M40 54 L40 44" {S}/>',
)

# Khanda (sikh): espada de dois gumes, o círculo e as duas adagas
E["khanda"] = g(
    f'<path d="M32 6 L35 14 L35 40 L32 44 L29 40 L29 14 Z" {F}/>',
    f'<circle cx="32" cy="30" r="12" {S}/>',
    f'<path d="M14 18 C8 30 12 44 26 50 M50 18 C56 30 52 44 38 50" {S}/>',
    f'<path d="M24 46 L20 54 M40 46 L44 54" {S}/>',
    f'<path d="M28 48 L36 48" {S}/>',
)

# ---- símbolos ----
E["om"] = (f'<text x="32" y="47" text-anchor="middle" font-size="44" font-weight="700" fill="currentColor" '
           f'font-family="Noto Sans Devanagari, Kohinoor Devanagari, Mangal, sans-serif">ॐ</text>')

E["tika"] = g(
    f'<path d="M14 40 C14 22 22 12 32 12 C42 12 50 22 50 40" {S}/>',
    f'<path d="M24 38 C26 36 28 36 30 38 M34 38 C36 36 38 36 40 38" {S}/>',
    f'<ellipse cx="32" cy="27" rx="3" ry="5" fill="{VERMELHO}"/>',
    f'<circle cx="32" cy="24.5" r="1.6" fill="{AMARELO}"/>',
    *[f'<circle cx="{32 + 2.4 * k}" cy="31" r="0.9" fill="{AMARELO}"/>' for k in (-1, 1)],
    f'<path d="M14 40 C14 50 22 56 32 56 C42 56 50 50 50 40" {S}/>',
)

E["suastica"] = g(
    f'<path d="M32 14 L32 50 M14 32 L50 32 M32 14 L44 14 M50 32 L50 44 M32 50 L20 50 M14 32 L14 20" {S} stroke-width="3.4"/>',
    *[f'<circle cx="{x}" cy="{y}" r="2.6" fill="{VERMELHO}"/>' for x, y in ((23, 23), (41, 23), (23, 41), (41, 41))],
)

E["lotus"] = g(
    f'<path d="M32 48 C24 40 24 26 32 16 C40 26 40 40 32 48 Z" {S}/>',
    f'<path d="M32 48 C21 46 13 37 12 25 C21 27 28 34 32 48 Z" {S}/>',
    f'<path d="M32 48 C43 46 51 37 52 25 C43 27 36 34 32 48 Z" {S}/>',
    f'<path d="M32 48 C22 50 12 46 6 38 M32 48 C42 50 52 46 58 38" {S}/>',
    f'<path d="M10 54 C20 51 44 51 54 54" {S}/>',
)

E["olhos"] = g(
    f'<path d="M6 26 C12 18 22 18 28 26 C22 32 12 32 6 26 Z" {S}/>',
    f'<path d="M36 26 C42 18 52 18 58 26 C52 32 42 32 36 26 Z" {S}/>',
    f'<circle cx="17" cy="25.5" r="3.4" {F}/><circle cx="47" cy="25.5" r="3.4" {F}/>',
    f'<path d="M6 14 C12 10 22 10 28 14 M36 14 C42 10 52 10 58 14" {S}/>',
    f'<path d="M26 36 C26 33 29 31 32 31 C35 31 38 33 37 36 C36 39 31 40 31 44 L31 50" {S}/>',
    f'<circle cx="31" cy="55" r="1.6" {F}/>',
    f'<circle cx="32" cy="10" r="2.2" fill="{VERMELHO}"/>',
)

E["bandeiras"] = g(
    f'<path d="M4 14 C20 22 44 22 60 14" stroke="currentColor" stroke-width="1.6" fill="none"/>',
    *[f'<path d="M{x0} {y0} L{x0 + 9} {y0 + 0.6} L{x0 + 8.4} {y0 + 13} L{x0 - 0.6} {y0 + 12.4} Z" fill="{cor}"/>'
      for (x0, y0), cor in zip(((6, 16.5), (17.5, 19.5), (29, 20.3), (40.5, 19.5), (52, 16.5)), ("#2D6FD6", BRANCO, VERMELHO, VERDE, AMARELO))],
    f'<path d="M4 38 C20 46 44 46 60 38" stroke="currentColor" stroke-width="1.6" fill="none"/>',
    *[f'<path d="M{x0} {y0} L{x0 + 9} {y0 + 0.6} L{x0 + 8.4} {y0 + 13} L{x0 - 0.6} {y0 + 12.4} Z" fill="{cor}"/>'
      for (x0, y0), cor in zip(((6, 40.5), (17.5, 43.5), (29, 44.3), (40.5, 43.5), (52, 40.5)), ("#2D6FD6", BRANCO, VERMELHO, VERDE, AMARELO))],
)

E["roda"] = g(
    f'<rect x="20" y="14" width="24" height="32" rx="4" {S}/>',
    f'<path d="M20 22 L44 22 M20 38 L44 38" {S}/>',
    f'<path d="M26 28 L26 32 M32 27 L32 33 M38 28 L38 32" {S}/>',
    f'<path d="M32 14 L32 8 M32 46 L32 58" {S}/>',
    f'<path d="M48 22 C54 26 54 34 48 38" {S}/><path d="M48 38 L45 37 M48 38 L49 35" {S}/>',
)

E["vajra"] = g(
    f'<circle cx="32" cy="32" r="4" {F}/>',
    f'<path d="M32 28 C24 24 22 16 32 6 C42 16 40 24 32 28 Z" {S}/>',
    f'<path d="M32 36 C24 40 22 48 32 58 C42 48 40 40 32 36 Z" {S}/>',
    f'<path d="M32 28 L32 6 M32 36 L32 58" {S}/>',
    f'<path d="M24 30 L40 30 M24 34 L40 34" {S}/>',
)

E["diya"] = g(
    f'<path d="M10 38 C10 48 20 54 32 54 C44 54 54 48 54 38 Z" {F}/>',
    f'<path d="M54 38 L60 34" {S}/>',
    f'<path d="M32 36 C26 30 27 22 32 12 C37 22 38 30 32 36 Z" fill="{AMARELO}"/>',
    f'<path d="M32 33 C29.5 30 30 25 32 21 C34 25 34.5 30 32 33 Z" fill="{LARANJA}"/>',
    *[f'<circle cx="{x}" cy="46" r="1.6" fill="{AZUL}" opacity="0.4"/>' for x in (22, 32, 42)],
)

E["rangoli"] = g(
    *[f'<ellipse cx="32" cy="18" rx="5" ry="10" transform="rotate({a} 32 32)" fill="{cor}"/>'
      for a, cor in zip(range(0, 360, 45), (VERMELHO, AMARELO, VERDE, "#2D6FD6") * 2)],
    f'<circle cx="32" cy="32" r="7" fill="{BRANCO}"/>',
    f'<circle cx="32" cy="32" r="3.2" fill="{LARANJA}"/>',
    *[f'<circle cx="{32 + 27 * c:.1f}" cy="{32 + 27 * s:.1f}" r="2" {F}/>'
      for c, s in [(1, 0), (0.707, 0.707), (0, 1), (-0.707, 0.707), (-1, 0), (-0.707, -0.707), (0, -1), (0.707, -0.707)]],
)

E["guirlanda"] = g(
    f'<path d="M8 12 C14 40 50 40 56 12" stroke="currentColor" stroke-width="1.4" fill="none"/>',
    *[f'<circle cx="{x:.1f}" cy="{y:.1f}" r="5.2" fill="{cor}"/><circle cx="{x:.1f}" cy="{y:.1f}" r="2" fill="#C2410C" opacity="0.55"/>'
      for (x, y), cor in zip(((9, 15), (12.5, 24), (18, 30.5), (25, 34.5), (32, 35.5), (39, 34.5), (46, 30.5), (51.5, 24), (55, 15)),
                             (LARANJA, AMARELO) * 5)],
    f'<path d="M32 41 L32 48" stroke="currentColor" stroke-width="1.4"/>',
    f'<circle cx="32" cy="52" r="4.6" fill="{LARANJA}"/>',
)

E["lingam"] = g(
    f'<path d="M8 44 C8 38 18 36 32 36 C46 36 56 38 56 44 C56 48 46 50 32 50 C18 50 8 48 8 44 Z" {S}/>',
    f'<path d="M56 44 L62 46" {S}/>',
    f'<path d="M24 40 L24 22 C24 14 28 10 32 10 C36 10 40 14 40 22 L40 40" {F}/>',
    f'<path d="M26 22 L38 22 M26 26 L38 26 M26 30 L38 30" stroke="{AZUL}" stroke-width="1.6" opacity="0.5"/>',
    f'<circle cx="32" cy="26" r="2" fill="{VERMELHO}"/>',
    f'<circle cx="18" cy="54" r="2.4" fill="{LARANJA}"/><circle cx="46" cy="54" r="2.4" fill="{LARANJA}"/>',
)

E["aarti"] = g(
    f'<path d="M32 58 L32 40 M24 58 L40 58" {S}/>',
    f'<path d="M14 38 C14 32 50 32 50 38 C50 42 14 42 14 38 Z" {F}/>',
    f'<path d="M20 30 L44 30" {S}/>',
    f'<path d="M24 22 L40 22" {S}/>',
    *[f'<path d="M{x} {y} C{x - 3} {y - 3} {x - 2.5} {y - 7} {x} {y - 11} C{x + 2.5} {y - 7} {x + 3} {y - 3} {x} {y} Z" fill="{AMARELO}"/>'
      for x, y in ((18, 33), (25, 33), (32, 33), (39, 33), (46, 33), (21, 26), (28, 26), (36, 26), (43, 26), (28, 18), (36, 18), (32, 12))],
)

E["tripundra"] = g(
    f'<path d="M14 40 C14 22 22 12 32 12 C42 12 50 22 50 40" {S}/>',
    f'<path d="M20 22 L44 22 M19 26.5 L45 26.5 M20 31 L44 31" stroke="{BRANCO}" stroke-width="2.6" stroke-linecap="round"/>',
    f'<circle cx="32" cy="26.5" r="2.4" fill="{VERMELHO}"/>',
    f'<path d="M24 40 C26 38 28 38 30 40 M34 40 C36 38 38 38 40 40" {S}/>',
    f'<path d="M14 40 C14 50 22 56 32 56 C42 56 50 50 50 40" {S}/>',
)

E["namaste"] = g(
    f'<path d="M30 54 L30 30 C30 22 28 14 25 10 C23 8 21 9 21 12 L22 26 L16 34 C14 38 14 42 16 46 L22 54" {S}/>',
    f'<path d="M34 54 L34 30 C34 22 36 14 39 10 C41 8 43 9 43 12 L42 26 L48 34 C50 38 50 42 48 46 L42 54" {S}/>',
    f'<path d="M12 58 L52 58" {S}/>',
)

E["vaca"] = g(
    f'<path d="M14 26 C10 22 6 20 4 22 M50 26 C54 22 58 20 60 22" {S}/>',
    f'<path d="M20 22 C18 16 20 10 24 8 M44 22 C46 16 44 10 40 8" {S}/>',
    f'<path d="M18 24 C18 20 24 18 32 18 C40 18 46 20 46 24 L44 40 C43 48 40 54 32 54 C24 54 21 48 20 40 Z" {S}/>',
    f'<circle cx="26" cy="30" r="1.8" {F}/><circle cx="38" cy="30" r="1.8" {F}/>',
    f'<ellipse cx="32" cy="46" rx="7" ry="5" {S}/>',
    f'<circle cx="29" cy="46" r="1" {F}/><circle cx="35" cy="46" r="1" {F}/>',
    f'<ellipse cx="32" cy="23" rx="1.6" ry="2.6" fill="{VERMELHO}"/>',
    *[f'<circle cx="{x}" cy="{y}" r="2.6" fill="{LARANJA}"/>' for x, y in ((20, 55), (26, 58), (32, 59), (38, 58), (44, 55))],
)

E["ganga"] = (
    '<g transform="translate(32 33) scale(1.18) translate(-32 -34)">'
    f'<path d="M4 44 C12 40 20 48 28 44 C36 40 44 48 52 44 C56 42 58 42 60 43" {S}/>'
    f'<path d="M4 54 C12 50 20 58 28 54 C36 50 44 58 52 54 C56 52 58 52 60 53" {S}/>'
    f'<path d="M20 38 C20 32 26 30 32 30 C38 30 44 32 44 38 Z" {F}/>'
    f'<path d="M32 30 C29 26 29.5 21 32 16 C34.5 21 35 26 32 30 Z" {F}/>'
    f'<circle cx="14" cy="16" r="2.2" {F}/><circle cx="50" cy="12" r="2.2" {F}/><circle cx="48" cy="24" r="1.8" {F}/>'
    '</g>'
)

E["mudra"] = g(
    f'<path d="M24 58 L24 34 C24 30 22 26 20 22 C19 20 20 18 22 18 C24 18 26 21 28 26" {S}/>',
    f'<path d="M28 34 L28 12 C28 9 32 9 32 12 L32 30" {S}/>',
    f'<path d="M32 30 L32 9 C32 6 36 6 36 9 L36 30" {S}/>',
    f'<path d="M36 30 L36 12 C36 9 40 9 40 12 L40 31" {S}/>',
    f'<path d="M40 31 L40 18 C40 15 44 15 44 18 L44 40 C44 50 40 54 34 58" {S}/>',
    f'<circle cx="34" cy="42" r="4" {S}/>',
)
