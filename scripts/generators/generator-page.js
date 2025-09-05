import minimist from 'minimist';

export const pageGenerator = {
  description: "Criar uma nova página com estrutura completa",
  prompts: [],
  actions: () => {
    const actions = [];

    const args = minimist(process.argv.slice(2));
    const name = args.name;
    const withFilters = args.withFilters !== 'false';
    const withColumns = args.withColumns !== 'false';

    let data = {
      name,
      withFilters,
      withColumns,
    };

    if (!name) {
      throw new Error('O parâmetro --name é obrigatório');
    }

    data.name = name.replace(/-?[Pp]age$/, '');
    data.name += '-page';

    // Determinar o caminho base - usa --dir se fornecido, senão usa src/_pages
    const baseDir = args.dir || "src/_pages";
    const basePath = `${baseDir}/{{kebabCase name}}`;

    // Arquivo index
    actions.push({
      type: "add",
      path: `${basePath}/index.tsx`,
      templateFile: "scripts/templates/pages/page-index.hbs",
      data,
    });

    // Arquivo principal da página
    actions.push({
      type: "add",
      path: `${basePath}/{{kebabCase name}}.tsx`,
      templateFile: "scripts/templates/pages/page.hbs",
      data,
    });

    // Controller da página
    actions.push({
      type: "add",
      path: `${basePath}/{{kebabCase name}}.ctrl.tsx`,
      templateFile: "scripts/templates/pages/page-ctrl.hbs",
      data,
    });

    // Types da página
    actions.push({
      type: "add",
      path: `${basePath}/{{kebabCase name}}.types.tsx`,
      templateFile: "scripts/templates/pages/page-types.hbs",
      data,
    });

    // Colunas (se solicitado)
    if (data.withColumns) {
      actions.push({
        type: "add",
        path: `${basePath}/{{kebabCase name}}.cols.tsx`,
        templateFile: "scripts/templates/pages/page-cols.hbs",
        data,
      });
    }

    // Componente de filtros (se solicitado)
    if (data.withFilters) {
      const filtersPath = `${basePath}/components/{{kebabCase name}}-filters`;
      
      // Componente principal dos filtros
      actions.push({
        type: "add",
        path: `${filtersPath}/{{kebabCase name}}-filters.tsx`,
        templateFile: "scripts/templates/pages/page-filters.hbs",
        data
      });

      // Controller dos filtros
      actions.push({
        type: "add",
        path: `${filtersPath}/{{kebabCase name}}-filters.ctrl.tsx`,
        templateFile: "scripts/templates/pages/page-filters-ctrl.hbs",
        data,
      });

      // Types dos filtros
      actions.push({
        type: "add",
        path: `${filtersPath}/{{kebabCase name}}-filters.types.tsx`,
        templateFile: "scripts/templates/pages/page-filters-types.hbs",
        data,
      });
    }

    return actions;
  },
}; 