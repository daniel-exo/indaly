"""O cachorro do Indaly (logo F1: rosto C2 com orelhas caídas). Gera o SVG usado no app e os ícones PNG."""
import math
LARANJA, AZUL, BRANCO = "#EE8A24", "#14224F", "#FFFFFF"

ORELHA = ("M62 23 C63.5 21 67 20.5 70.5 21 C76 21.8 81.5 25 84.5 28.5 C86.5 31 86.4 35 85 38 "
          "C83.5 41 81.8 43 81.6 46 C81.5 48 80.8 49.6 79.6 49.6 C78.6 49.6 77.4 48.5 76.6 46.5 "
          "C74.6 43 72.2 39.5 71.4 35.5 C70.8 32.5 70.2 29.6 68.6 27.8 C66.8 25.6 64.2 24.2 62 23 Z")

def _espelha(d):
    import re
    out, n = [], 0
    for t in re.findall(r"[A-Za-z]|-?\d*\.?\d+", d):
        if t.isalpha():
            out.append(t); n = 0
        else:
            v = float(t); out.append(f"{(100 - v) if n % 2 == 0 else v:g}"); n += 1
    return " ".join(out)

ORELHA_ESQ = _espelha(ORELHA)

# focinho com a língua para fora (desenho de referência do Daniel, vetorizado); usado no ícone da Comida
FOCINHO_LINGUA_CONTORNO = "M255.9 509.5C255.6 509.3 251.8 508.6 247.4 508.0C243.1 507.4 237.9 506.3 236.0 505.6C234.1 504.8 230.0 503.5 227.0 502.5C216.4 499.0 201.1 489.6 191.4 480.4C182.8 472.3 168.0 448.4 168.0 442.6C168.0 441.4 167.5 439.9 166.8 439.2C163.9 436.3 161.4 405.1 162.9 390.4C164.6 373.7 165.1 370.7 166.6 368.5C167.4 367.4 168.0 365.9 168.0 365.0C168.0 361.4 177.8 345.4 184.4 338.1C191.5 330.3 207.5 320.2 216.7 317.8C229.1 314.5 248.9 314.9 260.0 318.7C273.7 323.5 290.2 336.5 296.3 347.4C301.4 356.4 303.9 361.6 303.9 363.1C304.0 364.0 304.9 366.7 306.0 369.1C307.5 372.5 308.0 375.8 308.0 383.0C308.1 396.5 309.7 418.1 310.8 421.0C312.4 425.0 318.4 427.7 322.3 426.1C324.1 425.4 326.7 424.5 328.3 424.3C332.2 423.6 342.4 413.1 349.3 402.8C357.9 389.9 358.0 389.4 358.0 371.1C358.0 353.4 357.5 352.0 351.8 352.0C344.9 352.0 325.3 343.4 312.5 334.7C282.7 314.6 260.0 284.0 251.0 252.0C249.3 245.9 248.5 229.3 249.8 226.6C250.4 225.5 251.8 222.4 252.9 219.9C258.9 206.9 280.8 192.4 301.1 188.1C303.0 187.7 305.3 186.9 306.1 186.5C307.6 185.5 313.3 184.5 325.6 183.0C330.1 182.5 334.9 181.6 336.4 181.0C340.7 179.4 401.4 179.7 407.0 181.4C409.5 182.1 413.9 182.8 416.7 182.9C419.6 183.0 423.1 183.5 424.5 184.0C426.0 184.6 428.6 185.0 430.3 185.0C432.1 185.1 434.6 185.7 436.0 186.5C437.4 187.3 439.4 187.9 440.5 188.0C441.6 188.0 445.6 189.2 449.5 190.6C478.6 201.5 493.2 216.9 492.9 236.5C492.8 242.9 490.8 253.9 489.2 256.7C488.6 257.9 488.0 259.6 488.0 260.5C488.0 262.8 483.6 272.8 479.4 280.1C469.8 296.9 458.5 310.9 445.7 321.7C429.4 335.6 418.4 342.5 402.3 348.6C398.6 350.0 393.2 351.5 390.3 351.9C387.4 352.3 384.7 352.9 384.3 353.4C383.9 353.8 383.4 361.1 383.2 369.6C382.9 387.1 383.4 388.9 392.2 402.2C417.9 440.9 455.0 457.9 487.0 445.6C504.7 438.8 522.6 423.4 536.5 402.9C541.4 395.7 551.3 376.2 552.4 371.6C552.8 370.0 554.8 366.9 556.9 364.8C562.3 359.5 568.5 359.3 573.5 364.3C575.4 366.2 577.2 369.0 577.6 370.5C578.4 373.8 575.6 385.6 573.4 388.1C572.6 388.9 572.0 390.2 572.0 390.9C572.0 392.8 562.3 410.6 557.0 418.5C544.5 437.0 524.4 455.7 508.0 464.3C501.0 467.9 490.5 472.0 488.0 472.0C486.6 472.1 484.4 472.7 483.0 473.5C481.1 474.6 476.6 474.9 465.0 474.9C453.4 474.9 448.9 474.6 447.0 473.5C445.6 472.7 443.4 472.0 442.0 472.0C440.6 472.0 437.7 471.1 435.5 470.0C433.3 468.9 430.9 468.1 430.2 468.0C428.4 468.0 412.4 459.2 411.0 457.5C410.3 456.7 409.2 456.0 408.6 456.0C405.4 456.0 377.8 428.0 374.0 421.0C372.3 417.8 369.4 418.6 366.3 423.1C364.8 425.3 361.8 429.2 359.8 431.8C356.8 435.4 356.0 437.3 356.0 440.5C356.0 442.7 354.9 447.7 353.6 451.6C345.0 476.7 326.5 495.7 303.5 503.0C301.3 503.7 298.1 504.8 296.5 505.5C289.9 508.3 257.8 511.5 255.9 509.5ZM253.0 481.7C253.0 481.0 250.5 478.0 247.4 475.0C228.4 456.3 220.6 431.9 223.2 398.5C224.2 385.5 225.1 383.1 230.3 380.0C236.3 376.3 244.6 378.5 247.4 384.5C248.8 387.3 248.9 390.3 248.4 403.7C247.6 421.7 249.2 430.5 255.2 442.3C259.1 450.1 269.6 460.6 277.1 464.3C291.6 471.5 312.9 469.1 321.5 459.3C323.8 456.7 324.9 452.1 323.2 451.9C322.8 451.9 320.2 451.7 317.5 451.6C304.5 450.9 294.1 444.3 288.0 432.8L284.6 426.5L283.9 407.5C283.5 397.1 282.7 386.5 282.1 384.0C281.5 381.5 281.0 378.1 281.0 376.5C280.9 366.6 265.9 348.5 253.8 343.7C243.8 339.7 238.0 339.4 227.6 342.0C214.0 345.4 203.3 353.5 195.9 366.0C190.1 376.0 188.8 381.7 188.3 400.5C187.7 419.4 189.2 428.7 194.7 440.6C203.2 459.3 223.1 476.0 242.1 480.4C245.5 481.2 248.5 482.1 248.8 482.4C249.9 483.5 253.0 483.0 253.0 481.7Z"
FOCINHO_LINGUA_LINGUA = "M238.0 477.6C222.6 472.1 211.5 463.8 202.6 451.2C199.5 446.8 197.0 442.8 197.0 442.3C197.0 441.9 196.1 439.8 195.1 437.9C189.3 427.1 187.5 397.6 191.7 380.6C199.0 350.5 229.1 334.5 256.0 346.6C263.5 350.0 272.6 359.3 276.5 367.7C279.4 374.2 281.3 387.4 282.8 413.6C283.6 427.4 283.9 429.1 286.5 433.9C292.6 445.1 302.6 451.7 315.0 452.7C318.9 453.0 322.3 453.6 322.5 454.0C323.4 455.5 318.3 461.1 314.2 463.0C292.8 473.2 266.5 463.1 256.1 440.8C250.8 429.4 249.7 422.6 250.2 404.6C250.8 385.3 250.0 382.3 243.5 378.5C241.2 377.1 238.1 376.0 236.5 376.0C232.8 376.0 226.1 379.9 224.5 383.0C219.8 392.1 220.3 428.9 225.4 442.7C229.7 454.6 236.0 465.1 243.6 472.7C246.6 475.7 249.0 478.6 249.0 479.1C249.0 480.6 244.8 480.1 238.0 477.6Z"


