#!/usr/bin/env node
/**
 * Comprehensive E2E Test Suite for Goleta Insurance Site
 * Tests: Navigation, Forms, Images, Mobile Responsiveness, SEO, Performance
 *
 * Usage: node e2e-test.mjs [--live]
 *   --live    Test the live site (805-insurance.pages.dev)
 *   default   Test local dev server (localhost:4321)
 */

const LIVE_URL = 'https://805-insurance.pages.dev';
const LOCAL_URL = 'http://localhost:4321';
const isLive = process.argv.includes('--live');
const BASE_URL = isLive ? LIVE_URL : LOCAL_URL;

console.log(`\n🧪 E2E Test Suite for Goleta Insurance Site`);
console.log(`📍 Testing: ${BASE_URL}\n`);
console.log('='.repeat(60) + '\n');

const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: []
};

function log(status, test, details = '') {
  const icons = { pass: '✅', fail: '❌', skip: '⏭️', info: 'ℹ️' };
  const icon = icons[status] || '•';
  console.log(`${icon} ${test}${details ? ` - ${details}` : ''}`);

  if (status === 'pass') results.passed++;
  else if (status === 'fail') results.failed++;
  else if (status === 'skip') results.skipped++;

  results.tests.push({ status, test, details });
}

async function fetchPage(path) {
  const url = `${BASE_URL}${path}`;
  const start = Date.now();
  const response = await fetch(url);
  const loadTime = Date.now() - start;
  const html = await response.text();
  return { response, html, loadTime, url };
}

// ============================================
// TEST SUITES
// ============================================

async function testHomepage() {
  console.log('📄 HOMEPAGE TESTS');
  console.log('-'.repeat(40));

  const { response, html, loadTime } = await fetchPage('/');

  // Basic availability
  if (response.ok) {
    log('pass', 'Homepage loads successfully');
  } else {
    log('fail', 'Homepage loads', `Status: ${response.status}`);
    return;
  }

  // Load time
  if (loadTime < 3000) {
    log('pass', `Load time under 3s`, `${loadTime}ms`);
  } else {
    log('fail', `Load time under 3s`, `${loadTime}ms (too slow)`);
  }

  // Hero section
  if (html.includes('Stop Overpaying for Insurance')) {
    log('pass', 'Hero headline present');
  } else {
    log('fail', 'Hero headline present');
  }

  // Hero background image
  if (html.includes('santabarbara-hero') || html.includes('Santa Barbara coastline')) {
    log('pass', 'Hero background image integrated');
  } else {
    log('fail', 'Hero background image integrated');
  }

  // ZIP code form
  if (html.includes('hero-zip-form') && html.includes('Enter ZIP')) {
    log('pass', 'Hero ZIP form present');
  } else {
    log('fail', 'Hero ZIP form present');
  }

  // Services section
  const services = ['Auto Insurance', 'Home Insurance', 'Renters Insurance', 'Life Insurance', 'Business Insurance'];
  const servicesFound = services.filter(s => html.includes(s));
  if (servicesFound.length === services.length) {
    log('pass', 'All service cards present', `${servicesFound.length}/${services.length}`);
  } else {
    log('fail', 'All service cards present', `${servicesFound.length}/${services.length}`);
  }

  // Multi-step form
  if (html.includes('quote-form') || html.includes('MultiStepForm')) {
    log('pass', 'Quote form section present');
  } else {
    log('fail', 'Quote form section present');
  }

  // Testimonials
  if (html.includes('Maria S.') || html.includes('Kevin T.')) {
    log('pass', 'Testimonials/social proof present');
  } else {
    log('fail', 'Testimonials/social proof present');
  }

  // FAQ section
  if (html.includes('How much can I really save')) {
    log('pass', 'FAQ section present');
  } else {
    log('fail', 'FAQ section present');
  }

  // Local areas
  if (html.includes('Goleta') && html.includes('Santa Barbara') && html.includes('Isla Vista')) {
    log('pass', 'Local area mentions present');
  } else {
    log('fail', 'Local area mentions present');
  }

  console.log();
}

