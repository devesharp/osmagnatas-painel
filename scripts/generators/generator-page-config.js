import minimist from 'minimist';

export const pageConfigGenerator = {
  description: "Criar uma nova página de configuração com estrutura completa",
  prompts: [],
  actions: () => {
    const actions = [];

    const args = minimist(process.argv.slice(2));
    const name = args.name;

    let data = {
      name,
    };

    if (!name) {
      throw new Error('O parâmetro --name é obrigatório');
    }

    // Garantir que o nome termine com -page se não terminar
    data.name = name.replace(/-?[Pp]age$/, '');
    data.name += '-page';

    // Determinar o caminho base - usa --dir se fornecido, senão usa src/_pages
    const baseDir = args.dir || "src/_pages";
    const basePath = `${baseDir}/{{kebabCase name}}`;

    // Arquivo index
    actions.push({
      type: "add",
      path: `${basePath}/index.tsx`,
      templateFile: "scripts/templates/pages/page-config-index.hbs",
      data,
    });

    // Arquivo principal da página
    actions.push({
      type: "add",
      path: `${basePath}/{{kebabCase name}}.tsx`,
      templateFile: "scripts/templates/pages/page-config.hbs",
      data,
    });

    // Controller da página
    actions.push({
      type: "add",
      path: `${basePath}/{{kebabCase name}}.ctrl.tsx`,
      templateFile: "scripts/templates/pages/page-config-ctrl.hbs",
      data,
    });

    // Types da página
    actions.push({
      type: "add",
      path: `${basePath}/{{kebabCase name}}.types.tsx`,
      templateFile: "scripts/templates/pages/page-config-types.hbs",
      data,
    });

    return actions;
  },
}; 