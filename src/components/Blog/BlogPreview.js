import React, { useEffect, useMemo } from 'react';
import Callout from './Callout';
import Figure from './Figure';

const parseProps = (value) => {
  const props = {};
  const re = /([A-Za-z0-9_]+)="([^"]*)"/g;
  let match = re.exec(value || '');
  while (match) {
    props[match[1]] = match[2];
    match = re.exec(value || '');
  }
  return props;
};

const renderInline = (text) => {
  const parts = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`/g;
  let last = 0;
  let match = re.exec(text);
  while (match) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1]) {
      parts.push(
        <a key={`${match.index}-a`} href={match[2]}>
          {match[1]}
        </a>
      );
    } else {
      parts.push(<code key={`${match.index}-code`}>{match[3]}</code>);
    }
    last = re.lastIndex;
    match = re.exec(text);
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
};

const renderMarkdownBlocks = (text, keyPrefix) => {
  return String(text || '')
    .split(/\n{2,}/)
    .map((block, index) => {
      const trimmed = block.trim();
      if (!trimmed) return null;
      const key = `${keyPrefix}-${index}`;

      if (/^---+$/.test(trimmed)) return <hr key={key} />;
      if (trimmed.startsWith('### ')) return <h3 key={key}>{renderInline(trimmed.slice(4))}</h3>;
      if (trimmed.startsWith('## ')) return <h2 key={key}>{renderInline(trimmed.slice(3))}</h2>;
      if (trimmed.startsWith('# ')) return <h2 key={key}>{renderInline(trimmed.slice(2))}</h2>;

      if (trimmed.split('\n').every((line) => /^-\s+/.test(line.trim()))) {
        return (
          <ul key={key}>
            {trimmed.split('\n').map((line, itemIndex) => (
              <li key={`${key}-${itemIndex}`}>{renderInline(line.trim().replace(/^-\s+/, ''))}</li>
            ))}
          </ul>
        );
      }

      if (trimmed.split('\n').every((line) => /^>\s?/.test(line.trim()))) {
        return (
          <blockquote key={key}>
            {trimmed.split('\n').map((line) => line.trim().replace(/^>\s?/, '')).join(' ')}
          </blockquote>
        );
      }

      return <p key={key}>{renderInline(trimmed.replace(/\n/g, ' '))}</p>;
    })
    .filter(Boolean);
};

const renderPreviewBody = (body, resolveSrc) => {
  const nodes = [];
  const re = /<Figure\s+([^>]*)\/>|<Callout\s*([^>]*)>([\s\S]*?)<\/Callout>/g;
  let last = 0;
  let match = re.exec(body || '');
  while (match) {
    if (match.index > last) {
      nodes.push(...renderMarkdownBlocks(body.slice(last, match.index), `md-${last}`));
    }

    if (match[1]) {
      const props = parseProps(match[1]);
      nodes.push(
        <Figure
          key={`figure-${match.index}`}
          src={resolveSrc(props.src)}
          alt={props.alt}
          caption={props.caption}
        />
      );
    } else {
      const props = parseProps(match[2]);
      nodes.push(
        <Callout key={`callout-${match.index}`} title={props.title} variant={props.variant}>
          {renderMarkdownBlocks(match[3], `callout-${match.index}`)}
        </Callout>
      );
    }
    last = re.lastIndex;
    match = re.exec(body || '');
  }

  if (last < String(body || '').length) {
    nodes.push(...renderMarkdownBlocks(String(body || '').slice(last), `md-${last}`));
  }

  return nodes.length ? nodes : <p className="muted">Preview will appear here as you write.</p>;
};

const BlogPreview = ({ title, date, excerpt, coverAlt, coverFile, body, extraFiles }) => {
  const objectUrls = useMemo(() => {
    const entries = [];
    if (coverFile) entries.push([coverFile.name, URL.createObjectURL(coverFile)]);
    for (const file of extraFiles || []) entries.push([file.name, URL.createObjectURL(file)]);
    return entries;
  }, [coverFile, extraFiles]);

  useEffect(() => {
    return () => {
      objectUrls.forEach(([, url]) => URL.revokeObjectURL(url));
    };
  }, [objectUrls]);

  const srcMap = useMemo(() => new Map(objectUrls), [objectUrls]);
  const resolveSrc = (src) => {
    const filename = String(src || '').split('/').pop();
    return srcMap.get(filename) || src;
  };

  const coverSrc = coverFile ? srcMap.get(coverFile.name) : '';

  return (
    <article className="post blog-preview">
      <header className="post__head">
        <p className="post__kicker">{date || 'Draft'}</p>
        <h1 className="post__title">{title || 'Untitled draft'}</h1>
        {excerpt ? <p className="post__lede">{excerpt}</p> : null}
      </header>
      {coverSrc ? (
        <figure className="post__cover">
          <img className="post__coverimg" src={coverSrc} alt={coverAlt || ''} />
        </figure>
      ) : null}
      <div className="post__body prose">{renderPreviewBody(body, resolveSrc)}</div>
    </article>
  );
};

export default BlogPreview;
