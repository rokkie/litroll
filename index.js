
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
  ${(files.css || []).map(styleTag.bind(undefined, publicPath, attributes.link)).join('\\n')}
</head>
<body>
<div id="main"></div>
${(files.js || []).map(scriptTag.bind(undefined, publicPath, attributes.script)).join('\n')}
</body>
</html>
`;