def focinho_lingua(escala=0.88, dy=0.5):
    s = 16 / 245 * escala
    tx, ty = 50 - 373 * s, 50.5 + dy - 180 * s
    return (f'<g transform="translate({tx:.2f} {ty:.2f}) scale({s:.4f})">'
            f'<path d="{FOCINHO_LINGUA_LINGUA}" fill="#E9592C"/>'
            f'<path d="{FOCINHO_LINGUA_CONTORNO}" fill="{AZUL}" fill-rule="evenodd"/></g>')


def cao(gap=LARANJA, olhos="abertos", guirlanda=True, lingua=False, focinho=None):
    """Desenho F1 (orelhas caídas) em viewBox 0 0 100 100, sem fundo.
    olhos: abertos | fechados | ambos (classes p/ CSS) | piscando."""
    # cabeça + orelhas caídas (F1): aba curta presa no alto da cabeça, que cai até a altura dos olhos;
    # o contorno na cor do fundo (gap) separa a orelha branca da cabeça
    s = (f'<path d="M50 22 C66 22 75 32 75 46 C75 54 72 60 67 64 C63 70 57 74 50 74 C43 74 37 70 33 64 C28 60 25 54 25 46 C25 32 34 22 50 22 Z" fill="{BRANCO}"/>'
         + "".join(f'<path d="{d}" fill="{BRANCO}" stroke="{gap}" stroke-width="2" stroke-linejoin="round"/>' for d in (ORELHA, ORELHA_ESQ)))
    aberto = lambda x: f'<circle cx="{x}" cy="45" r="3.4" fill="{AZUL}"/>'
    fechado = lambda x: f'<path d="M{x-3.8} 44.6 Q{x} 48.4 {x+3.8} 44.6" fill="none" stroke="{AZUL}" stroke-width="2.3" stroke-linecap="round"/>'
    abertos = f'<g class="olho-aberto">{aberto(40)}{aberto(60)}</g>'
    fechados = f'<g class="olho-fechado">{fechado(40)}{fechado(60)}</g>'
    s += {"abertos": abertos, "fechados": fechados, "ambos": abertos + fechados, "piscando": aberto(40) + fechado(60)}[olhos]
    y = 55
    if focinho:  # focinho, boca e língua prontos (desenho de referência vetorizado)
        s += focinho + f'<ellipse cx="50" cy="33" rx="2.7" ry="4.4" fill="{LARANJA}"/>'
    else:
      s += (f'<path d="M42 {y} C42 {y-2.5} 44 {y-3.5} 50 {y-3.5} C56 {y-3.5} 58 {y-2.5} 58 {y} C58 {y+4} 54 {y+6} 50 {y+6} C46 {y+6} 42 {y+4} 42 {y} Z" fill="{AZUL}"/>'
          + f'<path d="M50 {y+6} V{y+9}" stroke="{AZUL}" stroke-width="2" stroke-linecap="round" fill="none"/>'
          + (
             # língua para fora no canto esquerdo da boca (referência do Daniel): um lóbulo redondo
             # contornado, preso à haste do focinho, com a dobra em S por dentro; o sorriso fica só à direita
             f'<path d="M50 {y+9} C51.5 {y+12.5} 55.5 {y+13} 58.4 {y+7.6}" fill="none" stroke="{AZUL}" stroke-width="2" stroke-linecap="round"/>'
             f'<path d="M47.4 65.4 C47.6 62.2 45.4 60.2 42.7 60.2 C39.8 60.2 37.7 62.5 37.7 65.2 C37.7 68 39.9 70 42.7 70 C44.7 70 46.3 69 47.1 67.6" fill="#FFFFFF" stroke="{AZUL}" stroke-width="2.1" stroke-linecap="round"/>'
             f'<path d="M50 {y+9} C49.8 {y+11} 48.8 {y+12.2} 47.1 {y+12.6}" fill="none" stroke="{AZUL}" stroke-width="2" stroke-linecap="round"/>'
             f'<path d="M42.7 60.4 C45 61.9 45 64.6 43.1 65.6 C41.3 66.6 41.3 68.4 42.6 69.8" fill="none" stroke="{AZUL}" stroke-width="1.7" stroke-linecap="round"/>'
             if lingua else
             f'<path d="M42 {y+8} C45 {y+11.5} 48 {y+11} 50 {y+9} C52 {y+11} 55 {y+11.5} 58 {y+8}" fill="none" stroke="{AZUL}" stroke-width="2" stroke-linecap="round"/>')
          + f'<ellipse cx="50" cy="33" rx="2.7" ry="4.4" fill="{LARANJA}"/>')
    for k in range(9 if guirlanda else 0):
        a = math.pi * k / 8
        x, yy = 50 - 24 * math.cos(a), 71 + 17 * math.sin(a)
        s += f'<circle cx="{x:.2f}" cy="{yy:.2f}" r="5" fill="{BRANCO}" stroke="{gap}" stroke-width="1.8"/>'
    return s

