import { buildMdxWithFrontmatter, isValidSlug, safeFilename, slugify, validateMdxBodySafety } from './publisher';

describe('publisher utilities', () => {
  test('creates stable URL-safe slugs and filenames', () => {
    expect(slugify(' A Test: Post! ')).toBe('a-test-post');
    expect(isValidSlug('a-test-post')).toBe(true);
    expect(isValidSlug('A Test')).toBe(false);
    expect(safeFilename('Lake photo (final).jpg')).toBe('Lake-photo-final.jpeg');
  });

  test('serializes MDX frontmatter with a trailing newline', () => {
    expect(
      buildMdxWithFrontmatter({
        title: 'A "quoted" title', slug: 'quoted-title', date: '2026-07-30', excerpt: 'Summary',
        coverSrc: '/assets/uploads/cover.jpeg', coverAlt: 'Cover', body: 'Hello world.',
      })
    ).toContain('title: "A \\"quoted\\" title"');
  });

  test('allows fenced code while blocking executable MDX imports', () => {
    expect(validateMdxBodySafety('```js\nimport value from "x";\n```')).toBeNull();
    expect(validateMdxBodySafety('import value from "x";')).toMatch(/must not contain import/);
  });
});
