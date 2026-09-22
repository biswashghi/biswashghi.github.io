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
const MARGIN = 44;
const LABEL_WIDTH = 92;
const COL_GAP = 14;

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

// A bullet is either a plain string (priority 2) or { text, priority }.
// Priority 1 = always keep; higher numbers are dropped first when the
// resume overflows one page. See fitToOnePage.
const bulletText = (bullet) => (typeof bullet === 'string' ? bullet : bullet.text);
const bulletPriority = (bullet) => (typeof bullet === 'string' ? 2 : bullet.priority ?? 2);

const bulletLine = (doc, bullet) => {
  const text = bulletText(bullet);
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

  const parts = [
    { label: profile.phone.label },
    { label: profile.email.label, href: profile.email.href },
    { label: profile.linkedin.label, href: profile.linkedin.href },
    profile.website ? { label: profile.website.label, href: profile.website.href } : null,
  ].filter(Boolean);

  parts.forEach((part, index) => {
    const last = index === parts.length - 1;
    if (part.href) {
      segment(part.label, { continued: !last, color: COLOR.link, link: part.href, underline: true });
    } else {
      segment(part.label, { continued: !last });
    }
    if (!last) segment('  |  ', { continued: true, color: COLOR.muted });
  });

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
// The threshold is per row: a one-line Certifications row needs far less
// runway than Experience, and a fixed 90pt was pushing short rows onto a
// nearly-empty second page.
const MIN_ROW_START_ROOM = 40;

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
const renderTableRow = (doc, label, renderContent, { labelFontSize = 10.5, minRoom } = {}) => {
  ensureRoom(doc, minRoom);

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
  doc.moveDown(0.2);
  drawRule(doc);
  doc.moveDown(0.25);
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

// Every bullet list in the resume, in document order, so the fit loop can
// find and remove the lowest-priority bullet from wherever it lives.
const bulletLists = (resume) => {
  const lists = [];
  resume.experience.forEach((entry) => {
    if (entry.groups) entry.groups.forEach((group) => lists.push(group.bullets));
    else if (entry.bullets) lists.push(entry.bullets);
  });
  resume.projects.forEach((project) => lists.push(project.bullets));
  resume.education.forEach((entry) => {
    if (entry.bullets) lists.push(entry.bullets);
  });
  return lists;
};

// Removes the single most droppable bullet: highest priority number, and
// among ties the one furthest down the page. Returns the removed bullet, or
// null when only priority-1 bullets remain.
const dropLowestPriority = (resume) => {
  let target = null;
  bulletLists(resume).forEach((list) => {
    list.forEach((bullet, index) => {
      const priority = bulletPriority(bullet);
      if (priority <= 1) return;
      if (!target || priority >= target.priority) target = { list, index, priority };
    });
  });
  if (!target) return null;
  return target.list.splice(target.index, 1)[0];
};

const buildDoc = (resume, fonts) => {
  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
    bufferPages: true,
    info: { Title: `${resume.profile.name} - Resume`, Author: resume.profile.name },
  });
  Object.entries(fonts).forEach(([name, buffer]) => doc.registerFont(name, buffer));

  renderTableRow(doc, resume.profile.name, () => contactBlock(doc, resume.profile), { labelFontSize: 15 });
  renderTableRow(doc, 'Summary', () => paragraph(doc, resume.summary));
  renderTableRow(doc, 'Experience', () => renderExperience(doc, resume.experience), { minRoom: 90 });
  if (resume.projects.length) {
    renderTableRow(doc, 'Projects', () => renderSimpleItems(doc, resume.projects));
  }
  renderTableRow(doc, 'Skills', () => skillsBlock(doc, resume.skills));
  renderTableRow(doc, 'Education', () => renderSimpleItems(doc, resume.education));
  renderTableRow(doc, 'Certifications', () => renderSimpleItems(doc, resume.certifications));
  return doc;
};

// Renders in memory and counts pages; drops the lowest-priority bullet and
// re-renders until everything fits on one page or nothing droppable is left.
const fitToOnePage = (resume, fonts) => {
  const dropped = [];
  for (;;) {
    const probe = buildDoc(resume, fonts);
    const pages = probe.bufferedPageRange().count;
    probe.end();
    if (pages <= 1) return dropped;
    const removed = dropLowestPriority(resume);
    if (!removed) return dropped;
    dropped.push(bulletText(removed));
  }
};

const generate = async () => {
  const resume = assembleResume();
  const fonts = await loadFonts();

  const dropped = fitToOnePage(resume, fonts);
  dropped.forEach((text) => console.log(`generate-resume-pdf: dropped to fit one page: "${text}"`));

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  const stream = fs.createWriteStream(OUTPUT_PATH);
  const doc = buildDoc(resume, fonts);
  doc.pipe(stream);
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
