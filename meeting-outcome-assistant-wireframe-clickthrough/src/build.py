import pathlib, sys
b = pathlib.Path(__file__).parent
out_dir = b.parent
out_dir.mkdir(parents=True, exist_ok=True)
css = (b/'styles.css').read_text()
body = (b/'body.html').read_text()
js = '\n'.join((b/f).read_text() for f in ['js1_core.js','js2_logic.js','js3_views.js','js3b_pages.js','js3c_tips.js','js4_app.js'])
assert '</script' not in js.lower(), 'script terminator inside js'
html = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Meeting Outcome Assistant · Interactive wireframe</title>
<style>
{css}
</style>
</head>
<body>
{body}
<script>
{js}
</script>
</body>
</html>
'''
(out_dir/'index.html').write_text(html)
print('wrote', out_dir/'index.html', len(html), 'bytes')
