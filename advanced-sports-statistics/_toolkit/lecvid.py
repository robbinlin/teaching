"""Insert the lecture-video slot into a built chapter page (used by static.py and for patching built pages)."""
import os
G = os.path.dirname(__file__)
MARK = '<div class="lecvid" id="lecVid"'


def lecvid(html, ch):
    if MARK in html:
        return html
    head = html.index('id="h-slides"')
    end = html.index('</div>', head) + len('</div>')          # end of the slides stage-head
    html = html[:end] + f'\n  <div class="lecvid" id="lecVid" data-ch="{ch}" hidden></div>' + html[end:]
    html = html.replace('</style>', open(G + '/lecvid.css', encoding='utf-8').read() + '</style>', 1)
    tail = '<script src="../lecture-videos.js"></script><script>' + open(G + '/lecvid.js', encoding='utf-8').read() + '</script>\n'
    i = html.rfind('</html>')
    return html[:i] + tail + html[i:] if i >= 0 else html + tail
