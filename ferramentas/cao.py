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

def cao(gap=LARANJA, olhos="abertos", guirlanda=True, lingua=False):
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
                      "semGuirlanda": cao(gap="#C3122F", guirlanda=False), "fuso": cao(gap="#0D7A48", olhos="piscando"), "comida": cao(gap="#D6457A", lingua=True)}))
