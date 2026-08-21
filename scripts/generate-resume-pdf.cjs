/* Generates public/resume.pdf from src/data/resume, the same data source the
 * on-site /resume page renders. Keeps the download and the page in sync.
 *
 * Layout intentionally mirrors the older hand-made resume: a two-column
 * "table" (left label column, right content column, full-width rules between
 * rows), set in Lato (body) and Raleway Bold (headings/labels). @fontsource
 * only ships woff2, so those are decompressed to raw TTF via wawoff2 at
 * generation time rather than committing binary font files to the repo.
 */
const fs = require('fs');
const path = require('path');

require('@babel/register')({
  presets: ['@babel/preset-env'],
  only: [path.resolve(__dirname, '..', 'src')],
});

const PDFDocument = require('pdfkit');
const wawoff2 = require('wawoff2');
const assembleResume = require('../src/data/resume').default;

const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'resume.pdf');
const MARGIN = 50;
const LABEL_WIDTH = 115;
const COL_GAP = 18;

const COLOR = {
  text: '#17181a',
  muted: '#5a5f63',
  rule: '#1a1a1a',
  link: '#1155cc',
};

const FONT_FILES = {
  Lato: 'node_modules/@fontsource/lato/files/lato-latin-400-normal.woff2',
  'Lato-Bold': 'node_modules/@fontsource/lato/files/lato-latin-700-normal.woff2',
  'Raleway-Bold': 'node_modules/@fontsource/raleway/files/raleway-latin-700-normal.woff2',
};

// wawoff2's decompress() is backed by a shared WASM module that isn't
// reentrant — decompressing multiple fonts concurrently (e.g. via
// Promise.all) corrupts the output. Must stay sequential.
const loadFonts = async () => {
  const fonts = {};
  for (const [name, relPath] of Object.entries(FONT_FILES)) {
    const woff2Buffer = fs.readFileSync(path.join(__dirname, '..', relPath));
    const ttf = await wawoff2.decompress(woff2Buffer);
    fonts[name] = Buffer.from(ttf);
  }
  return fonts;
};

const contentWidth = (doc) => doc.page.width - doc.page.margins.left - doc.page.margins.right;

const resetX = (doc) => {
  doc.x = doc.page.margins.left;
};

const currentPageIndex = (doc) => {
  const range = doc.bufferedPageRange();
  return range.start + range.count - 1;
};

const drawRule = (doc) => {
  const left = doc.page.margins.left;
  const right = doc.page.width - doc.page.margins.right;
  doc.moveTo(left, doc.y).lineTo(right, doc.y).lineWidth(1).strokeColor(COLOR.rule).stroke();
};

// Item title (bold, left) and meta/dates (italic, right) on one line, matching
// .resume-item__top on the web page.
const itemHeader = (doc, title, meta) => {
  const left = doc.page.margins.left;
  const width = contentWidth(doc);
  const y = doc.y;
  const startPage = doc.page;

  doc.font('Lato-Bold').fontSize(10).fillColor(COLOR.text).text(title, left, y, { width: width * 0.78 });
  const afterTitleY = doc.y;
  // If the title alone triggered a page break, `y`/`left` are stale — they
  // describe a position on the page we just left. Right-aligning meta against
  // them would place it at that same (now-meaningless) coordinate on the new
  // page, which can itself overflow and silently spawn another page. Fall
  // back to stacking meta on its own line instead of chasing the old y.
  if (meta) {
    if (doc.page === startPage) {
      doc.font('Lato').fontSize(8.5).fillColor(COLOR.muted).text(meta, left, y, { width, align: 'right' });
      doc.y = Math.max(afterTitleY, doc.y);
    } else {
      resetX(doc);
      doc.font('Lato').fontSize(8.5).fillColor(COLOR.muted).text(meta);
    }
  } else {
    doc.y = afterTitleY;
  }

  resetX(doc);
  doc.fillColor(COLOR.text);
  doc.moveDown(0.15);
};

