
const attrs = o => Object.entries(o || {}).map(([k, v]) => `${k}="${v}"`).join('');

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
  html, body {
    margin: 0;
    box-sizing: border-box;
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
