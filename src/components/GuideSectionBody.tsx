import React from 'react';
import { Guide } from '../types';

export function GuideSectionBody({ section }: { section: Guide['content']['sections'][number] }) {
  if (!section.blocks) {
    return <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">{section.text}</p>;
  }

  return <div className="space-y-5 min-w-0">
    {section.blocks.map((block, index) => {
      if (block.type === 'paragraph') {
        return <p key={index} className="text-sm sm:text-base text-zinc-300 leading-relaxed">{block.text}</p>;
      }
      if (block.type === 'source') {
        return <a key={index} href={block.url} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-amber-300 underline underline-offset-4 hover:text-amber-200">{block.label}</a>;
      }
      return <div key={index} className="max-w-full overflow-x-auto rounded-xl border border-zinc-700 focus-visible:outline focus-visible:outline-amber-400" tabIndex={0} role="region" aria-label={`Tabela: ${section.heading}`}>
        <table className="w-full min-w-[440px] border-collapse text-left text-sm">
          <caption className="sr-only">{section.heading}</caption>
          <thead className="bg-amber-500/10 text-amber-300">
            <tr>{block.headers.map((header, column) => <th key={column} scope="col" className="px-4 py-3 font-semibold">{header}</th>)}</tr>
          </thead>
          <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex} className="border-t border-zinc-800 even:bg-zinc-900/50 text-zinc-300">
            {row.map((cell, column) => column === 0
              ? <th key={column} scope="row" className="px-4 py-3 font-medium text-zinc-200">{cell}</th>
              : <td key={column} className="px-4 py-3">{cell}</td>)}
          </tr>)}</tbody>
        </table>
      </div>;
    })}
  </div>;
}