const bulletLine = (doc, text) => {
  const left = doc.page.margins.left;
  const indent = 11;
  const width = contentWidth(doc);
  const y = doc.y;

  doc.font('Lato').fontSize(9).fillColor(COLOR.text);
  doc.text('•', left, y, { width: indent });
  doc.text(text, left + indent, y, { width: width - indent, lineGap: 1 });
  resetX(doc);
  doc.moveDown(0.18);
};

const paragraph = (doc, text) => {
  resetX(doc);
  doc.font('Lato').fontSize(9.5).fillColor(COLOR.text).text(text, { width: contentWidth(doc), lineGap: 1.5 });
};

const groupLabel = (doc, text) => {
  resetX(doc);
  doc.font('Lato-Bold').fontSize(9).fillColor(COLOR.text).text(text);
  doc.moveDown(0.08);
};

// Closing a `continued` chain with a dummy empty-string call doesn't reliably
// advance doc.y to below the line — the fix is to make the *real* last
// segment the one that carries continued:false.
const contactBlock = (doc, profile) => {
  doc.font('Raleway-Bold').fontSize(9.5).fillColor(COLOR.text).text('Contact:');
  doc.moveDown(0.2);
  resetX(doc);
  doc.fontSize(9);

  const segment = (text, { continued, color = COLOR.text, link, underline } = {}) => {
    doc.font('Lato').fillColor(color).text(text, { continued, link, underline });
  };

  segment(profile.phone.label, { continued: true });
  segment('   |   ', { continued: true, color: COLOR.muted });
  segment(profile.email.label, { continued: false, color: COLOR.link, link: profile.email.href, underline: true });

  resetX(doc);
  doc.moveDown(0.15);

  segment(profile.linkedin.label, {
    continued: !!profile.website,
    color: COLOR.link,
    link: profile.linkedin.href,
    underline: true,
  });
  if (profile.website) {
    segment('   |   ', { continued: true, color: COLOR.muted });
    segment(profile.website.label, { continued: false, color: COLOR.link, link: profile.website.href, underline: true });
  }

  doc.fillColor(COLOR.text);
};

const skillsBlock = (doc, skills) => {
  skills.forEach((skill, index) => {
    resetX(doc);
    doc.font('Lato-Bold').fontSize(9).fillColor(COLOR.text).text(`${skill.label}: `, { continued: true });
    doc.font('Lato').fillColor(COLOR.text).text(skill.value);
    if (index < skills.length - 1) doc.moveDown(0.15);
  });
};

const renderExperience = (doc, entries) => {
  entries.forEach((entry, index) => {
    itemHeader(doc, entry.title, entry.meta);
    if (entry.groups) {
      entry.groups.forEach((group, groupIndex) => {
        groupLabel(doc, group.label);
        group.bullets.forEach((bullet) => bulletLine(doc, bullet));
        if (groupIndex < entry.groups.length - 1) doc.moveDown(0.15);
      });
    } else {
      (entry.bullets || []).forEach((bullet) => bulletLine(doc, bullet));
    }
    if (index < entries.length - 1) doc.moveDown(0.3);
  });
};

const renderSimpleItems = (doc, entries) => {
  entries.forEach((entry, index) => {
    itemHeader(doc, entry.title, entry.meta);
    (entry.bullets || []).forEach((bullet) => bulletLine(doc, bullet));
    if (index < entries.length - 1) doc.moveDown(0.25);
  });
};

// If a row starts with barely any room left on the page, writing its label
// at that near-bottom y can itself overflow and silently spawn an orphan
// page just for the label. Starting the row fresh avoids that entirely.
const MIN_ROW_START_ROOM = 90;

const ensureRoom = (doc, minHeight = MIN_ROW_START_ROOM) => {
  const maxY = doc.page.height - doc.page.margins.bottom;
  if (doc.y + minHeight > maxY) {
    doc.addPage();
  }
};

