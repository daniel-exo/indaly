"""O cachorro do Indaly (logo K1b). Gera o SVG usado no app e os ícones PNG."""
import math
LARANJA, AZUL, BRANCO = "#EE8A24", "#14224F", "#FFFFFF"

def cao(gap=LARANJA, olhos="abertos", guirlanda=True):
    """Desenho C2 (orelhas dobradas) em viewBox 0 0 100 100, sem fundo.
    olhos: abertos | fechados | ambos (classes p/ CSS) | piscando."""
    s = (f'<path d="M29 40 L27 17 C26.8 14.5 29 13.6 30.6 14.8 L47 26 Z" fill="{BRANCO}" stroke="{BRANCO}" stroke-width="2" stroke-linejoin="round"/>'
         f'<path d="M27.6 18.5 C27.4 15.6 29.4 14.6 31 15.8 L41.5 23 L33 31 Z" fill="{AZUL}"/>'
         f'<path d="M71 40 L73 17 C73.2 14.5 71 13.6 69.4 14.8 L53 26 Z" fill="{BRANCO}" stroke="{BRANCO}" stroke-width="2" stroke-linejoin="round"/>'
         f'<path d="M72.4 18.5 C72.6 15.6 70.6 14.6 69 15.8 L58.5 23 L67 31 Z" fill="{AZUL}"/>'
         f'<path d="M50 22 C66 22 75 32 75 46 C75 54 72 60 67 64 C63 70 57 74 50 74 C43 74 37 70 33 64 C28 60 25 54 25 46 C25 32 34 22 50 22 Z" fill="{BRANCO}"/>')
    aberto = lambda x: f'<circle cx="{x}" cy="45" r="3.4" fill="{AZUL}"/>'
    fechado = lambda x: f'<path d="M{x-3.8} 44.6 Q{x} 48.4 {x+3.8} 44.6" fill="none" stroke="{AZUL}" stroke-width="2.3" stroke-linecap="round"/>'
    abertos = f'<g class="olho-aberto">{aberto(40)}{aberto(60)}</g>'
    fechados = f'<g class="olho-fechado">{fechado(40)}{fechado(60)}</g>'
    s += {"abertos": abertos, "fechados": fechados, "ambos": abertos + fechados, "piscando": aberto(40) + fechado(60)}[olhos]
    y = 55
    s += (f'<path d="M42 {y} C42 {y-2.5} 44 {y-3.5} 50 {y-3.5} C56 {y-3.5} 58 {y-2.5} 58 {y} C58 {y+4} 54 {y+6} 50 {y+6} C46 {y+6} 42 {y+4} 42 {y} Z" fill="{AZUL}"/>'
          f'<path d="M50 {y+6} V{y+9}" stroke="{AZUL}" stroke-width="2" stroke-linecap="round" fill="none"/>'
          f'<path d="M42 {y+8} C45 {y+11.5} 48 {y+11} 50 {y+9} C52 {y+11} 55 {y+11.5} 58 {y+8}" fill="none" stroke="{AZUL}" stroke-width="2" stroke-linecap="round"/>'
          f'<ellipse cx="50" cy="33" rx="2.7" ry="4.4" fill="{LARANJA}"/>')
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
                      "semGuirlanda": cao(guirlanda=False), "fuso": cao(gap="#0D7A48", olhos="piscando")}))
