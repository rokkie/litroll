
const attrs = o => Object.entries(o || {}).map(([k, v]) => `${k}="${v}"`).join(' ');

const metaTag = o => `<meta ${attrs(o)} />`;

const styleTag = (publicPath, link, { fileName }) =>  `<link href="${publicPath}${fileName}" rel="stylesheet" ${attrs(link)}>`;

const scriptTag = (publicPath, script, { fileName }) => `<script src="${publicPath}${fileName}" ${attrs(script)}></script>`;

export default ({ attributes, bundle, files, meta: metas, publicPath, title }) => `
<!DOCTYPE html>
<html ${attrs(attributes.html)}>
<head>
  ${metas.map(metaTag).join('\n')}
  <title>${title}</title>
  <style type="text/css">
  @import url(//fonts.googleapis.com/css2?family=Fira+Sans:wght@400;600&display=swap);

  :root {
    --color-primary: #474f66;
    --color-secondary: #fff5f5;
  }

  html, body {
    margin: 0;
    box-sizing: border-box;
    font-size: 16px;
    font-family: 'Fira Sans', sans-serif;
      font-weight: 400;
  }

  #main {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr auto;
  }
  </style>
  ${(files.css || []).map(styleTag.bind(undefined, publicPath, attributes.link)).join('\\n')}
</head>
<body>
<div id="main"></div>
${(files.js || []).map(scriptTag.bind(undefined, publicPath, attributes.script)).join('\n')}
</body>
</html>
`;
