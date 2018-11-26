import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import each from 'lodash/each';
import toMarkdown from 'to-markdown';
import { stateToHTML } from 'draft-js-export-html';

export const checkChanged = (obj1, obj2) => {
    const deepEquals = (ar1, ar2) => {
        let stillMatches;
        const fail = () => {
            stillMatches = false;
        };
        if (!((isArray(ar1) && isArray(ar2)) || (isObject(ar1) && isObject(ar2)))) {
            return false;
        }
        if (ar1.length !== ar2.length) {
            return false;
        }
        stillMatches = true;
        each(ar1, (prop1, n) => {
            const prop2 = ar2[n];
            if (prop1 !== prop2 && !deepEquals(prop1, prop2)) {
                fail();
            }
        });
        return stillMatches;
    };

    if (!deepEquals(obj1, obj2)) {
        return true;
    }

    return false;
};

export const contentStateToMarkdown = (content) => {
    if (content) {
        const contentState = content.getCurrentContent();
          let markDown = toMarkdown(stateToHTML(contentState));
          // clean figure tags produced from embedding external images
          markDown = markDown.replace('<figure>', '').replace('</figure>', '');
          if (markDown.startsWith('![attachment-')) {
            return markDown.trim().replace(/.$/,' =500x500)');
          }
          return markDown;
    }

    return '';
};

export const elementInViewport  = (el) => {
    var elemTop = el.getBoundingClientRect().top;
    var elemBottom = el.getBoundingClientRect().bottom;
    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    return isVisible;
};