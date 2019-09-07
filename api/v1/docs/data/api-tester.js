/*This code makes pretty API docs using api-tester-data.js.
* Just don't touch it since it works well. */

const APITester = {};

const concReusable = (...keys) => {
    let res = [];
    for (let i = 0; i < keys.length; i++)
        res = res.concat(APITester.reusable[keys[i]]);

    return res;
};
const get = id => document.getElementById(id);
const getCl = clsName => document.getElementsByClassName(clsName);
const toggleThis = (node) => node.classList.toggle('hidden');
const HTMLformat = (text) => text.replace(/(?:\r\n|\r|\n)/g, '<br>');
const write = (text) => get('container').innerHTML += text;
const ifEmpty = (a, b) => a ? a : b;

executeForm = (method, path) => {
    const queryParams = getCl(`${method}-query`),
        query = Array
        	.from(queryParams)
        	.filter(el => !!el.value)
        	.map(el =>
        		`${el.getAttribute('name')}=${el.value}`)
        	.join('&'),
        pathParams = getCl(`${method}-path`);
    Array.from(pathParams).forEach(el => {
        path = path.replace(`{${el.name}}`, el.value);
    });
    const url = `${APITester.testingPath}/${path}${query?'?':''}${query}`;
    get(`executeURL-${method}`)
    	.innerHTML = `Here we go: <a href="${url}">you can copy this.</a>`;
};

window.onload = () => {
    write('<h1>Methods</h1>');
    for (path in APITester.paths) {
        if (!APITester.paths.hasOwnProperty(path)) continue;
        const currPath = APITester.paths[path];
        for (method in currPath) {
            if (!currPath.hasOwnProperty(method)) continue;
            const currMethod = currPath[method],
                methodId = `Method-${method}-${path}`;
            let parameters = '';
            for (let i = 0; i < currMethod.parameters.length; i++) {
                const currParam = currMethod.parameters[i],
                    range = currParam.type === 'integer' ? `<span class="range">Range: <span>${ifEmpty(currParam.minimum, '~')} to ${ifEmpty(currParam.maximum, '~')}</span></span>` : '',
                    examples = currParam.examples.map(el => isNaN(el * 1) ? `"${el}"` : el).join(', '),
                    required = currParam.required ? 'required' : '',
                    paramId = `${methodId}-${currParam.name}`,
                    input = currParam.type !== 'bool' ? `<input type="text" class="${methodId}-${currParam.in}" name="${currParam.name}">` : '',
                    form = currParam.type !== 'bool' ? `<div class="form">${input}<span class="examples">Examples: <span>${examples}</span>,</span><span class="default">default: <span>${currParam.default}</span>.</span>${range}</div>` : '';
                parameters += `<li class="${required}"><div class="list"><span class="name">${currParam.name}</span><span class="type">${currParam.type}</span><span class="in">in: ${currParam.in}.</span><span class="description">${currParam.description}</span></div>${form}</li>`;
            }
            let errors = currMethod.raises
            	.map(el => `<a href="#Error-${el}">${el}</a>`).join(', ');
            let response = '';
            if (currMethod.response.context)
                response = `${currMethod.response.context} of <a href="#Class-${currMethod.response.class}">${currMethod.response.class}</a>`;
            else
                response = currMethod.response;
            write(`<div class="box method ${method} hidden"><div class="head" onclick="toggleThis(this.parentNode)"><b>${method}</b><span>${path}</span></div><div class="content">${currMethod.description}<ul class="parameters">${parameters}</ul><p>This method can raise following errors: ${errors}<br>Usual response is: ${response}</p><button onclick="executeForm('${methodId}', '${path}')">Make URL</button><span class="testUrl" id="executeURL-${methodId}"></span></div></div>`);
        }
    }
    write('<h1>Classes</h1>');

    function renderRecursively(obj, level = 0) {
        if (!obj.properties) return false;
        const className = level === 0 ? 'codeobject' : obj.type;
        propsHTML += `<ul class="${className}">`;
        level++;
        for (property in obj.properties) {
            if (!obj.properties.hasOwnProperty(property)) continue;
            const currProperty = obj.properties[property];
            propsHTML += '<li>';
            let example = '',
                exampleTag = '',
                uniqueMark = '',
                valueProperties = '';
            if (currProperty.refClass) {
                exampleTag = `${currProperty.type == 'array' ? '[' : ''}<a href="#Class-${currProperty.refClass}">{Class:${currProperty.refClass}}</a>${currProperty.type == 'array' ? ', ...]' : ''}`;
                valueProperties = `<p><span>Type: <span>${currProperty.type}</span></span><span class="description">${currProperty.description}</span></p>`;
            } else {
                example = currProperty.properties ? '...' : currProperty.example;
                exampleTag = isNaN(example * 1) ? `<string>"${example}"</string>` : `<const>${example}</const>`;
                valueProperties = `<p><span>Type: <span>${currProperty.type}</span></span><span>Maximal length: <span>${currProperty.maxLength}</span></span><span class="description">${currProperty.description}</span><span>Default: <span>${currProperty.default}</span></span></p>`;
            }
            if (currProperty.unique === true)
                uniqueMark = '<span class="uniquality">*unique</span>';
            else if (!currProperty.unique)
                uniqueMark = '';
            else
                uniqueMark = `<span class="uniquality">*unique pair with ${currProperty.unique}</span>`;
            propsHTML += `<code class="line"><name>"${property}"</name>: ${exampleTag}${uniqueMark}</code>${valueProperties}`;
            renderRecursively(currProperty, level);
            propsHTML += '</li>';
        }
        propsHTML += '</ul>';
        return propsHTML;
    }

    for (cls in APITester.classes) {
        if (!APITester.classes.hasOwnProperty(cls)) continue;
        const currCls = APITester.classes[cls];
        window.propsHTML = '';
        renderRecursively(currCls);
        write(`<div class="box class hidden" id="Class-${cls}"><div class="head" onclick="toggleThis(this.parentNode)"><b>class</b><span>${cls}</span></div><div class="content">${currCls.description}<br>The example appearance with full list of variables and their properties listed below.${propsHTML}</div></div>`);
    }
    write('<h1>Errors</h1>');
    for (type in APITester.errors) {
        if (!APITester.errors.hasOwnProperty(type)) continue;
        const currType = APITester.errors[type];
        for (const error in currType) {
            if (!currType.hasOwnProperty(error)) continue;
            const currError = currType[error];
            write(`<div class="box error ${type} hidden" id="Error-${currError.code}"><div class="head" onclick="toggleThis(this.parentNode)"><b>${type}</b><span>${currError.code}: ${currError.name}</span></div><div class="content">${currError.description}<br>Here's the example of output:<code>${lightUpJSON(JSON.stringify(currError.body, null, '  ').concat('\n'))}</code></div></div>`);
        }
    }
};