async function testNavigation() {
  console.log('🧭 NAVIGATION TESTS');
  console.log('-'.repeat(40));

  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/auto-insurance-goleta/', name: 'Auto Insurance' },
    { path: '/home-insurance-goleta/', name: 'Home Insurance' },
    { path: '/renters-insurance-goleta/', name: 'Renters Insurance' },
    { path: '/life-insurance-goleta/', name: 'Life Insurance' },
    { path: '/business-insurance-goleta/', name: 'Business Insurance' },
    { path: '/es/', name: 'Spanish Homepage' },
    { path: '/privacy/', name: 'Privacy Policy' },
    { path: '/terms/', name: 'Terms of Service' }
  ];

  for (const page of pages) {
    try {
      const { response, loadTime } = await fetchPage(page.path);
      if (response.ok) {
        log('pass', `${page.name} accessible`, `${loadTime}ms`);
      } else {
        log('fail', `${page.name} accessible`, `Status: ${response.status}`);
      }
    } catch (err) {
      log('fail', `${page.name} accessible`, err.message);
    }
  }

  // Test 404 handling
  try {
    const { response } = await fetchPage('/non-existent-page-xyz/');
    if (response.status === 404) {
      log('pass', '404 page returns correct status');
    } else {
      log('info', '404 handling', `Status: ${response.status}`);
    }
  } catch (err) {
    log('skip', '404 handling', err.message);
  }

  console.log();
}

async function testRentersPage() {
  console.log('🏠 RENTERS INSURANCE PAGE TESTS');
  console.log('-'.repeat(40));

  const { response, html } = await fetchPage('/renters-insurance-goleta/');

  if (!response.ok) {
    log('fail', 'Renters page loads', `Status: ${response.status}`);
    return;
  }

  log('pass', 'Renters page loads');

  // UCSB image integration
  if (html.includes('ucsb-campus') || html.includes('UCSB Storke Tower')) {
    log('pass', 'UCSB campus image integrated');
  } else {
    log('fail', 'UCSB campus image integrated');
  }

  // Student-focused content
  if (html.includes('UCSB Students') && html.includes('Isla Vista')) {
    log('pass', 'Student-focused content present');
  } else {
    log('fail', 'Student-focused content present');
  }

  // Pricing section
  if (html.includes('$15') && html.includes('$22') && html.includes('$30')) {
    log('pass', 'Pricing tiers displayed');
  } else {
    log('fail', 'Pricing tiers displayed');
  }

  // Coverage types
  const coverages = ['Personal Property', 'Liability Protection', 'Theft Coverage'];
  const found = coverages.filter(c => html.includes(c));
  if (found.length === coverages.length) {
    log('pass', 'Coverage types listed', `${found.length}/${coverages.length}`);
  } else {
    log('fail', 'Coverage types listed', `${found.length}/${coverages.length}`);
  }

  // FAQ section
  if (html.includes('How much does renters insurance cost')) {
    log('pass', 'Renters FAQ present');
  } else {
    log('fail', 'Renters FAQ present');
  }

  console.log();
}

async function testSEO() {
  console.log('🔍 SEO TESTS');
  console.log('-'.repeat(40));

  const { html } = await fetchPage('/');

  // Title tag
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  if (titleMatch && titleMatch[1].length > 30 && titleMatch[1].length < 70) {
    log('pass', 'Title tag optimal length', `${titleMatch[1].length} chars`);
  } else {
    log('fail', 'Title tag optimal length', titleMatch ? `${titleMatch[1].length} chars` : 'missing');
  }

  // Meta description
  const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/);
  if (descMatch && descMatch[1].length > 120 && descMatch[1].length < 160) {
    log('pass', 'Meta description optimal length', `${descMatch[1].length} chars`);
  } else {
    log('fail', 'Meta description optimal length', descMatch ? `${descMatch[1].length} chars` : 'missing');
  }

  // Open Graph tags
  if (html.includes('og:title') && html.includes('og:description')) {
    log('pass', 'Open Graph tags present');
  } else {
    log('fail', 'Open Graph tags present');
  }

  // Canonical URL
  if (html.includes('rel="canonical"')) {
    log('pass', 'Canonical URL set');
  } else {
    log('fail', 'Canonical URL set');
  }

  // Schema.org markup
  if (html.includes('schema.org') || html.includes('application/ld+json')) {
    log('pass', 'Schema.org markup present');
  } else {
    log('fail', 'Schema.org markup present');
  }

  // H1 tag
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  if (h1Match) {
    log('pass', 'H1 tag present', h1Match[1].substring(0, 40) + '...');
  } else {
    log('fail', 'H1 tag present');
  }

  // Alt text on images
  const imgWithoutAlt = (html.match(/<img(?![^>]*alt=)[^>]*>/g) || []).length;
  if (imgWithoutAlt === 0) {
    log('pass', 'All images have alt text');
  } else {
    log('fail', 'All images have alt text', `${imgWithoutAlt} missing`);
  }

  // Robots.txt
  try {
    const { response: robotsRes } = await fetchPage('/robots.txt');
    if (robotsRes.ok) {
      log('pass', 'robots.txt accessible');
    } else {
      log('fail', 'robots.txt accessible');
    }
  } catch {
    log('fail', 'robots.txt accessible');
  }

  // Sitemap
  try {
    const { response: sitemapRes, html: sitemapHtml } = await fetchPage('/sitemap-index.xml');
    if (sitemapRes.ok && sitemapHtml.includes('sitemap')) {
      log('pass', 'Sitemap accessible');
    } else {
      log('fail', 'Sitemap accessible');
    }
  } catch {
    log('fail', 'Sitemap accessible');
  }

  console.log();
}

