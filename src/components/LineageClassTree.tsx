import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { lineageClassPaths } from '../data/lineageClassPaths';

const races = ['Todas', 'Humano', 'Elfo', 'Elfo Negro', 'Orc', 'Anão', 'Kamael'];
const stageLabels = ['Classe inicial', 'Primeira profissão', 'Segunda profissão', 'Terceira profissão'];

export function LineageClassTree() {
  const [race, setRace] = useState('Todas');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('pt-BR');
    return lineageClassPaths.filter(path =>
      (race === 'Todas' || path.race === race) &&
      [path.race, ...path.stages, path.role].join(' ').toLocaleLowerCase('pt-BR').includes(term)
    );
  }, [race, query]);

  return (
    <section aria-labelledby="lineage-classes-title" className="space-y-7">
      <header className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-zinc-900 via-zinc-900 to-[#28231b] p-6 sm:p-8">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">Jhota Gamer · Lineage 2</span>
        <h2 id="lineage-classes-title" className="font-cinzel mt-2 text-2xl font-black text-white sm:text-3xl">Escolha seu caminho</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-300">
          Explore a evolução das classes por raça, da classe inicial à terceira profissão.
          As funções resumem o estilo de jogo; habilidades e balanceamento podem mudar.
        </p>
      </header>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por raça">
        {races.map(option => (
          <button
            key={option}
            type="button"
            onClick={() => setRace(option)}
            aria-pressed={race === option}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${
              race === option
                ? 'border-amber-400 bg-amber-500 text-zinc-950'
                : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-amber-500/70 hover:text-amber-300'
            }`}
          >{option}</button>
        ))}
      </div>

      <div className="max-w-md">
        <label htmlFor="lineage-class-search" className="mb-2 block text-sm font-semibold text-zinc-200">Buscar classe ou função</label>
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            id="lineage-class-search"
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Ex.: Duelist, tank, arqueiro"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-3 pl-10 pr-3 text-sm text-white placeholder:text-zinc-500 focus:border-amber-400 focus:outline-none"
          />
        </div>
      </div>

      <p aria-live="polite" className="text-sm text-zinc-400">{filtered.length} caminhos encontrados</p>
      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-700 p-8 text-zinc-400">Nenhum caminho encontrado. Tente outra busca ou selecione outra raça.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(path => (
            <article key={`${path.race}-${path.stages.join('-')}`} className="rounded-2xl border border-zinc-700 bg-gradient-to-br from-zinc-800/90 to-zinc-900 p-5 shadow-lg">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">{path.race}</span>
              <h3 className="font-cinzel mt-1 text-xl font-bold text-white">{path.stages[3]}</h3>
              <ol className="mt-5 space-y-3">
                {path.stages.map((stage, index) => (
                  <li key={`${index}-${stage}`} className={`relative rounded-lg border px-3 py-2 ${
                    index === 3 ? 'border-amber-500/60 bg-amber-500/10' : 'border-zinc-700 bg-zinc-950/50'
                  }`}>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">{stageLabels[index]}</span>
                    <span className={`text-sm ${index === 3 ? 'font-bold text-amber-300' : 'text-zinc-200'}`}>{stage}</span>
                    {index < 3 && <span aria-hidden="true" className="absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 text-amber-400">↓</span>}
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-sm leading-relaxed text-zinc-300">{path.role}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