def icone(tamanho=None, raio=22, escala=1.0, olhos="abertos"):
    """Ícone completo: fundo laranja + cachorro. raio=0 para quadrado cheio; escala<1 para ícone 'maskable'."""
    t = f' width="{tamanho}" height="{tamanho}"' if tamanho else ""
    g = cao(olhos=olhos)
    if escala != 1:
        g = f'<g transform="translate(50 50) scale({escala}) translate(-50 -50)">{g}</g>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"{t}><rect width="100" height="100" rx="{raio}" fill="{LARANJA}"/>{g}</svg>'

if __name__ == "__main__":
    import json, sys
    out = sys.argv[1]
    arq = {
        "icon-192.png": (192, icone(raio=22)), "icon-512.png": (512, icone(raio=22)),
        "icon-maskable-512.png": (512, icone(raio=0, escala=0.74)),
        "apple-touch-icon.png": (180, icone(raio=0, escala=0.88)), "favicon-32.png": (32, icone(raio=22)),
        "logo.svg": (0, icone(raio=22)),
    }
    json.dump({k: [v[0], v[1]] for k, v in arq.items()}, open(out, "w"))
    print(json.dumps({"cao": cao(), "ambos": cao(olhos="ambos"), "frase": cao(gap=AZUL),
                      "semGuirlanda": cao(gap="#C3122F", guirlanda=False), "fuso": cao(gap="#0D7A48", olhos="piscando"), "comida": cao(gap="#D6457A", focinho=focinho_lingua())}))