async function testCompliance() {
  console.log('⚖️ COMPLIANCE TESTS (PRD Requirements)');
  console.log('-'.repeat(40));

  const pagesToCheck = ['/', '/auto-insurance-goleta/', '/renters-insurance-goleta/'];

  for (const path of pagesToCheck) {
    const { html } = await fetchPage(path);
    const pageName = path === '/' ? 'Homepage' : path.replace(/\//g, '');

    // No agent name
    if (!html.toLowerCase().includes('derrick')) {
      log('pass', `${pageName}: No agent name displayed`);
    } else {
      log('fail', `${pageName}: Agent name found (compliance violation)`);
    }

    // No Allstate branding
    if (!html.toLowerCase().includes('allstate')) {
      log('pass', `${pageName}: No carrier branding`);
    } else {
      log('fail', `${pageName}: Carrier branding found (compliance violation)`);
    }
  }

  // Check for proper disclaimer in footer
  const { html: homeHtml } = await fetchPage('/');
  if (homeHtml.includes('not an insurance company') || homeHtml.includes('educational purposes')) {
    log('pass', 'Compliance disclaimer present');
  } else {
    log('fail', 'Compliance disclaimer missing');
  }

  console.log();
}

async function testImages() {
  console.log('🖼️ IMAGE TESTS');
  console.log('-'.repeat(40));

  const { html } = await fetchPage('/');

  // Check for WebP usage
  if (html.includes('.webp')) {
    log('pass', 'WebP images used');
  } else {
    log('fail', 'WebP images not found');
  }

  // Check for lazy loading
  if (html.includes('loading="lazy"') || html.includes("loading='lazy'")) {
    log('pass', 'Lazy loading implemented');
  } else {
    log('fail', 'Lazy loading not found');
  }

  // Check for eager loading on hero
  if (html.includes('loading="eager"') || html.includes('fetchpriority="high"')) {
    log('pass', 'Hero image eager loading');
  } else {
    log('fail', 'Hero image eager loading not set');
  }

  // Test actual image loading
  const imgMatches = html.match(/src="([^"]*\.(webp|jpg|png)[^"]*)"/g) || [];
  log('info', `Found ${imgMatches.length} image references`);

  // Test first few images
  for (const match of imgMatches.slice(0, 3)) {
    const src = match.match(/src="([^"]+)"/)[1];
    const imgUrl = src.startsWith('http') ? src : `${BASE_URL}${src.startsWith('/') ? '' : '/'}${src}`;
    try {
      const imgRes = await fetch(imgUrl);
      if (imgRes.ok) {
        const size = imgRes.headers.get('content-length');
        log('pass', `Image loads: ${src.split('/').pop()}`, size ? `${Math.round(size/1024)}KB` : '');
      } else {
        log('fail', `Image loads: ${src}`, `Status: ${imgRes.status}`);
      }
    } catch (err) {
      log('fail', `Image loads: ${src}`, err.message);
    }
  }

  console.log();
}

async function testSpanishPage() {
  console.log('🇪🇸 SPANISH PAGE TESTS');
  console.log('-'.repeat(40));

  const { response, html } = await fetchPage('/es/');

  if (!response.ok) {
    log('fail', 'Spanish page loads', `Status: ${response.status}`);
    return;
  }

  log('pass', 'Spanish page loads');

  // Spanish content
  if (html.includes('Seguro') || html.includes('seguro')) {
    log('pass', 'Spanish content present');
  } else {
    log('fail', 'Spanish content present');
  }

  // Lang attribute
  if (html.includes('lang="es"')) {
    log('pass', 'Spanish lang attribute set');
  } else {
    log('fail', 'Spanish lang attribute not set');
  }

  // Local references maintained
  if (html.includes('Goleta') || html.includes('Santa Barbara')) {
    log('pass', 'Local area references in Spanish page');
  } else {
    log('fail', 'Local area references missing');
  }

  console.log();
}

