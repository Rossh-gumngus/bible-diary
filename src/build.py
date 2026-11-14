"""Сборка index.html из исходников в src/.

    python3 src/build.py                    # index.html со встроенными шрифтами (по умолчанию)
    FONT_MODE=google python3 src/build.py   # шрифты по ссылке Google Fonts (файл меньше)
    OUT=other.html python3 src/build.py     # другой выходной файл (путь относительно корня репозитория)

FONT_MODE=embed встраивает woff2 из src/fonts/ как data:-URI — страница не делает запросов к сторонним серверам
(кроме Google Identity Services и Drive API, и только после нажатия «Войти через Google»)."""
import os, re, base64

SRC = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(SRC)
OUT = os.path.join(ROOT, os.environ.get('OUT', 'index.html'))
MODE = os.environ.get('FONT_MODE', 'embed')
FONT_LINK = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
             '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
             '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700'
             '&family=Manrope:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap">')

def rd(name):
    with open(os.path.join(SRC, name), encoding='utf-8') as f:
        return f.read()

head = rd('head.html')
assert '@@FONTS@@' in head
fonts = rd('font-stack.css')
if MODE == 'embed':
    fc = rd('fonts/fonts.css')
    def inl(m):
        with open(os.path.join(SRC, 'fonts', m.group(1).strip('\'"')), 'rb') as f:
            return 'url(data:font/woff2;base64,%s)' % base64.b64encode(f.read()).decode()
    fc = re.sub(r'url\(([^)]+\.woff2)\)', inl, fc)
    assert 'http' not in fc, 'в fonts/fonts.css остались внешние ссылки'
    fonts = fc + '\n' + fonts
    head = head.replace('@@FONTS@@', '')
elif MODE == 'google':
    head = head.replace('@@FONTS@@', FONT_LINK)
else:
    raise SystemExit('FONT_MODE должен быть embed или google')

def dark(css):
    d = rd('dark.vars').strip()
    return css.replace('/*@DARK@*/', '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){' + d + '}}\n:root[data-theme="dark"]{' + d + '}')

css = fonts + '\n' + rd('main.css').rstrip() + '\n' + rd('ui.css') + '\n' + dark(rd('theme.css')) + '\n' + rd('sync.css')
js = rd('config.js') + rd('plans.js') + rd('app.js') + '\n' + rd('sync.js') + '\n' + rd('plan.js') + '\n' + rd('ui.js')
out = (head + '<style>\n' + css + '</style>\n<style id="ybcss">' + rd('yb.css') + '</style>\n</head>\n<body>\n'
       + rd('body.html') + '\n<script>\n' + js + '</script>\n</body>\n</html>\n')
with open(OUT, 'w', encoding='utf-8') as f:
    f.write(out)
print(os.path.relpath(OUT, ROOT), len(out), MODE)
