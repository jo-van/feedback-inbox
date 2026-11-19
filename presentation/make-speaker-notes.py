import re,html,pathlib,sys
md=pathlib.Path('talking-points.md').read_text()
blocks=re.split(r'\n(?=\*\*(?:\[\d+\]|LIVE))',md)[1:]
def inline(t):
    t=html.escape(t,quote=False)
    t=re.sub(r'\*\*(.+?)\*\*',r'<strong>\1</strong>',t)
    t=re.sub(r'(?<![\w*])\*(.+?)\*(?!\w)',r'<em>\1</em>',t)
    return t
cards=[]
for b in blocks:
    lines=b.strip().split('\n'); head=lines[0]
    m=re.match(r'\*\*(.+?)\*\*\s*(.*)',head); bold,rest=m.groups()
    tm=re.match(r'(\[\d+\]|LIVE \w+)\s*(.*)',bold); tag,remain=tm.groups()
    parts=[p.strip(' .') for p in remain.split('·') if p.strip(' .')]
    time=''; title=[]
    for p in parts:
        if not time and re.match(r'^\d{1,2}:\d\d',p): time=p
        else: title.append(p)
    tw=re.search(r'from (\d:\d\d)',' '.join(title))
    if not time and tw: time=tw.group(1)
    title=' · '.join(title)
    live=tag.startswith('LIVE')
    sub=''
    if rest.strip().startswith('('): sub=rest.strip().strip('()'); rest=''
    items=([rest.strip()] if rest.strip() else [])+[l[2:] for l in lines[1:] if l.startswith('- ')]
    lis=''.join(f'<li{" class=fb" if re.match(r"^\*[^*]",it.strip()) else ""}>{inline(it)}</li>' for it in items)
    cards.append(f'<section class="card{" live" if live else ""}"><header><span class="tag">{html.escape(tag.strip("[]"))}</span><span class="time">{html.escape(time)}</span><h2>{inline(title)}</h2>{f'<span class=sub>{html.escape(sub)}</span>' if sub else ''}</header><ul>{lis}</ul></section>')
css='''@page { size: letter; margin: 0.45in 0.5in; }
*{box-sizing:border-box}
body{font:13.5pt/1.38 -apple-system,"Helvetica Neue",Arial,sans-serif;color:#111;background:#fff;margin:0 auto;max-width:7.6in}
.top{display:flex;justify-content:space-between;align-items:baseline;border-bottom:3px solid #111;padding-bottom:4px;margin-bottom:10px}
.top h1{font-size:16pt;margin:0;white-space:nowrap}.sub{font-size:11pt;color:#555;font-style:italic}.top div{font-size:10.5pt;color:#444}
.card{break-inside:avoid;border:1.5px solid #bbb;border-radius:8px;padding:8px 12px 6px;margin:0 0 9px}
.card.live{border:2.5px solid #111;background:#f4f4f4}
header{display:flex;align-items:baseline;gap:10px}
.tag{font-weight:800;font-size:12pt;background:#111;color:#fff;border-radius:5px;padding:1px 8px;min-width:2.2em;text-align:center}
.live .tag{background:#c00}
.time{font-weight:800;font-size:14pt;font-variant-numeric:tabular-nums;min-width:4.4em}
h2{font-size:14pt;margin:0}
ul{margin:5px 0 2px;padding-left:1.15em}li{margin:2px 0}
strong{background:#fff2a8;padding:0 2px}
li.fb{color:#333;font-size:12pt;list-style:"↳ "}li.fb em{font-style:normal}
.foot{font-size:10.5pt;color:#222;border-top:1.5px solid #111;padding-top:6px;break-inside:avoid}
.foot code{font-size:10pt;background:#eee;padding:0 3px}
@media screen{body{padding:24px}}'''
out=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Speaker Notes</title><style>{css}</style></head><body>
<div class="top"><h1>Speaker Notes · Your Ideas, Built Live</h1><div>Thu Nov 19 · 3:00–3:45 · highlight = line to land · red tag = live screen</div></div>
<p style="margin:0 0 9px"><strong>The one idea:</strong> workers (one job each) + contracts (what goes in, what comes out) + routing (who's next). Any factory can be a worker in a bigger one.</p>
{"".join(cards)}
<div class="foot"><b>If it goes wrong:</b> kill switch <code>ff.sh kill</code> (undo <code>ff.sh resume</code>) · bad change live <code>ff.sh rollback</code> · why it stopped <code>ff.sh why &lt;id&gt;</code> · Floor dead → PREVIOUS RUN video, say "from rehearsal." <b>Never</b> touch the factory during the talk. <b>Never</b> call the recording today's run.</div>
</body></html>'''
pathlib.Path('speaker-notes-print.html').write_text(out); print(len(cards),'cards')
