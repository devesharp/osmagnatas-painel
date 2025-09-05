import minimist from 'minimist';

export const pageFormGenerator = {
  description: "Criar uma nova página de formulário com estrutura completa",
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
      templateFile: "scripts/templates/pages/page-form/page-form-index.hbs",
      data,
    });

    // Arquivo principal da página
    actions.push({
      type: "add",
      path: `${basePath}/{{kebabCase name}}.tsx`,
      templateFile: "scripts/templates/pages/page-form/page-form.hbs",
      data,
    });

    // Controller da página
    actions.push({
      type: "add",
      path: `${basePath}/{{kebabCase name}}.ctrl.tsx`,
      templateFile: "scripts/templates/pages/page-form/page-form-ctrl.hbs",
      data,
    });

    // Types da página
    actions.push({
      type: "add",
      path: `${basePath}/{{kebabCase name}}.types.tsx`,
      templateFile: "scripts/templates/pages/page-form/page-form-types.hbs",
      data,
    });

    return actions;
  },
}; 