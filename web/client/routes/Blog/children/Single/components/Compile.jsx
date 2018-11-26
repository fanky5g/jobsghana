import React, {createElement} from 'react';
import marksy from 'marksy';
import Figure from './ProgressiveFig';

function compiler(string) {
  const props = this.props;
  const state = this.state;

  const findNested = (childArray) => {
    let nested;
    if (childArray.length) {
      childArray.some((item) => {
        if (item && item.type) {
          nested = item;
          return true;
        }
      });
    }
    return nested;
  };

  const compile = marksy({
    createElement,
    elements: {
      h1({ id, children }) {
        return (
          <h1 className="graf graf--h3 graf--title">{children}</h1>
        );
      },
      h2({ id, children }) {
        return (
          <h2 className="graf graf--h2">{children}</h2>
        );
      },
      h3({ id, children }) {
        return (
          <h3 className="graf graf--h3">{children}</h3>
        );
      },
      h4({ id, children }) {
        return (
          <h4 className="graf graf--h4">{children}</h4>
        );
      },
      blockquote({ children }) {
        return (
          <blockquote className="graf graf--pullquote">
            {children}
          </blockquote>
        );
      },
      // hr() {},
      ol({ children }) {
        return <ol className="postList">{children}</ol>;
      },
      ul({ children }) {
        return <ul className="postList">{children}</ul>;
      },
      p({ children }) {
        const element = findNested(children);

        if (element) {
          return element;
        }

        return (
          <p className="graf graf--p">
          {children}
        </p>
        );
      },
      // table({ children }) {},
      // thead({ children }) {},
      // tbody({ children }) {},
      // tr({ children }) {},
      // th({ children }) {},
      // td({ children }) {},
      a({ href, title, target, children }) {
        return (
          <a
            href={href}
            target="_blank"
            className="markup--anchor markup--p-anchor"
            >
            {children}
          </a>
        );
      },
      strong({ children }) {
        return <strong className="markup--strong">{children}</strong>
      },
      em({ children }) {
        return (
            <em className="markup--em">{children}</em>
        );
      },
      // br() {},
      // del({ children }) {},
      img({ src, alt }) {

        const image = props.post.attachments.find((item) => {
          return src.includes(item.key);
        });

        if (image) {
          return (
            <Figure
              image={image}
                  isMounted={state.isMounted}
                  clientWidth={props.screenWidth}
                  clientHeight={props.screenHeight}
                  location={props.currLocation}
            />
          );
        }
        return <img src={src} alt={alt} />
      },
      // code({ language, code }) {},
      // codespan({ children }) {}
    },
  });

  return compile(string);
}


const compiled = (string, binding) => {
  return compiler.call(binding, string);
}

export default compiled;