async function testPerformance() {
  console.log('⚡ PERFORMANCE TESTS');
  console.log('-'.repeat(40));

  const pages = ['/', '/auto-insurance-goleta/', '/renters-insurance-goleta/'];
  const loadTimes = [];

  for (const path of pages) {
    const { loadTime, html } = await fetchPage(path);
    loadTimes.push(loadTime);

    // Check HTML size
    const sizeKB = Math.round(html.length / 1024);
    if (sizeKB < 200) {
      log('pass', `${path} HTML size`, `${sizeKB}KB`);
    } else {
      log('fail', `${path} HTML size too large`, `${sizeKB}KB`);
    }
  }

  const avgLoadTime = Math.round(loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length);
  if (avgLoadTime < 2000) {
    log('pass', `Average load time`, `${avgLoadTime}ms`);
  } else if (avgLoadTime < 3000) {
    log('info', `Average load time acceptable`, `${avgLoadTime}ms`);
  } else {
    log('fail', `Average load time too slow`, `${avgLoadTime}ms`);
  }

  console.log();
}

async function testFormStructure() {
  console.log('📝 FORM STRUCTURE TESTS');
  console.log('-'.repeat(40));

  const { html } = await fetchPage('/');

  // Required form fields per PRD
  const requiredFields = [
    { name: 'firstName', label: 'First Name' },
    { name: 'lastName', label: 'Last Name' },
    { name: 'email', label: 'Email' },
    { name: 'phone', label: 'Phone' },
    { name: 'zipCode', label: 'ZIP Code' }
  ];

  for (const field of requiredFields) {
    if (html.includes(field.name) || html.includes(field.label.toLowerCase())) {
      log('pass', `Form field: ${field.label}`);
    } else {
      log('fail', `Form field: ${field.label} missing`);
    }
  }

  // Insurance type selector
  if (html.includes('insuranceType') || html.includes('Insurance Type') || html.includes('insurance-type')) {
    log('pass', 'Insurance type selector present');
  } else {
    log('fail', 'Insurance type selector missing');
  }

  // Submit button
  if (html.includes('type="submit"') || html.includes("type='submit'")) {
    log('pass', 'Submit button present');
  } else {
    log('fail', 'Submit button missing');
  }

  // Form action/handler
  if (html.includes('submit-lead') || html.includes('form') || html.includes('handleSubmit')) {
    log('pass', 'Form submission handler present');
  } else {
    log('fail', 'Form submission handler missing');
  }

  console.log();
}

// ============================================
// MAIN EXECUTION
// ============================================

async function runAllTests() {
  const startTime = Date.now();

  try {
    // Verify site is reachable first
    const { response } = await fetchPage('/');
    if (!response.ok) {
      console.log(`❌ Site not reachable at ${BASE_URL}`);
      console.log('   If testing locally, make sure dev server is running: npm run dev\n');
      process.exit(1);
    }
  } catch (err) {
    console.log(`❌ Cannot connect to ${BASE_URL}`);
    console.log(`   Error: ${err.message}`);
    console.log('   If testing locally, make sure dev server is running: npm run dev\n');
    process.exit(1);
  }

  await testHomepage();
  await testNavigation();
  await testRentersPage();
  await testSEO();
  await testCompliance();
  await testImages();
  await testSpanishPage();
  await testPerformance();
  await testFormStructure();

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('='.repeat(60));
  console.log('\n📊 TEST SUMMARY\n');
  console.log(`   ✅ Passed:  ${results.passed}`);
  console.log(`   ❌ Failed:  ${results.failed}`);
  console.log(`   ⏭️  Skipped: ${results.skipped}`);
  console.log(`   ⏱️  Duration: ${duration}s`);
  console.log();

  const total = results.passed + results.failed;
  const passRate = total > 0 ? ((results.passed / total) * 100).toFixed(1) : 0;

  if (results.failed === 0) {
    console.log(`🎉 All tests passed! (${passRate}% pass rate)\n`);
  } else {
    console.log(`⚠️  ${results.failed} test(s) failed (${passRate}% pass rate)\n`);

    console.log('Failed tests:');
    results.tests
      .filter(t => t.status === 'fail')
      .forEach(t => console.log(`   • ${t.test}${t.details ? `: ${t.details}` : ''}`));
    console.log();
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

runAllTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