// Renders one two-column "table row": a bold label in the fixed-width left
// column, and arbitrary flowing content in the right column, closed with a
// full-width rule. The right column can span multiple pages (long Experience
// entries do); a 'pageAdded' listener keeps every continuation page's left
// margin pinned to the right column so wrapped content never bleeds under the
// label column. The label itself is placed on whichever page the row started
// on — it isn't repeated if content continues onto later pages, matching how
// the original template handles overflow.
const renderTableRow = (doc, label, renderContent, { labelFontSize = 10.5 } = {}) => {
  ensureRoom(doc);

  const pageLeft = doc.page.margins.left;
  const rightLeft = pageLeft + LABEL_WIDTH + COL_GAP;
  const startY = doc.y;
  const startPageIndex = currentPageIndex(doc);

  const onPageAdded = () => {
    doc.page.margins.left = rightLeft;
    doc.x = rightLeft;
  };
  doc.on('pageAdded', onPageAdded);
  doc.page.margins.left = rightLeft;
  doc.x = rightLeft;
  renderContent();
  doc.removeListener('pageAdded', onPageAdded);

  const contentBottomY = doc.y;
  const endPageIndex = currentPageIndex(doc);

  doc.switchToPage(startPageIndex);
  doc.page.margins.left = pageLeft;
  doc.font('Raleway-Bold').fontSize(labelFontSize).fillColor(COLOR.text).text(label, pageLeft, startY, { width: LABEL_WIDTH });
  const labelBottomY = doc.y;

  doc.switchToPage(endPageIndex);
  doc.page.margins.left = pageLeft;
  doc.x = pageLeft;
  // Only compare label/content bottoms when they landed on the same page —
  // doc.y is page-relative, so comparing across pages is meaningless.
  doc.y = startPageIndex === endPageIndex ? Math.max(contentBottomY, labelBottomY) : contentBottomY;
  doc.moveDown(0.3);
  drawRule(doc);
  doc.moveDown(0.35);
};

const addPageNumbers = (doc) => {
  const range = doc.bufferedPageRange();
  if (range.count < 2) return;
  const bottomMargin = doc.page.margins.bottom;
  for (let i = range.start; i < range.start + range.count; i += 1) {
    doc.switchToPage(i);
    const savedLeft = doc.page.margins.left;
    doc.page.margins.left = MARGIN;
    doc.page.margins.bottom = 0;
    doc
      .font('Lato')
      .fontSize(8)
      .fillColor(COLOR.muted)
      .text(`Page ${i + 1} of ${range.count}`, MARGIN, doc.page.height - bottomMargin + 16, {
        width: doc.page.width - MARGIN * 2,
        align: 'center',
        lineBreak: false,
      });
    doc.page.margins.bottom = bottomMargin;
    doc.page.margins.left = savedLeft;
  }
};

const generate = async () => {
  const resume = assembleResume();
  const fonts = await loadFonts();

  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
    bufferPages: true,
    info: { Title: `${resume.profile.name} - Resume`, Author: resume.profile.name },
  });

  Object.entries(fonts).forEach(([name, buffer]) => doc.registerFont(name, buffer));

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  const stream = fs.createWriteStream(OUTPUT_PATH);
  doc.pipe(stream);

  renderTableRow(doc, resume.profile.name, () => contactBlock(doc, resume.profile), { labelFontSize: 15 });
  renderTableRow(doc, 'Summary', () => paragraph(doc, resume.summary));
  renderTableRow(doc, 'Experience', () => renderExperience(doc, resume.experience));

  if (resume.projects.length) {
    renderTableRow(doc, 'Projects', () => renderSimpleItems(doc, resume.projects));
  }

  renderTableRow(doc, 'Skills', () => skillsBlock(doc, resume.skills));
  renderTableRow(doc, 'Education', () => renderSimpleItems(doc, resume.education));
  renderTableRow(doc, 'Certifications', () => renderSimpleItems(doc, resume.certifications));

  addPageNumbers(doc);
  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
};

generate()
  .then(() => {
    console.log(`generate-resume-pdf: wrote ${path.relative(process.cwd(), OUTPUT_PATH)}`);
  })
  .catch((err) => {
    console.error('generate-resume-pdf: failed');
    console.error(err);
    process.exit(1);
  });
