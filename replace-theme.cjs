const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/components/Dashboard.jsx',
  'src/components/GrievanceDetailPanel.jsx',
  'src/components/GrievanceTable.jsx',
  'src/components/MainLayout.jsx',
  'src/components/Sidebar.jsx',
];

const replacements = [
  { from: /bg-\[#0d0f1a\]/g, to: 'bg-slate-50' },
  { from: /bg-\[#0a0118\]/g, to: 'bg-white' },
  { from: /bg-\[#0f111a\]\/40/g, to: 'bg-slate-50/90' },
  { from: /text-white/g, to: 'text-slate-900' },
  { from: /text-gray-400/g, to: 'text-slate-600' },
  { from: /text-gray-500/g, to: 'text-slate-500' },
  { from: /text-gray-600/g, to: 'text-slate-400' },
  { from: /text-gray-100/g, to: 'text-slate-800' },
  { from: /text-gray-700/g, to: 'text-slate-400' },
  { from: /border-white\/5/g, to: 'border-slate-200' },
  { from: /border-white\/10/g, to: 'border-slate-200' },
  { from: /border-white\/\[0\.03\]/g, to: 'border-slate-200' },
  { from: /bg-white\/\[0\.01\]/g, to: 'bg-white' },
  { from: /bg-white\/\[0\.02\]/g, to: 'bg-white' },
  { from: /bg-white\/\[0\.03\]/g, to: 'bg-slate-100' },
  { from: /bg-white\/5/g, to: 'bg-slate-200' },
  { from: /bg-gray-900\/40/g, to: 'bg-slate-100' },
  { from: /bg-gray-900\/60/g, to: 'bg-white' },
  { from: /bg-gray-900\/20/g, to: 'bg-slate-100' },
  { from: /bg-gray-800/g, to: 'bg-slate-200' },
  { from: /border-gray-800/g, to: 'border-slate-300' },
  { from: /bg-transparent/g, to: 'bg-white' },
  { from: /placeholder:text-gray-600/g, to: 'placeholder:text-slate-400' },
  { from: /text-emerald-50/g, to: 'text-emerald-900' },
  { from: /text-indigo-100/g, to: 'text-indigo-900' },
  { from: /text-orange-100/g, to: 'text-orange-900' },
  { from: /bg-black\/40/g, to: 'bg-white' },
];

filesToUpdate.forEach(file => {
  const fullPath = path.join('d:\\C-DATA\\Desktop\\india innovate - Copy', file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // special replacement for the ministry gap
    if (file.includes('Dashboard.jsx')) {
      content = content.replace(
        '<div className="flex items-center gap-3">\\n          <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase ml-2">Ministry</span>',
        '<div className="flex items-center gap-3 mr-8">\\n          <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase ml-2">Ministry</span>'
      );
      // Wait, let's just replace the ministry filter div
      content = content.replace(
        '{/* Ministry Filter */}\\n        <div className="flex items-center gap-3">',
        '{/* Ministry Filter */}\\n        <div className="flex items-center gap-3 pr-8 border-r border-slate-200 mr-4">'
      );
    }

    replacements.forEach(r => {
      content = content.replace(r.from, r.to);
    });

    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
  }
});
