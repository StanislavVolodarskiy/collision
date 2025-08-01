const updateElement = (element, attributes) => {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
};

const createElement = (parent_, tag, attributes) => {
    const element = document.createElement(tag);
    updateElement(element, attributes);
    parent_.appendChild(element);
    return element;
};

const createElementNS = (parent_, namespace, tag, attributes) => {
    const element = document.createElementNS(namespace, tag);
    updateElement(element, attributes);
    parent_.appendChild(element);
    return element;
};

const createTextNode = (parent_, text) => {
    const node = document.createTextNode(text);
    parent_.appendChild(node);
    return node;
}

export {
    updateElement,
    createElement,
    createElementNS,
    createTextNode
};
