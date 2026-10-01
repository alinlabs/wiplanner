import { DailyContentPlan, DailyStoryPlan } from '../types/contentPlan';

/**
 * Export Content Plan data to Microsoft Excel-compatible UTF-8 CSV with BOM (\uFEFF)
 */
export function exportToExcel(plans: DailyContentPlan[], stories: DailyStoryPlan[] = []) {
  const escapeCsv = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const stringVal = String(val).replace(/"/g, '""');
    return `"${stringVal}"`;
  };

  const headers = [
    'Kategori',
    'Tanggal',
    'Hari Ke',
    'Pillar',
    'Jenis Konten',
    'Hook / Judul',
    'Arahan Visual & Detail',
    'Deskripsi / Caption',
    'Hashtag'
  ];

  const rows: string[] = [];
  rows.push(headers.map(escapeCsv).join(','));

  // Rows for Feed Plans
  plans.forEach((p) => {
    const detailStr = p.detail.map((d) => `• ${d}`).join('\n');
    const hashtagStr = Array.isArray(p.hashtag) ? p.hashtag.join(' ') : '';
    rows.push([
      escapeCsv('Feed'),
      escapeCsv(p.tanggal),
      escapeCsv(`Hari ${p.hariKe}`),
      escapeCsv(p.pillar),
      escapeCsv(p.jenis),
      escapeCsv(p.hook),
      escapeCsv(detailStr),
      escapeCsv(p.deskripsi),
      escapeCsv(hashtagStr)
    ].join(','));
  });

  // Rows for Story Plans
  stories.forEach((s) => {
    const detailStr = s.detail.map((d) => `• ${d}`).join('\n');
    rows.push([
      escapeCsv('Story'),
      escapeCsv(s.tanggal),
      escapeCsv(`Hari ${s.hariKe}`),
      escapeCsv(s.pillar),
      escapeCsv(s.jenis),
      escapeCsv(s.hook),
      escapeCsv(detailStr),
      escapeCsv('-'),
      escapeCsv('-')
    ].join(','));
  });

  // Add UTF-8 BOM so Microsoft Excel opens special characters correctly
  const csvContent = '\uFEFF' + rows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Content_Plan_STIE_Wikara_2026.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export Content Plan data to formatted JSON
 */
export function exportToJSON(plans: DailyContentPlan[], stories: DailyStoryPlan[] = []) {
  const exportData = {
    kampus: 'STIE Wibawa Karta Raharja (STIE Wikara Purwakarta)',
    periode: '1 Oktober 2026 s/d 12 November 2026',
    totalFeedPlans: plans.length,
    totalStoryPlans: stories.length,
    feedPlans: plans,
    storyPlans: stories
  };

  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Content_Plan_STIE_Wikara_2026.json');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
